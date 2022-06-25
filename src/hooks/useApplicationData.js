import axios from 'axios';
import {getAppointmentsForDay} from 'helpers/selectors';
import {useState} from 'react';
import {useReducer, useEffect} from 'react';
import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW,
} from 'reducers/application';

const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

export default function useApplicationData() {
  const [mode, setMode] = useState('');
  const [state, dispatch] = useReducer(reducer, {
    day: 'Monday',
    days: [],
    appointments: {},
  });

  const setDay = (day) => dispatch({type: SET_DAY, day});

  // get updated remaining spots for selected day
  const getUpdatedSpots = (state, appointmentId) => {
    const newDays = state.days.map((day) => {
      const foundAppointment = day.appointments.find(
        (a) => a === appointmentId
      );

      if (foundAppointment && mode === 'CREATE') {
        return {
          ...day,
          spots: day.spots - 1,
        };
      } else if (foundAppointment && mode === 'DELETE') {
        return {
          ...day,
          spots: day.spots + 1,
        };
      } else {
        return day;
      }
    });

    return newDays;
  };

  function bookInterview(id, interview, mode) {
    setMode(mode);
    return axios.put(`/api/appointments/${id}`, {interview}).then(() => {
      webSocket.send('SET_INTERVIEW');
    });
  }

  function cancelInterview(id, mode) {
    setMode(mode);
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
      // console.log(appointments);

      dispatch({
        type: SET_INTERVIEW,
        days: getUpdatedSpots(state, data.id),
        appointments,
      });
    };
  }, [mode, state]);

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview,
  };
}
