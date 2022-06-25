export const SET_DAY = 'SET_DAY';
export const SET_APPLICATION_DATA = 'SET_APPLICATION_DATA';
export const SET_INTERVIEW = 'SET_INTERVIEW';
export const EDIT_INTERVIEW = 'EDIT_INTERVIEW';

export default function reducer(state, action) {
  switch (action.type) {
    case SET_DAY:
      return {
        /* insert logic */
        ...state,
        day: action.day,
      };

    case SET_APPLICATION_DATA:
      return {
        /* insert logic */
        ...state,
        days: action.days,
        appointments: action.appointments,
        interviewers: action.interviewers,
      };

    case SET_INTERVIEW:
      return {
        ...state,
        days: action.days,
        appointments: action.appointments,
      };

    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}
