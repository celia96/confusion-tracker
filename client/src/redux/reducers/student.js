import { JOIN_CLASS, LEAVE_CLASS, UPDATE_CONFUSION } from '../actions';

const defaultState = {
  studentId: '00669404',
  confusionState: false
};

const student = (state = defaultState, action) => {
  switch (action.type) {
    case JOIN_CLASS:
      // update student id
      return Object.assign({}, state, { studentId: action.payload });
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
