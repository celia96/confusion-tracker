/* eslint no-console: "error"*/
/* eslint spaced-comment: "error"*/

// const request = require('supertest');
const { app } = require('./server');
// const { Class } = require('./models/models');
const MongodbMemoryServer = require('mongodb-memory-server').default;
const mongoose = require('mongoose');

test('Server "smoke" test', () => {
  expect(app).toBeDefined();
});

// const confusions = [];
const mongoServer = new MongodbMemoryServer();

beforeAll(() => {
  // By return a Promise, Jest won't proceed with tests until the Promise
  // resolves
  return mongoServer.getConnectionString().then(mongoURL => {
    return Promise.all([
      mongoose.connect(mongoURL, { useNewUrlParser: true }),
      mongoServer.getDbName()
    ]);
  });
  // .then(([connection, dbName]) => {
  //   db = connection.db(dbName);
  //   app.locals.db = db; // Set db in app.js
  // })
  // .then(() => {
  //   db.collection('articles').createIndex({ title: 1 }, { unique: true });
  // });
});

afterAll(() => {
  return mongoServer.stop();
});

describe('Confusion Tracker API', () => {
  beforeEach(() => {
    // By default insert adds the _id to the object, i.e. modifies article
    // return db.collection('confusions').insertMany(confusions);
    // Insert fake confusions via mongoose
  });

  afterEach(() => {
    // Delete all fake confusions via Mongoose
    // return db.collection('confusions').deleteMany({});
  });

  /* test('GET /api/confusions should return all students in a class', () => {
    return request(app)
      .get('/api/confusions')
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.headers['content-type']).toEqual(
          expect.stringContaining('json')
        );
        expect(response.body).toEqual(Array.from(Class.students.values()));
      });
  }); */
});
