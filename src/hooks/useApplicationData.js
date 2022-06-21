import axios from 'axios';
import {useState, useEffect} from 'react';

export default function useApplicationData() {
  const [state, setState] = useState({
    day: 'Monday',
    days: [],

    // you may put the line below, but will have to remove/comment hardcoded appointments variable
    appointments: {},
  });

  const setDay = (day) => setState({...state, day});

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
      setState((prev) => {
        const newDays = getUpdatedSpots(prev, id, true);

        return {
          ...prev,
          days: newDays,
          appointments,
        };
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
      setState((prev) => {
        const newDays = getUpdatedSpots(prev, id, false);

        return {
          ...prev,
          days: newDays,
          appointments,
        };
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
      setState((prev) => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data,
      }));
    });
  }, []);

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview,
  };
}
