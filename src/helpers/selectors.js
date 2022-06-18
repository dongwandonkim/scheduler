export function getAppointmentsForDay(state, day) {
  const dayList = state.days.filter((d) => d.name === day);

  if (dayList.length === 0) {
    return [];
  }
  const filteredList = dayList[0].appointments.map(
    (d) => state.appointments[d]
  );
  return filteredList;
}

export function getInterview(state, interview) {
  if (!interview) return null;

  const newInterview = {
    ...interview,
    interviewer: state.interviewers[interview.interviewer],
  };

  return newInterview;
}

export function getInterviewersForday(state, day) {
  const dayList = state.days.filter((d) => d.name === day && d.interviewers);

  if (!dayList.length) {
    return [];
  }
  const filteredList = dayList[0].interviewers.map(
    (id) => state.interviewers[id]
  );

  return filteredList;
}
