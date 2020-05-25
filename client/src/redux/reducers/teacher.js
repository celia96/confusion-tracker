import { LOG_IN } from '../actions';

const defaultState = {
  teacherId: '',
  email: 'celiachoy96@gmail.com',
  firstName: 'Celia',
  lastName: 'Choy'
};

const teacher = (state = defaultState, action) => {
  switch (action.type) {
    case LOG_IN:
      const teacherInfo = Object.assign({}, action.payload);
      return Object.assign({}, state, teacherInfo);
    default:
      return state;
  }
};

export default teacher;
