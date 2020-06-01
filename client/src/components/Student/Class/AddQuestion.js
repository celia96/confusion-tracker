import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, CardTitle, CardText, Input } from 'reactstrap';

const styles = {
  container: {
    backgroundColor: '#6495ed',
    borderColor: '#6495ed'
  },
  cardTitle: {
    fontWeight: 'bold',
    color: '#fff'
  },
  cardInput: {
    height: '100px'
  },
  submitButton: {
    backgroundColor: '#F5b700',
    borderColor: '#F5b700'
  }
};

const AddQuestion = ({ text, onTextChange, submitQuestion }) => {
  return (
    <Card body style={styles.container}>
      <CardTitle style={styles.cardTitle}>Post a Question</CardTitle>
      <CardText>
        <Input
          type="textarea"
          style={styles.cardInput}
          maxLength={300}
          name="question"
          id="questionText"
          value={text}
          placeholder={'What are you confused about?'}
          onChange={onTextChange}
        />
      </CardText>
      <Button style={styles.submitButton} onClick={submitQuestion}>
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
