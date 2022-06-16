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
