import axios from 'axios';
import {useReducer} from 'react';
import {useEffect} from 'react';

const SET_DAY = 'SET_DAY';
const SET_APPLICATION_DATA = 'SET_APPLICATION_DATA';
const SET_INTERVIEW = 'SET_INTERVIEW';
const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

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
    return axios.put(`/api/appointments/${id}`, {interview}).then(() => {
      webSocket.send('SET_INTERVIEW');
    });
  }

  function cancelInterview(id) {
    return axios.delete(`/api/appointments/${id}`).then(() => {
      webSocket.send('SET_INTERVIEW');
    });
  }

  const apiUrl = '/api/';

  useEffect(() => {
    Promise.all([
      axios.get(apiUrl + 'days'),
      axios.get(apiUrl + 'appointments'),
      axios.get(apiUrl + 'interviewers'),
    ]).then((all) => {
      dispatch({
        type: SET_APPLICATION_DATA,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data,
      });
    });
  }, []);

  useEffect(() => {
    webSocket.onopen = function () {
      webSocket.send('ping');
    };

    webSocket.onmessage = function (event) {
      const data = JSON.parse(event.data);

      const appointment = {
        ...state.appointments[data.id],
        interview: data.interview ? {...data.interview} : null,
      };

      const appointments = {
        ...state.appointments,
        [data.id]: appointment,
      };
      dispatch({
        type: SET_INTERVIEW,
        days: getUpdatedSpots(state, data.id, data.interview ? true : false),
        appointments,
      });
    };
  });

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview,
  };
}
