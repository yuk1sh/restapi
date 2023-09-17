import express from 'express';

const dbClient = require('../db/client');
const verifyToken = require('../auth/verifyToken');
import { PostType } from './interfaces';

const router = express.Router();

/**
 * Postは全データが公開されているのでログインが必要ない
 * ルートパラメータのidに合致するPostを取得して返す
 */
router.get('/:id', (req, res) => {
	const { id } = req.params;
	console.log('GET /posts/' + id);
	dbClient.getPost(id, function(code: number, post: PostType | null, error?: string) {
    res.status(code).json(post);
		if (error)
			console.log(error);
  });
});

/**
 * verifyToken を呼ぶ
 * - token/無効: 失敗をresponseする
 * - token/有効: reqにtokenから解読したidを代入し next() で3番目の引数を呼び出す
 * 3番目の引数: tokenから読み取ったuserのidで投稿する（投稿者のidを指定する）
 */
router.post('/', verifyToken, (req, res) => {
	console.log('POST /posts/');
	dbClient.post(req.body, function(code: number, post: PostType | null, error?: string) {
		res.status(code).json(post);
		if (error)
			console.log(error);
	});
});

// 投稿は編集できない方がよさそう（信頼性を損なうため）なので、PUTに対応しない

/**
 * verifyToken を呼ぶ
 * - token/無効: 失敗をresponseする
 * - token/有効: reqにtokenから解読したidを代入し next() で3番目の引数を呼び出す
 * 3番目の引数: tokenから読み取ったuserのidとルートパラメータのidに合致するPostのステータスを削除済みとする
 */
router.delete('/:id', verifyToken, (req, res) => {
	if (!req.body.auth.auth)
		res.status(500).json({ id: undefined, auth: false, token: req.body.token });
	// token有効
	console.log('DELETE /posts/' + req.body.auth.id);
	const filter = {
		id: req.body.auth.id,
		userid: req.body.id
	}
	dbClient.deletePost(filter, function(code: number, post: PostType | null, error?: string) {
  	res.status(code).json(post);
		if (error)
			console.log(error);
  });
});

module.exports = router;