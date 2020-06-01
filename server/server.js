/* eslint-disable no-console */
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');

const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;

const app = express();

// Databased (mlab) setup
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    auth: { authdb: 'admin' }
  });
} else {
  console.log('mongoose connection failed');
}

const models = require('./models/models');

const { Class, Course, Teacher } = models;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS
  }
});

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
  Teacher.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    (email, password, done) => {
      // Find the user with the given username
      Teacher.findOne({ email }, function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false);
        }
        if (!user.verifyPassword(password)) {
          return done(null, false);
        }
        return done(null, user);
      });
    }
  )
);

passport.use(
  new BearerStrategy(function(token, done) {
    Teacher.findOne({ token }, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      return done(null, user, { scope: 'read' });
    });
  })
);

/*
As a student and a teacher, I would like to have today’s agenda, set by the instructor, displayed in my screen.
- GET: api/class/:classId
    - send: class id
    - receive: all the info about the class
*/
// used
app.get('/api/class/:classId', async (request, response) => {
  const { classId } = request.params;
  if (!classId) {
    return response.sendStatus(400);
  }
  try {
    const classRoom = await Class.findById(classId);
    // const classRoom = await Class.findOne({ classId });
    if (!classRoom) return response.sendStatus(400);
    return response.json(classRoom);
  } catch (err) {
    return response.sendStatus(500);
  }
});

// Student
/* 
As a student, I would like to join the class when the class starts by its room ID and enter the room code and my student ID to join the room
- POST: api/student/join
    - send: class code
    - receive: true or false
- POST: api/student/login
    - send: class code, student id
*/
app.post('/api/student/join', async (request, response) => {
  const { classCode } = request.body;
  if (!classCode) {
    return response.sendStatus(400);
  }
  try {
    const room = await Class.findOne({ code: classCode });
    if (!room || room.isOver) {
      return response.sendStatus(400);
    }
    response.json({ class: room });
  } catch (err) {
    console.log(err);
    response.sendStatus(500);
  }
});

app.post('/api/student/login', async (request, response) => {
  const { classCode, studentId } = request.body;
  if (!classCode || !studentId) {
    return response.sendStatus(400);
  }
  try {
    const room = await Class.findOne({ code: classCode });
    if (!room || room.attendees.has(studentId)) {
      return response.sendStatus(400);
    }
    room.students.set(studentId, false);
    const updatedRoom = await room.save();
    response.json({ class: updatedRoom });
  } catch (err) {
    console.log(err);
    response.sendStatus(500);
  }
});

/*
    As a student, I would like to rate the class difficulty and make comments after the class ends
- POST: api/class/:classId/survey
    - send: ratings, comments
*/
app.post('/api/class/:classId/survey', async (request, response) => {
  const { classId } = request.params;
  const { rating, comment } = request.body;
  if (!classId || !rating || !comment) {
    return response.sendStatus(400);
  }
  try {
    const room = await Class.findById(classId);
    if (!room) {
      return response.sendStatus(400);
    }
    const { ratings, comments } = room.survey;
    ratings.set(rating, ratings.get(rating) + 1);
    comments.push(comment);
    await room.save();
    response.sendStatus(200);
  } catch (err) {
    console.log(err);
    response.sendStatus(500);
  }
});

// Teacher
/*
As a teacher, I would like create an account with an email and receive a verification code to set the first name, last name, and password of the created account.
- POST: api/teacher/register
    - send: email, first name, last name, password
    - POST: api/send/code
        - send: email
    - POST: api/send/code
        - send: code
        - receive: true or false
- POST: api/teacher/login
    - send: email, first name, last name, password
*/
app.post('/api/teacher/register', async (request, response) => {
  const { email, firstName, lastName, password } = request.body;
  // if email or password does not exist
  if (!email || !password || !firstName || !lastName || password) {
    return response.sendStatus(400);
  }
  const teacher = new Teacher({
    email,
    firstName,
    lastName,
    password,
    courses: []
  });
  try {
    await teacher.save();
    response.sendStatus(200);
  } catch (err) {
    console.log(err);
    response.sendStatus(500);
  }
});

app.post('/api/send/code', async (request, response) => {
  const { email } = request.body;

  // if email or password does not exist
  if (!email) {
    return response.sendStatus(400);
  }
  // Create a random code
  const emailConfirmCode = Math.floor(Math.random() * 100 + 54);
  // save the code to database
  console.log('email confirmation code ', emailConfirmCode);
  // Send it to the given email
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Verifcation code for your email account',
    text: `Hello, please use the following code to verify your email: ${emailConfirmCode}`
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      response.sendStatus(500);
    } else {
      response.sendStatus(200);
    }
  });
});

