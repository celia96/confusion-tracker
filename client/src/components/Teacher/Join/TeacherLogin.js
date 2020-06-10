import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

import { login, loadProfile } from '../../../redux/actions';

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

const LoginForm = props => {
  const { submit, email, password, onChangeEmail, onChangePassword } = props;

  return (
    <Form>
      <FormGroup>
        <Label style={styles.label}>Email</Label>
        <Input
          value={email}
          onChange={e => onChangeEmail(e)}
          type="email"
          name="email"
          id="email"
        />
      </FormGroup>
      <FormGroup>
        <Label style={styles.label}>Password</Label>
        <Input
          value={password}
          onChange={e => onChangePassword(e)}
          type="password"
          name="password"
          id="password"
        />
      </FormGroup>
      <Button onClick={submit} style={styles.submitButton}>
        Submit
      </Button>
    </Form>
  );
};

class TeacherLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      success: false
    };
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  onChangeEmail(e) {
    this.setState({
      email: e.target.value
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value
    });
  }

  submitForm() {
    console.log('submit login form');
    const { setToken, setProfile } = this.props;
    const { email, password } = this.state;
    const body = JSON.stringify({
      email,
      password
    });
    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body
    })
      .then(response => {
        if (!response.ok) throw new Error(response.status_text);
        return response.json();
      })
      .then(teacher => {
        console.log('successful!');
        setToken(teacher.token);
        setProfile({
          email: teacher.email,
          firstName: teacher.firstName,
          lastName: teacher.lastName,
          teacherId: teacher._id
        });
        this.setState({
          success: true
        });
      })
      .catch(err => console.log(err));
  }

  render() {
    const { success, email, password } = this.state;
    return (
      <div className="custom-container">
        {success ? <Redirect to="/home" /> : null}
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
              {/* <GrUserSettings size="40" /> */}
              <span style={{ margin: '5px' }} />
              <span style={styles.titleText}>Login</span>
            </div>
            <div style={styles.formContainer}>
              <LoginForm
                email={email}
                password={password}
                submit={this.submitForm}
                onChangeEmail={this.onChangeEmail}
                onChangePassword={this.onChangePassword}
              />
            </div>
          </div>
          <div style={{ flex: 2 }} />
        </div>
      </div>
    );
  }
}

TeacherLogin.propTypes = {
  setProfile: PropTypes.func.isRequired,
  setToken: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => {
  return {
    setProfile: teacherInfo => dispatch(loadProfile(teacherInfo)),
    setToken: token => dispatch(login(token))
  };
};

export default connect(null, mapDispatchToProps)(TeacherLogin);
