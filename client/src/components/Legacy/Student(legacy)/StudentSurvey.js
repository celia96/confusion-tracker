/* eslint-disable react/prefer-stateless-function, react/no-unused-state*/
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import * as Survey from 'survey-react';
import 'survey-react/survey.css';
import PropTypes from 'prop-types';
import logo from '../../logo.png';

class StudentSurvey extends Component {
  constructor() {
    super();
    this.state = {
      value: 'Please write your comments.',
      selectedOption: 'option1'
    };
    this.onComplete = this.onComplete.bind(this);
  }

  onComplete(survey, options) {
    console.log('options', options, survey);
    fetch(`/api/student/comment/${this.props.match.params.roomName}`, {
      method: 'POST',
      body: JSON.stringify({
        comment: survey.data.suggestions,
        confusionlevel: survey.data.confusion
      }),
      headers: new Headers({ 'Content-type': 'application/json' })
    })
      .then(response => {
        if (response.ok) {
          if (!response.ok) {
            throw new Error(response.status_text);
          }
          alert('Your response is submitted');
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    const student = JSON.parse(sessionStorage.getItem('student'));
    const { roomName } = this.props.match.params;
    if (!student) {
      return (
        <Redirect
          to={{
            pathname: `/login/student/nickname/${roomName}`,
            state: { from: this.props.location }
          }}
        />
      );
    }
    const json = {
      questions: [
        {
          type: 'rating',
          name: 'confusion',
          title: 'How confused are you with the class today?',
          isRequired: true,
          mininumRateDescription: 'Not confused',
          maximumRateDescription: 'Completely confused'
        },
        {
          type: 'comment',
          name: 'suggestions',
          title: 'What do you want professors to further explain?'
        }
      ]
    };
    const model = new Survey.Model(json);
    return (
      <div>
        <img
          src={logo}
          style={{ maxWidth: '300px', margin: '10px' }}
          alt="logo"
        />
        <Survey.Survey
          model={model}
          onComplete={(survey, options) => this.onComplete(survey, options)}
        />
      </div>
    );
  }
}

StudentSurvey.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      roomName: PropTypes.string.isRequired
    })
  }),
  location: PropTypes.object.isRequired
};

export default StudentSurvey;
