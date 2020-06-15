// Student
export const JOIN_CLASS = 'JOIN_CLASS';
export const LEAVE_CLASS = 'LEAVE_CLASS';
export const UPDATE_CONFUSION = 'UPDATE_CONFUSION';

// Teacher
export const LOAD_PROFILE = 'LOAD_PROFILE';
export const LOG_IN = 'LOG_IN';
export const LOG_OUT = 'LOG_OUT';

// Class Room
export const START_CLASS = 'START_CLASS';
export const UPDATE_CLASS = 'UPDATE_CHART';
export const END_CLASS = 'END_CLASS';

export const joinClass = payload => {
  return {
    type: JOIN_CLASS,
    payload
  };
};

export const leaveClass = () => {
  return {
    type: LEAVE_CLASS
  };
};

export const updateConfusion = confusion => {
  return {
    type: UPDATE_CONFUSION,
    payload: confusion
  };
};

export const login = accessToken => {
  return {
    type: LOG_IN,
    payload: accessToken
  };
};

export const logout = () => {
  return {
    type: LOG_OUT
  };
};

export const loadProfile = teacherInfo => {
  return {
    type: LOAD_PROFILE,
    payload: teacherInfo
  };
};

export const startClass = classId => {
  return {
    type: START_CLASS,
    payload: classId
  };
};

export const updateClass = classInfo => {
  return {
    type: UPDATE_CLASS,
    payload: classInfo
  };
};

export const endClass = () => {
  return {
    type: END_CLASS
  };
};
