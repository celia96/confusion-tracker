/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
/* eslint no-unused-vars: ["error", { "args": "none" }] */

const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');

const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const { OAuth2Client } = require('google-auth-library');

const app = express();
// Databased (mlab) setup
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    auth: { authdb: 'admin' }
  });
} else {
  console.log('mongoose connection failed');
}

const models = require('./models/models');

const { Professor, Class, Comment } = models;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS
  }
});

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  // Resolve client build directory as absolute path to avoid errors in express
  const path = require('path'); // eslint-disable-line global-require
  const buildPath = path.resolve(__dirname, '../client/build');

  app.use(express.static(buildPath));

  // Serve the HTML file included in the CRA client on the root path
  app.get('/', (request, response) => {
    response.sendFile(path.join(buildPath, 'index.html'));
  });
}

// TODO: Add any middleware here
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  Professor.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    (email, password, done) => {
      // Find the user with the given username
      Professor.findOne({ email })
        .then(user => {
          // if no user present, auth failed
          if (!user) {
            done(null, { message: 'Incorrect username.' });
          }
          // if passwords do not match, auth failed
          if (user.password !== password) {
            done(null, { message: 'Incorrect password.' });
          }
          // auth has has succeeded
          done(null, user);
        })
        .catch(err => {
          console.log('ERROR', err);
          done(err);
        });
    }
  )
);

passport.use(
  new BearerStrategy((token, done) => {
    googleClient
      .verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
      })
      .then(async ticket => {
        const payload = ticket.getPayload();
        let user = await Professor.findOne({ googleId: payload.sub });
        if (!user) {
          const arr = [{ googleId: payload.sub, email: payload.email }];
          user = await Professor.insertMany(arr);
          [user] = user;
        }
        done(null, user);
      })
      .catch(error => {
        done(error);
      });
  })
);

// Professor: Get my information
app.get('/api/me', (request, response) => {
  if (request.user) {
    response.json({
      success: true,
      id: request.user.id,
      professor: request.user.email
    });
  } else {
    response.json({ success: false });
  }
});

// Professor: Registration
app.post('/api/professor/register', (request, response) => {
  const { email, password } = request.body;
  // if email or password does not exist
  if (!email || !password) {
    response.send('Email or password is missing!');
    return;
  }
  new Professor({
    email,
    password
  })
    .save()
    .then(() => {
      response.json({ success: true });
    })
    .catch(err => {
      console.log('Error in signup: ', err);
    });
});

// Professor: Login
app.post(
  '/api/professor/login',
  passport.authenticate('local'),
  (request, response) => {
    if (request.user) {
      response.json({ id: request.user.id, professor: request.user.email });
    } else {
      response.json({ message: request.message });
    }
  }
);

// Professor: Google login
app.post(
  '/api/professor/googleLogin',
  passport.authenticate('bearer', { session: false }),
  (request, response, next) => {
    response.json({ id: request.user.id, professor: request.user.email });
  }
);

// Professor: Logout
app.post('/api/logout', (request, response) => {
  request.logout();
  response.json({ success: true });
});

// Profesoor: Creating a class room
app.post('/api/professor/create/room', (request, response) => {
  const { roomName, owner, tags, duration, alert } = request.body;
  if (!roomName || !owner) {
    response.send('Something is missing!');
    return;
  }
  Class.findOne({ roomName })
    .then(room => {
      if (room) {
        response.json({ success: false, message: 'room already exists' });
        return Promise.reject();
      }
      // convert tags from array to Map
      const mapTags = tags.reduce((map, tag) => {
        map.set(tag, 0);
        return map;
      }, new Map());
      return new Class({
        students: new Map(),
        roomName,
        owner,
        tags: mapTags,
        duration,
        alert,
        data: [],
        labels: [],
        isOver: false
      }).save();
    })
    .then(saved => {
      response.json({ success: true, room: saved });
    })
    .catch(err => {
      console.log(err);
    });
});

// Professor: getting room information
app.get('/api/professor/get/:roomName', (request, response) => {
  const { roomName } = request.params;
  Class.findOne({ roomName })
    .then(room => {
      response.json({ success: true, room });
    })
    .catch(err => {
      console.log(err);
    });
});

// Student: joining a class room (check if room exists)
app.get('/api/student/join/:roomName', (request, response) => {
  const { roomName } = request.params;
  Class.findOne({ roomName })
    .then(room => {
      if (room) {
        if (!room.isOver) {
          response.json({ success: true, room });
        } else {
          response.json({
            success: false,
            message: 'This room is not available anymore'
          });
        }
      } else {
        response.json({ success: false, message: 'This room does not exist' });
      }
    })
    .catch(err => {
      console.log(err);
    });
});

