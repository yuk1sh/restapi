const dbConfig = require("./config");

const users = require('./models/users');
const posts = require("./models/posts");

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

import SECRET_KEY from '../auth/.ssh/id_rsa';

import { UserType, PostType, AuthType } from '../routes/interfaces';

interface callbackType {
	(code: number, data: UserType | PostType | AuthType | null, error?: string) :void
};

var dbClient:any = function() {
  // db access
  dbConfig
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err:any) => {
    console.error('Unable to connect to the database:', err);
  });
}

// .findAll() 全て取得

// read (find)

dbClient.prototype.getUser = (id: string, callback: callbackType, auth: AuthType) => {
  // tokenを持っていれば検証してidを割り出す
  if (auth.token)
  {
    jwt.verify(auth.token, SECRET_KEY, (err: any, decoded: { id: string }) => {
      if (err)
        return ;
      auth.id = decoded.id;
      auth.auth = true;
    });
  }
  console.log(auth);
  users.findByPk(id)
  .then((user:any) => {
    if (user) {
      // 取得しようとしているユーザが本人なら情報丸ごとわたす
      console.log(auth.id, user.id);
      if (auth.id === user.id)
      {
        callback(200, user, undefined);
        return ;
      }
      user.email = '';
      user.passhash = '';
      callback(200, user, undefined);
    } else {
      callback(404, null, undefined);
    }
  })
  .catch((err:any) => {
    callback(500, null, err);
  });
};

// PostTypeは全ユーザに開示されているので、tokenの検証はいらない
dbClient.prototype.getPost = (id: string, callback: callbackType) => {
  posts.findByPk(id)
  .then((post: PostType) => {
    if (post) {
      callback(200, post, undefined);
    } else {
      callback(404, null, undefined);
    }
  })
  .catch((err: string) => {
    callback(500, null, err);
  });
};

// create (signup/post)

dbClient.prototype.signup = (param: any, callback: callbackType) => {
  users.create(param)
  .then((user: UserType) => {
    const payload = { id: user.id };
    const token = jwt.sign(payload, SECRET_KEY, {
      algorithm: 'HS256',
      expiresIn: '15m'
    });
    callback(200, {id: user.id, auth: true, token: token}, undefined);
  })
  .catch((err: string) => {
    callback(500, null, err);
  });
};

// routesでToken検証し、Tokenが有効でなけば事前に弾ける
dbClient.prototype.post = (param: any, callback: callbackType) => {
  var data:PostType = {
    userid: param.auth.id,
    text: param.text,
    // reply_to に指定されたUUIDが実在しなければ強制でundefinedにするべきかも？
    // *リプライの事前予約を防ぐため
    reply_to: param.reply_to
  }
  posts.create(data)
  .then((post: PostType) => {
    callback(200, post, undefined);
  })
  .catch((err: string) => {
    callback(500, null, err);
  });
};

// update (change)

dbClient.prototype.update = (filter: any, param: any, callback: callbackType) => {
  users.update(param, { where: filter })
  .then((user: UserType) => {
    callback(200, user, undefined);
  })
  .catch((err: string) => {
    callback(500, null, err);
  });
};

// delete

dbClient.prototype.deletePost = (filter: any, callback: callbackType) => {
  posts.destroy({ where: filter })
  .then((post: PostType | null) => {
    callback(200, post, undefined);
  })
  .catch((err: string) => {
    callback(500, null, err);
  });
};

dbClient.prototype.deleteUser = (filter: any, callback: callbackType) => {
  users.destroy({ where: filter })
  .then((user: UserType | null) => {
    callback(200, user, undefined);
  })
  .catch((err: string) => {
    callback(500, null, err);
  });
};

/**
 * @returns {
 *  auth: true/false,
 *  token: token
 * }
 */
dbClient.prototype.login = (req:any, callback: callbackType): void => {
  users.findOne({ where: { email: req.email } })
  .then((user:any) => {
    if (user) {
      const passwordIsValid = bcrypt.compareSync(req.password, user.passhash);
      if (!passwordIsValid)
        return callback(401, null, undefined);
      const payload = { id: user.id };
      const token = jwt.sign(payload, SECRET_KEY, {
        algorithm: 'HS256',
        expiresIn: '15m'
      });
      callback(200, { id: user.id, auth: true, token: token }, undefined);
    } else {
      callback(401, null, undefined);
    }
  })
  .catch((err:any) => {
    // emailを特定できないように、emailかpasswordもしくは両方間違っているとき401を返す
    callback(401, null, err);
  });
};

module.exports = new dbClient();