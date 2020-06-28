import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Badge, Card, CardText, Button } from 'reactstrap';
import moment from 'moment';

import questionIcon from '../../../assets/question.png';

const styles = {
  questionStyle: {
    container: {
      margin: '5px',
      borderRadius: '5px'
    },
    upperContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    upperSubContainer: {
      display: 'flex',
      alignItems: 'center'
    },
    avatar: {
      fontSize: '1.2rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#6495ed', //1e90ff
      width: '2.5rem',
      height: '2.5rem',
      color: 'white',
      borderRadius: '2.5rem'
    },
    nameTimeContainer: {
      paddingLeft: '10px',
      display: 'flex',
      flexDirection: 'column'
    },
    name: {
      fontSize: '1rem'
    },
    time: {
      fontSize: '0.7rem'
    },
    badge: {
      backgroundColor: '#6495ed'
    },
    questionText: {
      paddingTop: '10px'
    }
  },
  questionListStyle: {
    container: {
      zIndex: 1,
      position: 'absolute',
      right: '0px',
      display: 'flex',
      flexDirection: 'row',
      height: '100vh',
      padding: '10px'
    },
    listContainer: {
      flex: 1,
      maxHeight: '100vh',
      overflow: 'auto',
      backgroundColor: '#6495ed',
      borderRadius: '5px'
    }
  }
};

const VerticalButton = ({ toggle }) => (
  <Button
    onClick={toggle}
    style={{
      display: 'flex',
      margin: '5px',
      height: 'fit-content',
      backgroundColor: '#6495ed',
      borderColor: '#6495ed'
    }}
  >
    <img src={questionIcon} style={{ maxWidth: '20px' }} alt="question icon" />
  </Button>
);

const Question = ({ question }) => {
  const { text, upvoters, timestamp } = question;
  const { questionStyle } = styles;
  const time = moment(timestamp).format('LT');
  // 1e90ff
  return (
    <Card body style={questionStyle.container}>
      <div style={questionStyle.upperContainer}>
        <div style={questionStyle.upperSubContainer}>
          <span style={questionStyle.avatar}>Q</span>
          <div style={questionStyle.nameTimeContainer}>
            <span style={questionStyle.name}>Anonymous</span>
            <span style={questionStyle.time}>{time}</span>
          </div>
        </div>
        <div>
          <Badge pill style={questionStyle.badge}>
            +{upvoters.length}
          </Badge>
        </div>
      </div>
      <CardText style={questionStyle.questionText}>{text}</CardText>
    </Card>
  );
};

const QuestionList = ({ collapse, questions, toggle }) => {
  const questionList = Object.values(questions);
  const sortedQuestions = questionList.sort(
    (q1, q2) => q2.upvoters.length - q1.upvoters.length
  );
  const { questionListStyle } = styles;
  const containerStyle = collapse
    ? { ...questionListStyle.container, width: '40%' }
    : questionListStyle.container;
  // console.log('question list ', questionList);
  return (
    <div style={containerStyle}>
      <VerticalButton style={{ marginBottom: '1rem' }} toggle={toggle} />
      {collapse ? (
        <div style={questionListStyle.listContainer}>
          {sortedQuestions.map(question => (
            <Question
              key={question.title + question.questionId}
              question={question}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

QuestionList.propTypes = {
  questions: PropTypes.object.isRequired,
  collapse: PropTypes.bool,
  toggle: PropTypes.func
};

const mapStateToProps = state => {
  return {
    questions: state && state.classRoom && state.classRoom.questions
  };
};

export default connect(mapStateToProps, null)(QuestionList);
