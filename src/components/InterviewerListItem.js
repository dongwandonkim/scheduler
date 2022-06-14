import React from "react";
import classNames from "classnames";
import "./InterviewerListItem.scss";

export default function InterviewerListItem(props) {
  const { name, avatar, selected, setInterviewer } = props;
  const interviewerItemStyle = classNames({
    "interviewers__item--selected": selected,
    interviewers__item: !props.selected,
  });
  console.log(interviewerItemStyle);
  return (
    <li className={interviewerItemStyle} onClick={setInterviewer}>
      <img className="interviewers__item-image" src={avatar} alt={name} />
      {selected && name}
    </li>
  );
}
