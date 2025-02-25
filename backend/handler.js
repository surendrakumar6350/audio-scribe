const serverless = require("serverless-http");
const express = require("express");
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const allApis = require('./routes/api');
const {limiter} = require('./utils/limiter');
const { corsOptions } = require('./utils/corsOptions')


app.set('trust proxy', function (ip) {
  return ip === '127.0.0.1';
});

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.options('*', cors(corsOptions));

app.use(limiter);

app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Hello! Sever is Running...",
  });
});

app.use('/v1', allApis);

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

exports.handler = serverless(app);
