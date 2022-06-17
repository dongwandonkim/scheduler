import React, {useState} from 'react';
import InterviewerList from '../InterviewerList';
import Button from '../Button';

const Form = (props) => {
  const [student, setStudent] = useState(props.student || '');
  const [interviewer, setInterviewer] = useState(props.interviewer || null);

  const reset = () => {
    cancel();
    setStudent('');
    setInterviewer(null);
  };

  const cancel = () => {
    props.onCancel();
  };
  console.log('me form');
  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            value={student}
            onChange={(e) => setStudent(e.target.value)}
          />
        </form>
        <InterviewerList
          interviewers={props.interviewers}
          value={interviewer}
          onChange={setInterviewer}
        />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={reset}>
            Cancel
          </Button>
          <Button confirm onClick={() => props.onSave(student, interviewer)}>
            Save
          </Button>
        </section>
      </section>
    </main>
  );
};

export default Form;
