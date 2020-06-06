import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { GrUserSettings } from 'react-icons/gr';
import { BsCheck } from 'react-icons/bs';
import { FormText, Button, Form, FormGroup, Label, Input } from 'reactstrap';

import Header from '../Header';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    maxHeight: '100vh'
  },
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

const ProfileForm = ({ teacherInfo }) => {
  const { firstName, lastName, email } = teacherInfo;
  const [firstNameValue, setFirstName] = useState(firstName);
  const [lastNameValue, setlastName] = useState(lastName);
  const [emailValue, setEmail] = useState(email);

  const [isFirstNameDisabled, setFirstNameStatus] = useState(true);
  const [isLastNameDisabled, setLastNameStatus] = useState(true);
  const [isEmailDisabled, setEmailStatus] = useState(true);

  return (
    <Form>
      <FormGroup>
        <Label style={styles.label}>First Name</Label>
        <Input
          disabled={isFirstNameDisabled}
          value={firstNameValue}
          onChange={e => setFirstName(e.target.value)}
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
              size="15"
              onClick={() => setFirstNameStatus(true)}
              style={styles.action}
              color="#fff"
            />
          )}
        </FormText>
      </FormGroup>
      <FormGroup>
        <Label style={styles.label}>Last Name</Label>
        <Input
          disabled={isLastNameDisabled}
          value={lastNameValue}
          onChange={e => setlastName(e.target.value)}
          type="lastName"
          name="lastName"
          id="lastName"
        />
        <FormText style={styles.formText}>
          {isLastNameDisabled ? (
            <span
              style={styles.action}
              onClick={() => setLastNameStatus(false)}
            >
              Change
            </span>
          ) : (
            <BsCheck
              size="15"
              onClick={() => setLastNameStatus(true)}
              style={styles.action}
              color="#fff"
            />
          )}
        </FormText>
      </FormGroup>
      <FormGroup>
        <Label style={styles.label}>Email</Label>
        <Input
          disabled={isEmailDisabled}
          value={emailValue}
          onChange={e => setEmail(e.target.value)}
          type="email"
          name="email"
          id="email"
        />
        <FormText style={styles.formText}>
          {isEmailDisabled ? (
            <span style={styles.pointer} onClick={() => setEmailStatus(false)}>
              Change
            </span>
          ) : (
            <BsCheck
              size="15"
              onClick={() => setEmailStatus(true)}
              style={styles.pointer}
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
          id="assword"
        />
        <FormText style={styles.formText}>
          <span style={styles.pointer} onClick={() => setLastNameStatus(false)}>
            Change
          </span>
        </FormText>
      </FormGroup>
      <Button style={styles.submitButton}>Submit</Button>
    </Form>
  );
};

class ProfileSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    const { teacherInfo } = this.props;

    return (
      <div style={styles.container}>
        <Header teacherInfo={teacherInfo} />
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
              <ProfileForm teacherInfo={teacherInfo} />
            </div>
          </div>
          <div style={{ flex: 2 }} />
        </div>
      </div>
    );
  }
}

ProfileSetting.propTypes = {
  teacherInfo: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    teacherInfo: state && state.teacher
  };
};

const mapDispatchToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileSetting);
