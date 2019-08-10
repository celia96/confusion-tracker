/* eslint-disable no-console: "error" */

const http = require('http');
const { app } = require('./server');

const mongoose = require('mongoose');

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    auth: { authdb: 'admin' }
  })
  .then(() => {
    const server = http.createServer(app).listen(process.env.PORT || 3001);
    console.log('Listening on port %d', server.address().port); // eslint-disable-line no-console
  })
  .catch(err => {
    console.log('mongoose connection failed');
    console.log(err);
  });
