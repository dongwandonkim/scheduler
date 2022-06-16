import React, {useEffect, useState} from 'react';
import axios from 'axios';

import 'components/Application.scss';
import DayList from './DayList';
import Appointment from 'components/Appointment';
import {getAppointmentsForDay} from 'helpers/selectors';

export default function Application() {
  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    // you may put the line below, but will have to remove/comment hardcoded appointments variable
    appointments: {},
  });

  const setDay = (day) => setState({...state, day});
  const setDays = (days) => {
    setState((prev) => ({...prev, days}));
  };

  const dailyAppointments = getAppointmentsForDay(state, state.day);
  const apiUrl = 'http://localhost:8001/api/';

  useEffect(() => {
    // axios.get('http://localhost:8001/api/days').then((res) => {
    //   console.log('receiving days', res.data);
    //   setDays(res.data);
    //   setState((prev) => ({...prev, days: res.data}));

    // });

    Promise.all([
      axios.get(apiUrl + 'days'),
      axios.get(apiUrl + 'appointments'),
      axios.get(apiUrl + 'interviewers'),
    ]).then((all) => {
      console.log('all', all);
      setState((prev) => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
      }));
    });
  }, []);

  return (
    <main className="layout">
      <section className="sidebar">
        {/* Replace this with the sidebar elements during the "Project Setup & Familiarity" activity. */}
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={state.days} value={state.day} onChange={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {/* Replace this with the schedule elements durint the "The Scheduler" activity. */}
        {dailyAppointments.map((appointment) => {
          console.log(appointment);
          return <Appointment key={appointment.id} {...appointment} />;
        })}
      </section>
    </main>
  );
}
