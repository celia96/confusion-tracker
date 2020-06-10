import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { GrUserSettings } from 'react-icons/gr';
import { BsCheck } from 'react-icons/bs';
import { FormText, Button, Form, FormGroup, Label, Input } from 'reactstrap';

import Header from '../Header';

import { loadProfile } from '../../../../redux/actions';

const styles = {
  contentContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 3
  },
  formContainer: {
    maxWidth: '600px',
    minWidth: '400px',
    backgroundColor: '#6495ed',
    padding: '20px',
    borderRadius: '5px'
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    margin: '5px'
  },
  titleText: {
    fontSize: '30px',
    fontWeight: '600'
  },
  formText: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginRight: '5px',
    height: '10px'
  },
  submitButton: {
    width: '100%',
    marginTop: '20px',
    backgroundColor: '#F5b700',
    borderColor: '#F5b700',
    fontWeight: '600',
    color: '#614908'
  },
  label: {
    color: '#000',
    fontWeight: '600'
  },
  action: {
    color: '#fff'
  }
};

const ProfileForm = ({
  firstName,
  lastName,
  email,
  submit,
  onChangeFirstName,
  onChangeLastName,
  onChangeEmail
}) => {
  const [isFirstNameDisabled, setFirstNameStatus] = useState(true);
  const [isLastNameDisabled, setLastNameStatus] = useState(true);
  const [isEmailDisabled, setEmailStatus] = useState(true);
  return (
    <Form>
      <FormGroup>
        <Label style={styles.label}>First Name</Label>
        <Input
          disabled={isFirstNameDisabled}
          value={firstName}
          onChange={e => onChangeFirstName(e)}
          type="firstName"
          name="firstName"
          id="firstName"
        />
        <FormText style={styles.formText}>
          {isFirstNameDisabled ? (
            <span
              className="pointer"
              style={styles.action}
              onClick={() => setFirstNameStatus(false)}
            >
              Change
            </span>
          ) : (
            <BsCheck
              className="pointer"
              style={styles.action}
              size="15"
              onClick={() => setFirstNameStatus(true)}
              color="#fff"
            />
          )}
        </FormText>
      </FormGroup>
      <FormGroup>
        <Label style={styles.label}>Last Name</Label>
        <Input
          disabled={isLastNameDisabled}
          value={lastName}
          onChange={e => onChangeLastName(e)}
          type="lastName"
          name="lastName"
          id="lastName"
        />
        <FormText style={styles.formText}>
          {isLastNameDisabled ? (
            <span
              className="pointer"
              style={styles.action}
              onClick={() => setLastNameStatus(false)}
            >
              Change
            </span>
          ) : (
            <BsCheck
              className="pointer"
              style={styles.action}
              size="15"
              onClick={() => setLastNameStatus(true)}
              color="#fff"
            />
          )}
        </FormText>
      </FormGroup>
      <FormGroup>
        <Label style={styles.label}>Email</Label>
        <Input
          disabled={isEmailDisabled}
          value={email}
          onChange={e => onChangeEmail(e)}
          type="email"
          name="email"
          id="email"
        />
        <FormText style={styles.formText}>
          {isEmailDisabled ? (
            <span
              className="pointer"
              style={styles.action}
              onClick={() => setEmailStatus(false)}
            >
              Change
            </span>
          ) : (
            <BsCheck
              className="pointer"
              style={styles.action}
              size="15"
              onClick={() => setEmailStatus(true)}
              color="#fff"
            />
          )}
        </FormText>
      </FormGroup>
      <FormGroup>
        <Label style={styles.label}>Password</Label>
        <Input
          disabled
          value={'******'}
          type="password"
          name="password"
          id="password"
        />
        <FormText style={styles.formText}>
          <span className="pointer" style={styles.action}>
            Change
          </span>
        </FormText>
      </FormGroup>
      <Button onClick={submit} style={styles.submitButton}>
        Submit
      </Button>
    </Form>
  );
};

class ProfileSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: ''
    };
    this.onChangeFirstName = this.onChangeFirstName.bind(this);
    this.onChangeLastName = this.onChangeLastName.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  componentDidMount() {
    const { token } = this.props;
    const bearer = `Bearer ${token}`;

    fetch('/api/me', {
      headers: {
        Authorization: bearer,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) throw new Error(response.status_text);
        return response.json();
      })
      .then(teacher => {
        const { firstName, lastName, email } = teacher;
        this.setState({
          firstName,
          lastName,
          email
        });
      })
      .catch(err => console.log(err));
  }

  onChangeFirstName(e) {
    this.setState({
      firstName: e.target.value
    });
  }

  onChangeLastName(e) {
    this.setState({
      lastName: e.target.value
    });
  }

  onChangeEmail(e) {
    this.setState({
      email: e.target.value
    });
  }

  submitForm() {
    console.log('submit changed profile');
    const { email, firstName, lastName } = this.state;
    const { updateProfile, token } = this.props;
    const bearer = `Bearer ${token}`;
    const newTeacher = {
      email,
      firstName,
      lastName
    };
    const body = JSON.stringify(newTeacher);
    fetch('/api/me', {
      method: 'POST',
      headers: {
        Authorization: bearer,
        'Content-Type': 'application/json'
      },
      body
    })
      .then(response => {
        if (!response.ok) throw new Error(response.status_text);
        updateProfile(newTeacher);
      })
      .catch(err => console.log(err));
  }

  render() {
    const { firstName, lastName, email } = this.state;

    return (
      <div className="custom-container">
        <Header />
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1
          }}
        >
          <div style={{ flex: 2 }} />
          <div style={styles.contentContainer}>
            <div style={styles.title}>
              <GrUserSettings size="40" />
              <span style={{ margin: '5px' }} />
              <span style={styles.titleText}>Profile Setting</span>
            </div>
            <div style={styles.formContainer}>
              <ProfileForm
                firstName={firstName}
                lastName={lastName}
                email={email}
                submit={this.submitForm}
                onChangeFirstName={this.onChangeFirstName}
                onChangeLastName={this.onChangeEmail}
                onChangeEmail={this.onChangeEmail}
              />
            </div>
          </div>
          <div style={{ flex: 2 }} />
        </div>
      </div>
    );
  }
}

ProfileSetting.propTypes = {
  token: PropTypes.string.isRequired,
  updateProfile: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    token: state && state.teacher && state.teacher.clientToken
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateProfile: profile => dispatch(loadProfile(profile))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileSetting);
