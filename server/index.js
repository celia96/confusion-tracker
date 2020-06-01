/* eslint-disable no-console */
const mongoose = require('mongoose');
const http = require('http');
const { app } = require('./server');
const models = require('./models/models');

const { Class } = models;
// Socket IO setup
const server = http.createServer(app);
const io = require('socket.io')(server);

server.listen(process.env.PORT || 3001);

console.log('Listening on port %d', server.address().port); // eslint-disable-line no-console

io.on('connection', async socket => {
  console.log('connected');

  socket.on('joinClass', async ({ studentId, isOrganizer, classId }) => {
    try {
      if (!classId) {
        throw new Error('No room!');
      }

      if (!isOrganizer && (!studentId || !studentId.trim())) {
        throw new Error('No studentId!');
      }
      let username;
      if (isOrganizer) {
        username = 'organizer';
      } else {
        username = studentId;
      }

      if (!isOrganizer) {
        // if it's a student
        const classRoom = await Class.findById(classId);
        if (!classRoom) {
          throw new Error('class room not found');
        }
        if (!classRoom.attendees.has(studentId)) {
          classRoom.attendees.set(studentId, false);
        }
        const updatedRoom = await classRoom.save();
        socket.join(classId, () => {
          io.in(classId).emit(
            'message',
            `${username} has joined in ${classId}`
          );
          io.in(classId).emit('classRoom', updatedRoom);
        });
      } else {
        socket.join(classId, () => {
          socket.emit('message', `${username} just joined in ${classId}`);
        });
      }
    } catch (err) {
      console.log(err);
      socket.emit('message', err);
    }
  });

  socket.on('leaveClass', async ({ studentId, classId }) => {
    try {
      if (!classId || !studentId) {
        throw new Error('missing ids');
      }
      socket.leave(classId);
      const classRoom = await Class.findById(classId);
      classRoom.attendees.delete(classId);
      const updatedRoom = await classRoom.save();
      io.in(classId).emit('classRoom', updatedRoom);
    } catch (err) {
      console.log(err);
      socket.emit('message', err);
    }
  });

  socket.on('classRoom', async classId => {
    try {
      if (!classId) {
        throw new Error('missing ids');
      }
      const classRoom = await Class.findById(classId);
      // const classRoom = await Class.findOne({ classId });
      if (!classRoom) {
        throw new Error('class room not found');
      }
      socket.emit('classRoom', classRoom);
    } catch (err) {
      console.log(err);
      socket.emit('message', err);
    }
  });

  // update confusion
  socket.on('toggleConfusion', async ({ classId, studentId }) => {
    try {
      if (!classId || !studentId) {
        throw new Error('missing ids');
      }
      const classRoom = await Class.findById(classId);
      // const classRoom = await Class.findOne({ classId });
      if (!classRoom || !classRoom.attendees.has(studentId)) {
        throw new Error('class room or student not found');
      }
      const confusion = classRoom.attendees.get(studentId);
      if (confusion) {
        classRoom.confusionRate -= 1;
      } else {
        classRoom.confusionRate += 1;
      }
      classRoom.attendees.set(studentId, !confusion);

      const updatedRoom = await classRoom.save();
      // console.log('updated ', updatedRoom);
      socket.emit('classRoom', updatedRoom);
    } catch (err) {
      console.log(err);
      socket.emit('message', err);
    }
  });

  // add question
  socket.on('addQuestion', async ({ classId, studentId, text, timestamp }) => {
    try {
      console.log('adding question');
      if (!classId || !studentId || !text) {
        throw new Error('missing inputs');
      }
      const classRoom = await Class.findById(classId);
      // const classRoom = await Class.findOne({ classId });
      if (!classRoom) {
        throw new Error('class room not found');
      }

      const questionId = mongoose.Types.ObjectId().toString();
      const upvoter = new Map();
      upvoter.set(studentId, false);
      const question = {
        questionId,
        askedBy: studentId,
        text,
        timestamp,
        upvoters: []
      };
      classRoom.questions.set(questionId, question);

      const updatedRoom = await classRoom.save();
      // console.log('updated ', updatedRoom);
      io.in(classId).emit('classRoom', updatedRoom);
    } catch (err) {
      console.log(err);
      socket.emit('message', err);
    }
  });

  // upvote question
  socket.on(
    'toggleUpvoteQuestion',
    async ({ classId, studentId, questionId }) => {
      try {
        console.log('toggling upvote');
        if (!classId || !studentId || !questionId) {
          throw new Error('missing ids');
        }
        const classRoom = await Class.findById(classId);
        // const classRoom = await Class.findOne({ classId });
        if (!classRoom || !classRoom.questions.has(questionId)) {
          throw new Error('class room or question not found');
        }

        const question = classRoom.questions.get(questionId);
        const upvoters = question.upvoters.slice();
        const upvoted = upvoters.indexOf(studentId);
        if (upvoted !== -1) {
          // already voted; undo upvote
          console.log('undo');
          upvoters.splice(upvoted, 1);
        } else {
          // not voted; upvote
          console.log('yes upvote');
          upvoters.push(studentId);
        }

        question.upvoters = upvoters;
        classRoom.questions.set(questionId, question);

        const updatedRoom = await classRoom.save();
        // console.log('updated ', updatedRoom);
        io.in(classId).emit('classRoom', updatedRoom);
      } catch (err) {
        console.log(err);
        socket.emit('message', err);
      }
    }
  );

  // end class
});
