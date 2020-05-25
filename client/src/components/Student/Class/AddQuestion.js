import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, CardTitle, CardText, Input } from 'reactstrap';

const AddQuestion = ({ text, onTextChange, submitQuestion }) => {
  return (
    <Card body style={{ backgroundColor: '#6495ed', borderColor: '#6495ed' }}>
      <CardTitle style={{ fontWeight: 'bold', color: '#fff' }}>
        Post a Question
      </CardTitle>
      <CardText>
        <Input
          type="textarea"
          style={{ height: '100px' }}
          maxLength={300}
          name="question"
          id="questionText"
          value={text}
          placeholder={'What are you confused about?'}
          onChange={onTextChange}
        />
      </CardText>
      <Button
        style={{ backgroundColor: '#F5b700', borderColor: '#F5b700' }}
        onClick={submitQuestion}
      >
        Submit
      </Button>
    </Card>
  );
};

AddQuestion.propTypes = {
  text: PropTypes.string,
  onTextChange: PropTypes.func,
  submitQuestion: PropTypes.func
};

export default AddQuestion;
