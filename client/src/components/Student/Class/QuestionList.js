import React from 'react';
import { Badge, Card, CardText } from 'reactstrap';
import moment from 'moment';

const Question = ({ question, upvoteQuestion }) => {
  const { text, upvoters, timestamp } = question;
  const time = moment(timestamp).format('LT');
  // 1e90ff
  return (
    <Card body style={styles.container}>
      <div style={styles.upperContainer}>
        <div style={styles.upperSubContainer}>
          <span style={styles.avatar}>Q</span>
          <div style={styles.nameTimeContainer}>
            <span style={styles.name}>Anonymous</span>
            <span style={styles.time}>{time}</span>
          </div>
        </div>
        <div>
          <Badge
            pill
            style={styles.badge}
            onClick={() => upvoteQuestion(question)}
          >
            +{upvoters.length}
          </Badge>
        </div>
      </div>
      <CardText style={styles.questionText}>{text}</CardText>
    </Card>
  );
};

const QuestionList = ({ questions, upvoteQuestion }) => {
  const questionList = Object.values(questions);
  // console.log('question list ', questionList);
  return (
    <div>
      {questionList.map(question => (
        <Question
          key={question.title + question.questionId}
          question={question}
          upvoteQuestion={upvoteQuestion}
        />
      ))}
    </div>
  );
};

const styles = {
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
    backgroundColor: '#6495ed',
    cursor: 'pointer'
  },
  questionText: {
    paddingTop: '10px'
  }
};

export default QuestionList;
