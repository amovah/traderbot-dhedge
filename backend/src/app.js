import 'babel-polyfill';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import routes from './routes';
import traderBot from './traderBot';

let dbUrl;
if (process.env.DB_USERNAME) {
  dbUrl = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_URI}/${process.env.DB_NAME}?authSource=admin`;
} else {
  dbUrl = `mongodb://${process.env.DB_URI}/${process.env.DB_NAME}`;
}

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('error', (error) => {
  console.error(`Database connection error ${error}`);

  process.exit(0);
});

mongoose.connection.on('disconnected', () => {
  console.error('Disconnected from database');

  process.exit(0);
});

traderBot();

const app = express();

app.use(express.json());
app.use(cors());

app.use(routes);

app.listen(process.env.APP_PORT || 7080, () => {
  console.log(`Server is listening on port ${process.env.APP_PORT || 7080}`);
});
