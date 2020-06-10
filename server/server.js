/* eslint-disable no-console */
/* eslint func-names: ["error", "never"] */
/* eslint no-underscore-dangle: [2, { "allow": ["_id"] }] */

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const jwt = require('jwt-simple');

const models = require('./models/models');

const { Class, Course, Teacher } = models;
const app = express();
const SECRET = 'MY_SECRET';

// Databased (mlab) setup
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    auth: { authdb: 'admin' }
  });
} else {
  console.log('mongoose connection failed');
}

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
  console.log('serialize user ', user);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  Teacher.findById(id, (err, user) => {
    console.log('deserialize user ', user);
    done(err, user);
  });
});

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    (email, password, done) => {
      Teacher.findOne({ email }, function(err, user) {
        const token = jwt.encode(user, SECRET);
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: 'Incorrect email.' });
        }
        if (!user.verifyPassword(password)) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        const { _id, email, firstName, lastName } = user._doc;
        const response = {
          _id,
          email,
          firstName,
          lastName,
          token
        };
        return done(null, response);
      });
    }
  )
);

passport.use(
  new BearerStrategy(function(token, done) {
    const decoded = jwt.decode(token, SECRET);
    const { email } = decoded;
    Teacher.findOne({ email }, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      return done(null, user, { scope: 'all' });
    });
  })
);

// CONFIRMED & USED (0)
app.post(
  '/api/login',
  passport.authenticate('local', { session: false }),
  (req, res) => {
    return res.json(req.user);
  }
);

// CONFIRMED & USED (0)
app.get('/api/logout', function(req, res) {
  req.logout();
  res.sendStatus(200);
});

// CONFIRMED & USED (0)
app.post('/api/register', async (request, response) => {
  const { email, password, firstName, lastName } = request.body;
  if (!email || !firstName || !lastName) {
    return response.sendStatus(400);
  }
  try {
    const teacher = await Teacher.findOne({ email });
    if (teacher) {
      return response.sendStatus(400);
    }
    const newTeacher = new Teacher({
      email,
      firstName,
      lastName,
      password,
      courses: []
    });
    newTeacher.password = newTeacher.generateHash(password);
    const saved = await newTeacher.save();
    if (!saved) {
      return response.sendStatus(400);
    }
    return response.json(saved);
  } catch (err) {
    return response.sendStatus(500);
  }
});

// CONFIRMED & USED (0)
app.get(
  '/api/me',
  passport.authenticate('bearer', { session: false }),
  (req, res) => {
    res.json(req.user);
  }
);

// CONFIRMED & USED (0)
app.post(
  '/api/me',
  passport.authenticate('bearer', { session: false }),
  async (request, response) => {
    const teacherId = request.user && request.user._id;

    const { email, firstName, lastName } = request.body;
    if (!email || !firstName || !lastName) {
      return response.sendStatus(400);
    }
    try {
      await Teacher.findByIdAndUpdate(teacherId, {
        email,
        firstName,
        lastName
      });
      return response.sendStatus(200);
    } catch (err) {
      return response.sendStatus(500);
    }
  }
);

/* In Class */
/*
As a student and a teacher, I would like to see the current status/info of the class
- GET: api/class/:classId
    - receive: class id
    - response: all the info about the class
*/
// CONFIRMED & USED - 2 (by Teacher and Student)
app.get('/api/class/:classId', async (request, response) => {
  const { classId } = request.params;
  if (!classId) {
    return response.sendStatus(400);
  }
  try {
    const classRoom = await Class.findById(classId);
    if (!classRoom) {
      return response.sendStatus(400);
    }
    return response.json(classRoom);
  } catch (err) {
    return response.sendStatus(500);
  }
});

/* Manage Course */
/*
As a teacher, I would like to see the list of courses I created sorted by their dates
- GET: api/courses
    - receive: teacher id
    - response: list of courses
*/
// CONFIRMED & USED (0)
app.get(
  '/api/courses',
  passport.authenticate('bearer', { session: false }),
  async (request, response) => {
    const teacherId = request.user && request.user._id;

    if (!teacherId) {
      return response.sendStatus(400);
    }
    try {
      const teacher = await Teacher.findById(teacherId).populate('courses');
      const courses = teacher && teacher.courses;
      if (!teacher || !courses) {
        return response.sendStatus(400);
      }
      // sort courses by date
      const sortedCourses = courses.sort(
        (a, b) => new Date(b.dateCreated) - new Date(a.dateCreated)
      );
      return response.json(sortedCourses);
    } catch (err) {
      return response.sendStatus(500);
    }
  }
);

