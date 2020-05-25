const mongoose = require('mongoose');

// if (!process.env.MONGODB_URI) {
//   /* eslint-disable-next-line no-console */
//   console.log('Error: MONGODB_URI is not set. Did you run source env.sh ?');
//   process.exit(1);
// }
//
// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   auth: { authdb: 'admin' }
// });

// studentSchema
// - nickname or name (String): set by student
// - confused or not (Boolean by default = false): set by student
//
// professorSchema
// - email (String)
// - password (String)
//
// classSchema
// - owner of the class (mongoose.Schema.ObjectId): the owner will be the professor
// - password of classroom (String): set by prof
// - topics (Array): set by prof
// - tags (Array of objects = [{tag: time}, {tag: time}, {tag: time}]): set by students
// - confusion (Array of objects = [{time: confusion-level}, {time: confusion-level}, {time: confusion-level}]) : set by students
// - students attending (Array): we can iterate through students attending and check whether they are confused or not
// - Level of confusion level that should give an alert to the professors (Integer by default: 50% of students attending): set by professor
//
// commentSchema
// - comment (set by students)
// - level of confusion (1 - 5) (set by students)

const studentSchema = new mongoose.Schema({
  nickname: {
    type: String,
    required: true
  }
});

const professorSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: false
  }
});

const classSchema = new mongoose.Schema({
  students: {
    type: Map,
    required: true
  },
  roomName: {
    type: String,
    required: true
  },
  owner: {
    type: String,
    required: true
  },
  tags: {
    type: Map,
    required: true
  },
  isOver: {
    type: Boolean,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  alert: {
    type: Number,
    required: true
  },
  data: {
    type: Array,
    required: true
  },
  labels: {
    type: Array,
    required: true
  }
});

const commentSchema = new mongoose.Schema({
  confusionlevel: {
    type: Map,
    required: true
  },
  comments: {
    type: Array,
    required: true
  },
  roomName: {
    type: String,
    required: true
  }
});

const Student = mongoose.model('Student', studentSchema);
const Professor = mongoose.model('Professor', professorSchema);
const Class = mongoose.model('Class', classSchema);
const Comment = mongoose.model('Comment', commentSchema);

module.exports = {
  Student,
  Professor,
  Class,
  Comment
};
