import express, { Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import routes from './routes';

const app: Application = express();

app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(routes);

export default app;