app.post('/api/verify/code', async (request, response) => {
  const { code } = request.body;

  // if code is not given
  if (!code) {
    return response.sendStatus(400);
  }
  try {
    // compare the code in database
    if (code !== '') {
      console.log('wrong verification code');
      response.sendStatus(400);
    } else {
      response.sendStatus(200);
    }
  } catch (err) {
    console.log(err);
    response.sendStatus(500);
  }
});
app.post(
  'api/teacher/login',
  passport.authenticate('local'),
  (request, response) => {
    if (request.user) {
      response.json({ teacher: request.user });
    } else {
      return response.sendStatus(400);
    }
  }
);

/*
As a teacher, I would like to see the list of courses I made and be able to create a new course (but if the name of the class already exists, I cannot add a class).
- GET: api/teacher/me
    - send: request.user
    - receive: teacher’s profile
- POST: api/teacher/create/course
    - send: request.user, course name
*/
app.get('/api/teacher/me', (request, response) => {
  if (request.user) {
    response.json({
      success: true,
      teacher: request.user
    });
  } else {
    response.sendStatus(400);
  }
});

app.post('/api/teacher/create/course', async (request, response) => {
  const { teacher, courseName } = request.body;
  if (!teacher || !courseName) {
    return response.sendStatus(400);
  }
  const course = new Course({
    courseName,
    teacher: teacher._id,
    dateCreated: Date.now(),
    classes: []
  });
  try {
    const newCourse = await course.save();
    response.json({ course: newCourse });
  } catch (err) {
    console.log(err);
    response.sendStatus(500);
  }
});

/*
As a teacher, I would like to see the list of classes I created for each course sorted by their dates added in a descending order.
- GET: api/teacher/course/:courseName
    - send: course id
    - receive: list of classes
*/
app.post('/api/teacher/course/:courseId', async (request, response) => {
  const { courseId } = request.body;
  if (!courseId) {
    return response.sendStatus(400);
  }

  try {
    const classes = await Course.findById(courseId).populate('classes');
    response.json({ classes });
  } catch (err) {
    console.log(err);
    response.sendStatus(500);
  }
});

/*
As a teacher, I would like to delete a class of a certain course
- DELETE: api/teacher/course/:courseId
*/
app.delete('/api/teacher/course/:courseId', async (request, response) => {
  const { courseId } = request.body;
  if (!courseId) {
    return response.sendStatus(400);
  }

  try {
    await Course.findByIdAndDelete(courseId);
    response.sendStatus(200);
  } catch (err) {
    console.log(err);
    response.sendStatus(500);
  }
});

/*
As a teacher, I would like to add a new class for a certain course and set the duration, alert rate, and the agendas. When adding a new class, I would be informed a class code (courseName + date + time i.e. CSCI312-20191029-1230)
- POST: api/teacher/startClass
    - send: course name, duration, alert rate, and the agendas
*/
app.post('/api/teacher/start/class', async (request, response) => {
  const { teacher, course, duration, alert, agendas } = request.body;
  if (!teacher || !course || !duration || !alertRate || !agendas) {
    return response.sendStatus(400);
  }

  const { courseId, courseName } = course;
  const { teacherId } = teacher;
  if (!courseId || !courseName) {
    return response.sendStatus(400);
  }
  try {
    const code = 'CSCI302-2019-10-19-12-30';
    const dateCreated = '2019-10-19-12-30';
    const newClass = new Class({
      course: courseId,
      code,
      teacher: teacherId,
      attendees: new Map(),
      agendas: new Map(),
      dateCreated,
      duration,
      alert,
      confusionGraph: { data: [], labels: [] },
      isOver: false
    });
    await newClass.save();
    response.json({ class: newClass });
  } catch (err) {
    console.log(err);
    response.sendStatus(500);
  }
});

/*
As a teacher, I would like to see the confusion state of the students in class that can be displayed in a graph or in a percentage in real time, a removable class code dialog box, class agendas, list of questions according to their agenda 
- GET: api/class/:classId (already there)
    - send: class Id
    - receive: confusion state of the students, agendas, questions
*/

/*
As a teacher, I would like to end the class and let the students do survey for the class
- POST: api/class/:classId/end
    - send: class Id
    - receive: success or not
*/
app.post('/api/class/:classId/end', async (request, response) => {
  const { classId } = request.body;
  if (!classId) {
    return response.sendStatus(400);
  }

  try {
    await Class.findById(classId, {
      $set: { isOver: true }
    });
    response.sendStatus(200);
  } catch (err) {
    console.log(err);
    response.sendStatus(500);
  }
});

/*
As a teacher, I would like to see the report for each class that contains the agenda, confusion graph, questions uploaded, ratings, and comments.
- GET: api/class/:classId (already there)
    - send: class id
    - receive: confusion state of the students, agendas, questions
*/

module.exports = {
  app
};
