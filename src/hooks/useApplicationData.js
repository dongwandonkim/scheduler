import axios from 'axios';
import {useReducer} from 'react';
import {useState, useEffect} from 'react';

const SET_DAY = 'SET_DAY';
const SET_APPLICATION_DATA = 'SET_APPLICATION_DATA';
const SET_INTERVIEW = 'SET_INTERVIEW';

function reducer(state, action) {
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
    case SET_INTERVIEW: {
      return {
        ...state,
        days: action.days,
        appointments: action.appointments,
      };
    }
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}

export default function useApplicationData() {
  const [state, dispatch] = useReducer(reducer, {
    day: 'Monday',
    days: [],
    appointments: {},
  });

  const setDay = (day) => dispatch({type: SET_DAY, day});

  const getUpdatedSpots = (state, appointmentId, onBook = true) => {
    const newDays = state.days.map((day) => {
      const foundAppointment = day.appointments.find(
        (a) => a === appointmentId
      );

      if (foundAppointment) {
        return {
          ...day,
          spots: onBook ? day.spots - 1 : day.spots + 1,
        };
      } else {
        return day;
      }
    });
    return newDays;
  };

  function bookInterview(id, interview) {
    // TODO
    const appointment = {
      ...state.appointments[id],
      interview: {...interview},
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    return axios.put(`/api/appointments/${id}`, {interview}).then(() => {
      // setState((prev) => {
      //   const newDays = getUpdatedSpots(prev, id, true);

      //   return {
      //     ...prev,
      //     days: newDays,
      //     appointments,
      //   };
      // });
      dispatch({
        type: SET_INTERVIEW,
        days: getUpdatedSpots(state, id, true),
        appointments,
      });
    });
  }

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    return axios.delete(`/api/appointments/${id}`).then(() => {
      // setState((prev) => {
      //   const newDays = getUpdatedSpots(prev, id, false);

      //   return {
      //     ...prev,
      //     days: newDays,
      //     appointments,
      //   };
      // });
      dispatch({
        type: SET_INTERVIEW,
        days: getUpdatedSpots(state, id, false),
        appointments,
      });
    });
  }

  const apiUrl = '/api/';

  useEffect(() => {
    Promise.all([
      axios.get(apiUrl + 'days'),
      axios.get(apiUrl + 'appointments'),
      axios.get(apiUrl + 'interviewers'),
    ]).then((all) => {
      console.log(all);
      // setState((prev) => ({
      //   ...prev,
      //   days: all[0].data,
      //   appointments: all[1].data,
      //   interviewers: all[2].data,
      // }));
      dispatch({
        type: SET_APPLICATION_DATA,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data,
      });
    });
  }, []);

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview,
  };
}
