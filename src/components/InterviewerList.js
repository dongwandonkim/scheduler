import React from "react";
import InterviewerListItem from "./InterviewerListItem";
import "components/InterviewerList.scss";

export default function InterviewerList(props) {
  const renderInterviewers = (interviewers) => {
    return interviewers.map((interviewer) => {
      const { id, name, avatar } = interviewer;
      return (
        <InterviewerListItem
          key={id}
          name={name}
          avatar={avatar}
          setInterviewer={() => props.onChange(id)}
          selected={props.value === id}
        />
      );
    });
  };

  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">
        {renderInterviewers(props.interviewers)}
      </ul>
    </section>
  );
}
