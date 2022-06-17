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

/**
 * "interview": {
    "student": "Lydia Miller-Jones",
    "interviewer": {
      "id": 1,
      "name": "Sylvia Palmer",
      "avatar": "https://i.imgur.com/LpaY82x.png"
    }
  }
 */