// Student: Login
app.post('/api/student/login', (request, response) => {
  const { roomName, nickname } = request.body;
  if (!nickname) {
    response.send('No nickname given!');
    return;
  }
  Class.findOne({ roomName })
    .then(room => {
      if (!room) {
        response.json({ success: false, message: 'room does not exist' });
        return Promise.reject();
      }
      if (room.students.has(nickname)) {
        response.json({ success: false, message: 'nickname already exists' });
        return Promise.reject();
      }
      room.students.set(nickname, false);
      return room.save();
    })
    .then(updatedRoom => {
      response.json({ success: true, room: updatedRoom, nickname });
    })
    .catch(err => {
      console.log(err);
    });
});

// Student: post comments and confusion level rating to the given class
app.post('/api/student/comment/:roomName', (request, response) => {
  const { comment, confusionlevel } = request.body;
  const { roomName } = request.params;
  if (comment && confusionlevel) {
    Comment.findOne({ roomName })
      .then(result => {
        result.comments.push(comment);
        const count =
          parseInt(result.confusionlevel.get(confusionlevel), 10) + 1;
        result.confusionlevel.set(confusionlevel, count);
        return result.save();
      })
      .then(saved => {
        response.json({ success: true, survey: saved });
      })
      .catch(err => {
        console.log(err);
        response.json({ success: false });
      });
  } else {
    response.json({ success: false });
  }
});

// Student: Add tags to the given class
app.post('/api/tags', (request, response) => {
  const { roomName, tag } = request.body;
  Class.findOne({ roomName })
    .then(room => {
      const { tags } = room;
      if (tags.has(tag)) {
        tags.set(tag, tags.get(tag) + 1);
      } else {
        tags.set(tag, 1);
      }
      return room.save();
    })
    .then(result => {
      response.json({ success: true, tags: result.tags });
    })
    .catch(err => {
      console.log(err);
    });
});

// Professor & Student: Get all the list of tags
app.get('/api/tags/:roomName', (request, response) => {
  const { roomName } = request.params;
  Class.findOne({ roomName })
    .then(room => {
      response.json({ success: true, tags: room.tags });
    })
    .catch(err => {
      console.log(err);
    });
});

// Professor: Get the confusion states of the students in the given room
app.get('/api/confusions/:roomName', (request, response) => {
  // get number of confusions from database
  const { roomName } = request.params;
  Class.findOne({ roomName })
    .then(room => {
      response.json({ success: true, students: room.students });
    })
    .catch(err => {
      console.log(err);
    });
});

// Student: Get the confusion state of the given student in the given room
// so that when the students reload the page, their confusion state will be set
// to their confusion state not to the default state
app.get('/api/confusions/:roomName/:student', (request, response) => {
  const { roomName, student } = request.params;
  Class.findOne({ roomName })
    .then(room => {
      const confusionState = room.students.get(student);
      response.json({ success: true, confused: confusionState });
    })
    .catch(err => {
      console.log(err);
    });
});

// Professor: get the list of comments and ratings
app.get('/api/comments/ratings/:roomName', (request, response) => {
  const { roomName } = request.params;
  Comment.findOne({ roomName })
    .then(survey => {
      if (survey) {
        response.json({
          success: true,
          comments: survey.comments,
          ratings: survey.confusionlevel
        });
      } else {
        response.json({ success: false, comments: [], ratings: {} });
      }
    })
    .catch(err => console.log(err));
});

// Student: Update the confusion state
app.put('/api/confusions', (request, response) => {
  const { nickname, roomName, confused } = request.body;
  Class.findOne({ roomName })
    .then(room => {
      room.students.set(nickname, confused);
      return room.save();
    })
    .then(updated => {
      response.json({ success: true, students: updated.students });
    })
    .catch(err => {
      console.log(err);
    });
});

// Professor: ending class and creating comments database for the given room
app.post('/api/end/class', (request, response) => {
  const { roomName, data, labels, email } = request.body;
  Class.findOneAndUpdate(
    { roomName },
    {
      $set: { isOver: true, data, labels }
    }
  )
    .then(result => {
      const map = new Map();
      map.set('1', 0);
      map.set('2', 0);
      map.set('3', 0);
      map.set('4', 0);
      map.set('5', 0);
      return new Comment({
        comments: [],
        confusionlevel: map,
        roomName
      }).save();
    })
    .then(() => {
      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: `Your class ${roomName} has just finished.`,
        text: `You can see the reports of the ${roomName} in https://confusion-tracker.herokuapp.com/#/professor/summary/${roomName}`
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log(`Email sent: ${info.response}`);
        }
      });
      response.json({ success: true });
    })
    .catch(err => {
      console.log(err);
    });
});

// Student: checking whether the class is over or not
// this route will be used for changing the students page into the student summary view
// when the class is over
app.get('/api/end/class/:roomName', (request, response) => {
  const { roomName } = request.params;
  Class.findOne({ roomName })
    .then(room => {
      response.json({ isOver: room.isOver });
    })
    .catch(err => {
      console.log(err);
    });
});

// Professor: get list of all classes that belong to the given professor
app.get('/api/classes/:professor', (request, response) => {
  const { professor } = request.params;
  Class.find({ owner: professor })
    .then(classes => {
      response.json({ success: true, classes });
    })
    .catch(err => console.log(err));
});

module.exports = {
  app
};
