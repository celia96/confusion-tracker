import { JOIN_CLASS, LEAVE_CLASS, UPDATE_CONFUSION } from '../actions';

const defaultState = {
  studentId: '',
  confusionState: false,
  currentClass: {
    classId: '',
    courseName: ''
  }
};

const student = (state = defaultState, action) => {
  switch (action.type) {
    case JOIN_CLASS:
      // update student id
      const { studentId, classId, courseName } = action.payload;
      const joinedClass = {
        classId,
        courseName
      };
      return Object.assign({}, state, { studentId, currentClass: joinedClass });
    case LEAVE_CLASS:
      // empty student id
      return Object.assign({}, defaultState);
    case UPDATE_CONFUSION:
      // update confusion
      return Object.assign({}, state, { confusionState: action.payload });
    default:
      return state;
  }
};

export default student;
