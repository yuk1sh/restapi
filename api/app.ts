import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const authRouter = require('./routes/auth');

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);

// postとdeleteのみ
app.use('/login', authRouter);

// Herokuなどにのせるとき環境変数PORTを使う可能性があるため入れておく
const port = process.env.PORT || 4200;

app.listen(port);