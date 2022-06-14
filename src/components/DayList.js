import React from "react";
import DayListItem from "./DayListItem";

export default function DayList(props) {
  const renderDayLists = (days, setDay) => {
    return days.map((day) => {
      return (
        <DayListItem
          key={day.id}
          name={day.name}
          spots={day.spots}
          selected={day.name === props.day}
          setDay={setDay}
        />
      );
    });
  };
  return <ul>{renderDayLists(props.days, props.setDay)}</ul>;
}
