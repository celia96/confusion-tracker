// Student
export const JOIN_CLASS = 'JOIN_CLASS';
export const LEAVE_CLASS = 'LEAVE_CLASS';
export const UPDATE_CONFUSION = 'UPDATE_CONFUSION';

// Teacher
export const LOG_IN = 'LOG_IN';

// Class Room
export const START_CLASS = 'START_CLASS';
export const UPDATE_CLASS = 'UPDATE_CHART';
export const END_CLASS = 'END_CLASS';

export const joinClassRoom = studentId => {
  return {
    type: JOIN_CLASS,
    payload: studentId
  };
};

export const leaveClassRoom = () => {
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

export const login = teacherInfo => {
  return {
    type: LOG_IN,
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
