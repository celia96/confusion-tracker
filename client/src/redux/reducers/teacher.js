import { LOAD_PROFILE, LOG_IN, LOG_OUT } from '../actions';

const defaultState = {
  clientToken: '',
  teacherId: '',
  email: '',
  firstName: '',
  lastName: ''
};

const teacher = (state = defaultState, action) => {
  switch (action.type) {
    case LOG_IN:
      const token = action.payload;
      return Object.assign({}, state, { clientToken: token });
    case LOG_OUT:
      return Object.assign({}, defaultState);
    case LOAD_PROFILE:
      const teacherInfo = Object.assign({}, action.payload);
      return Object.assign({}, state, teacherInfo);
    default:
      return state;
  }
};

export default teacher;
