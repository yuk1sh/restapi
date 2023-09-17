import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
	console.log('/');
	res.status(200).send(' ₍₍⁽⁽ REST API ₎₎⁾⁾');
});

module.exports = router;