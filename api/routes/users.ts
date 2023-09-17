import express from 'express';
import { runInNewContext } from 'vm';

const bcrypt = require('bcryptjs');
const dbClient = require('../db/client');
const verifyToken = require('../auth/verifyToken');
import { AuthType, UserType } from './interfaces';

const router = express.Router();

// // ユーザ情報の閲覧 (本人であればemailとpasshash閲覧可能)
// router.get('/:id', (req, res) => {
// 	const { id } = req.params;
// 	console.log('GET /users/' + id);
// 	dbClient.getUser(id, function(result:any) {
//     res.status(result.status).json(result.record);
//   }, req.body.auth);
// });

// ユーザ情報 (本人であればemailとpasshashも閲覧可能)
router.get('/:id', (req, res) => {
	const { id } = req.params;
	console.log('GET /users/' + id);
	// もしauthがundefinedなら定義しておく
	var auth: AuthType = {
		id: undefined,
		auth: false,
		token: null
	}
	if (typeof(req.body.token) === 'string')
		auth.token = req.body.token;
	dbClient.getUser(id, function(code: number, user: UserType | null, error?: string) {
    res.status(code).json(user);
  }, auth);
});

// ユーザ登録 (ログインなし)
router.post('/', (req, res) => {
	const { name, email, password } = req.body;
	const data = {
		name: name,
		email: email,
		passhash: bcrypt.hashSync(password, 10)
	};
	dbClient.signup(data, function(code: number, auth: AuthType | null, error?: string) {
		res.status(code).json(auth);
	});
	console.log('POST /users/');
});

// ユーザ情報変更 (ログイン必須)
router.put('/:id', verifyToken, (req, res) => {
	console.log('PUT /users/' + req.params.id);
	dbClient.update({ id: req.params.id }, req.body, function(code: number, user: UserType | null, error?: string) {
    res.status(code).json(user);
  });
});

/**
 * ユーザ削除
 * verifyToken を呼ぶ
 * - token/無効: 失敗をresponseする
 * - token/有効: reqにtokenから解読したidを代入し next() で3番目の引数を呼び出す
 * 3番目の引数: tokenから読み取ったuserのidを削除する
 */
router.delete('/', verifyToken, (req, res) => {
	if (!req.body.auth.auth)
		res.status(500).json({ id: undefined, auth: false, token: req.body.token });
	// token有効
	console.log('DELETE /users/' + req.body.auth.id);
	dbClient.deleteUser({ id: req.body.auth.id }, function(code: number, user: UserType | null, error?: string) {
  	res.status(code).json(user);
  });
});

module.exports = router;