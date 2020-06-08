/* eslint-disable no-console */
/* eslint func-names: ["error", "never"] */

const express = require('express');
const bodyParser = require('body-parser');
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
    useFindAndModify: false,
    auth: { authdb: 'admin' }
  });
} else {
  console.log('mongoose connection failed');
}

const models = require('./models/models');

const { Class, Course, Teacher } = models;

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
    {
      usernameField: 'email',
      passwordField: 'password'
    },
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

/* In Class */
/*
As a student and a teacher, I would like to see the current status/info of the class
- GET: api/class/:classId
    - receive: class id
    - response: all the info about the class
*/
// CONFIRMED & USED - 2
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
// CONFIRMED & USED
app.get('/api/courses/:teacherId', async (request, response) => {
  const { teacherId } = request.params;
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
});

/*
As a teacher, I would like to create a new course
- POST: api/course
    - receive: teacherId, course name
    - response: new course
*/
// CONFIRMED & USED
app.post('/api/course', async (request, response) => {
  const { teacherId, courseName } = request.body;
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
});

/* Manage Course Detail */
/*
As a teacher, I would like to see the list of classes and students of a given course.
- GET: api/course/:courseId
    - receive: course id
    - response: course info
*/
// CONFIRMED & USED
app.get('/api/course/:courseId', async (request, response) => {
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
});

/*
As a teacher, I would like to update info of a given course.
- PUT: api/course/:courseId
    - receive: course id, courseName
    - response: course info
*/
// CONFIRMED & USED
app.put('/api/course/:courseId', async (request, response) => {
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
});

/*
As a teacher, I would like to delete a course
- DELETE: api/course
    - receive: course id, teacher id
    - response: ok
*/
// CONFIRMED & USED
app.delete('/api/course/:courseId', async (request, response) => {
  const { courseId } = request.params;
  const { teacherId } = request.body;
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
});

/*
As a teacher, I would like to add a student to a given course.
- POST: api/course/students/:courseId
    - receive: course id, name, student id, email
    - response: updated course info
*/
// NEED TEST & NOT SURE IF THIS IS NEEDED (TBD)
app.post('/api/course/students/:courseId', async (request, response) => {
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

/* Manage Class Analytics */
/*
As a teacher, I would like to delete a class of a given date
- DELETE: api/class/:classId
    - receive: class id, course id
    - response: ok
*/
// NEED TEST
app.delete('/api/class/:classId', async (request, response) => {
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
});

// When create a course, append it to the teacher as well (0)
// When delete a course, remove it from the teacher as well (0)

// When create a class, append it to the course as well (x)
// When delete a class, remove it from the courses as well (0)

// redirect after deletion

module.exports = {
  app
};