/*
As a teacher, I would like to create a new course
- POST: api/course
    - receive: teacherId, course name
    - response: new course
*/
// CONFIRMED & USED (0)
app.post(
  '/api/course',
  passport.authenticate('bearer', { session: false }),
  async (request, response) => {
    const { courseName } = request.body;
    const teacherId = request.user && request.user._id;

    if (!teacherId || !courseName) {
      return response.sendStatus(400);
    }
    try {
      const course = new Course({
        courseName,
        teacher: teacherId,
        dateCreated: Date.now(),
        classes: [],
        students: []
      });
      const newCourse = await course.save();
      if (!newCourse) {
        return response.sendStatus(400);
      }
      await Teacher.findByIdAndUpdate(teacherId, {
        $push: { courses: newCourse }
      });
      return response.json(newCourse);
    } catch (err) {
      return response.sendStatus(500);
    }
  }
);

/* Manage Course Detail */
/*
As a teacher, I would like to see the list of classes and students of a given course.
- GET: api/course/:courseId
    - receive: course id
    - response: course info
*/
// CONFIRMED & USED (0)
app.get(
  '/api/course/:courseId',
  passport.authenticate('bearer', { session: false }),
  async (request, response) => {
    const { courseId } = request.params;
    if (!courseId) {
      return response.sendStatus(400);
    }
    try {
      const course = await Course.findById(courseId)
        .populate({
          path: 'classes',
          select: '_id courseName dateCreated attendees'
        })
        .populate('students');
      if (!course) {
        return response.sendStatus(400);
      }
      return response.json(course);
    } catch (err) {
      return response.sendStatus(500);
    }
  }
);

/*
As a teacher, I would like to update info of a given course.
- PUT: api/course/:courseId
    - receive: course id, courseName
    - response: course info
*/
// CONFIRMED & USED (0)
app.put(
  '/api/course/:courseId',
  passport.authenticate('bearer', { session: false }),
  async (request, response) => {
    const { courseId } = request.params;
    const { courseName } = request.body;
    if (!courseId || !courseName) {
      return response.sendStatus(400);
    }
    try {
      await Course.findByIdAndUpdate(courseId, { courseName });
      return response.json(courseName);
    } catch (err) {
      return response.sendStatus(500);
    }
  }
);

/*
As a teacher, I would like to delete a course
- DELETE: api/course
    - receive: course id, teacher id
    - response: ok
*/
// CONFIRMED & USED (0)
app.delete(
  '/api/course/:courseId',
  passport.authenticate('bearer', { session: false }),
  async (request, response) => {
    const { courseId } = request.params;
    const teacherId = request.user && request.user._id;

    if (!courseId || !teacherId) {
      return response.sendStatus(400);
    }
    try {
      await Course.findByIdAndDelete(courseId);
      await Teacher.findByIdAndUpdate(teacherId, {
        $pull: { courses: courseId }
      });
      return response.sendStatus(200);
    } catch (err) {
      return response.sendStatus(500);
    }
  }
);

/*
As a teacher, I would like to add a student to a given course.
- POST: api/course/students/:courseId
    - receive: course id, name, student id, email
    - response: updated course info
*/
// NEED TEST & NOT SURE IF THIS IS NEEDED (TBD)
/* app.post('/api/course/students/:courseId', async (request, response) => {
  const { courseId } = request.params;
  const { name, studentId, email } = request.body;
  if (!studentId) {
    return response.sendStatus(400);
  }
  try {
    const course = await Course.findById(courseId);
    const students = course && course.students;
    if (!course || !students) {
      return response.sendStatus(400);
    }
    students.push({
      name,
      studentId,
      email
    });
    course.students = students;
    const updatedCourse = await course.save();
    return response.json(updatedCourse);
  } catch (err) {
    return response.sendStatus(500);
  }
});
 */

/* Manage Class Analytics */
/*
As a teacher, I would like to delete a class of a given date
- DELETE: api/class/:classId
    - receive: class id, course id
    - response: ok
*/
// NEED TEST (not used yet)
app.delete(
  '/api/class/:classId',
  passport.authenticate('bearer', { session: false }),
  async (request, response) => {
    const { classId } = request.params;
    const { courseId } = request.body;
    if (!classId) {
      return response.sendStatus(400);
    }
    try {
      await Class.findByIdAndDelete(classId);
      await Course.findByIdAndUpdate(courseId, {
        $pull: { classes: classId }
      });
      return response.sendStatus(200);
    } catch (err) {
      return response.sendStatus(500);
    }
  }
);

// When create a course, append it to the teacher as well (0)
// When delete a course, remove it from the teacher as well (0)

// When create a class, append it to the course as well (x)
// When delete a class, remove it from the courses as well (0)

// redirect after deletion

module.exports = {
  app
};
