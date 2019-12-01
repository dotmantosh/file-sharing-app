import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import multer from 'multer'
import path from 'path'

import { MongoClient } from 'mongodb'
import assert from 'assert'
import AppRouter from './router'

//file storage configuration
const storageDir = path.join(__dirname, '..', 'storage')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, storageDir)
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage })
//end of file storage configuration

const port = 5000;
const app = express();


app.use(morgan('dev'));
app.use(cors({
  exposedHeaders: "*"
}));
app.use(bodyParser.json({
  limit: '50mb'
}));
app.set('root', __dirname);
app.set('storageDir', storageDir)
app.set('upload', upload)

// connect to the database and start the server
const url = 'mongodb://localhost:27017';
const dbName = 'fileshareapp'

MongoClient.connect(url, (err, client) => {
  assert.equal(null, err);

  const db = client.db(dbName);
  app.set('db', db);
  /* client.close(); */



  //initialize router
  new AppRouter(app)
  console.log('connected to mongodb')
  app.listen(process.env.port || port, () => {
    console.log(`App is running on port ${port}`);
  });
});


export default app;