import express from 'express';
import { AuthType } from './interfaces';

const dbClient = require('../db/client');

const router = express.Router();

// ログイン ： JWTを生成
router.post('/', (req, res) => {
	console.log('POST /login');
	dbClient.login(req.body, function(code: number, auth: AuthType | null, error?: string) {
		res.status(code).json(auth);
	});
});

module.exports = router;