import React from 'react';
import classNames from 'classnames';
import './InterviewerListItem.scss';

export default function InterviewerListItem(props) {
  const interviewerItemStyle = classNames({
    'interviewers__item--selected': props.selected,
    interviewers__item: !props.selected,
  });
  return (
    <li className={interviewerItemStyle} onClick={props.setInterviewer}>
      <img
        className="interviewers__item-image"
        src={props.avatar}
        alt={props.name}
      />
      {props.selected && props.name}
    </li>
  );
}
