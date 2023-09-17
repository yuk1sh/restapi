const jwt = require('jsonwebtoken');
import { AuthType } from '../routes/interfaces';
import SECRET_KEY from './.ssh/id_rsa';

const verifyToken = (req: any, res: any, next: any): void => {
  jwt.verify(req.body.token, SECRET_KEY, (err: any, decoded: { id: string }) => {
    if (err)
      res.status(500).json({ id: undefined, auth: false, token: req.body.token });
    const auth: AuthType = 
    {
      id: decoded.id,
      auth: true,
      token: req.body.token
    };
    req.body.auth = auth;
    next();
  });
}

module.exports = verifyToken;