const mongoose = require('mongoose');

const { Schema } = mongoose;

/* 
Teacher
- email: String
- first name: String
- last name: String
- password: String
- Courses: [courseSchema]

Course
- course name: String
- Teacher: { type: Schema.ObjectId, ref: 'Teacher' }
- dateCreated: Date
- Classes: [classSchema]

Class
- course name: 
- dateCreated: Date
- Teacher: { type: Schema.ObjectId, ref: 'Teacher' }
- code: String
- agendas: Map { agenda1: [list of questions], agenda2: [list of questions] }
- alert: int
- duration: int
- attendees: Map { studentID: confused(bool) }
- survey: Map { comments: [], ratings: Map { 1: #, 2: #, 3: #, 4: #, 5: # } }
- isOver: Bool
- graph: Map { data: [], labels: [] }
*/

const classSchema = new mongoose.Schema({
  course: {
    type: Schema.ObjectId,
    ref: 'Course'
  },
  teacher: {
    type: Schema.ObjectId,
    ref: 'Teacher'
  },
  courseName: {
    type: String
  },
  confusionRate: {
    type: Number,
    required: true
  },
  attendees: {
    type: Map,
    required: true
  },
  questions: {
    type: Map
  },
  dateCreated: {
    type: Number
  },
  chartData: {
    type: Array
  },
  isOver: {
    type: Boolean
  }
});

const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true
  },
  teacher: {
    type: Schema.ObjectId,
    ref: 'Teacher'
  },
  dateCreated: {
    type: Number,
    required: true
  },
  classes: [{ type: Schema.Types.ObjectId, ref: 'Class' }],
  students: [
    {
      name: {
        type: String
      },
      studentId: {
        type: String,
        required: true
      },
      email: {
        type: String
      }
    }
  ]
});

const teacherSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }]
});

const Class = mongoose.model('Class', classSchema);
const Course = mongoose.model('Course', courseSchema);
const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = {
  Class,
  Course,
  Teacher
};
