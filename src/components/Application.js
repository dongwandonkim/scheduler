import React from 'react';
import useApplicationData from 'hooks/useApplicationData';
import 'components/Application.scss';
import DayList from './DayList';
import Appointment from 'components/Appointment';
import {
  getAppointmentsForDay,
  getInterview,
  getInterviewersForday,
} from 'helpers/selectors';

export default function Application() {
  const {state, setDay, bookInterview, cancelInterview} = useApplicationData();

  const dailyAppointments = getAppointmentsForDay(state, state.day);

  const renderAppointments = dailyAppointments.map((appointment) => {
    const interview = getInterview(state, appointment.interview);
    const interviewers = getInterviewersForday(state, state.day);

    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={interview}
        interviewers={interviewers}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
      />
    );
  });

  return (
    <main className="layout">
      <section className="sidebar">
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
        {renderAppointments}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
