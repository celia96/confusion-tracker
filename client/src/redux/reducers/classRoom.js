import { START_CLASS, UPDATE_CLASS, END_CLASS } from '../actions';

const defaultState = {
  classId: '',
  courseName: '',
  questions: {},
  students: [],
  confusionRate: 0,
  chartData: [],
  dateCreated: ''
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
