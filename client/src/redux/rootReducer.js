import { combineReducers } from 'redux';

import teacher from './reducers/teacher';
import student from './reducers/student';
import classRoom from './reducers/classRoom';

const rootReducer = combineReducers({
  teacher,
  student,
  classRoom
});

export default rootReducer;
