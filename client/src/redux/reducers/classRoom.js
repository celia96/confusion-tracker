import { START_CLASS, UPDATE_CLASS, END_CLASS } from '../actions';

const defaultState = {
  classId: '5eb8b0de7c213e5d2fa7eb7e',
  className: 'CS101',
  questions: {},
  students: [],
  confusionRate: 0,
  chart: {
    data: [],
    labels: []
  }
};

const classRoom = (state = defaultState, action) => {
  switch (action.type) {
    case START_CLASS:
      return state;
    case UPDATE_CLASS:
      const classInfo = Object.assign({}, action.payload);
      return Object.assign({}, state, classInfo);
    case END_CLASS:
      return Object.assign({}, defaultState);
    default:
      return state;
  }
};

export default classRoom;
