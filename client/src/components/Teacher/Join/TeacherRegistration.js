import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

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

const RegistrationForm = props => {
  const {
    submit,
    firstName,
    lastName,
    email,
    password,
    onChangeFirstName,
    onChangeLastName,
    onChangeEmail,
    onChangePassword
  } = props;

  return (
    <Form>
      <FormGroup>
        <Label style={styles.label}>First Name</Label>
        <Input
          value={firstName}
          onChange={e => onChangeFirstName(e)}
          type="firstName"
          name="firstName"
          id="firstName"
        />
      </FormGroup>
      <FormGroup>
        <Label style={styles.label}>Last Name</Label>
        <Input
          value={lastName}
          onChange={e => onChangeLastName(e)}
          type="lastName"
          name="lastName"
          id="lastName"
        />
      </FormGroup>
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

class TeacherRegistration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      success: false
    };
    this.onChangeFirstName = this.onChangeFirstName.bind(this);
    this.onChangeLastName = this.onChangeLastName.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.submitForm = this.submitForm.bind(this);
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

  onChangePassword(e) {
    this.setState({
      password: e.target.value
    });
  }

  submitForm() {
    console.log('submit registrartion form');
    const { firstName, lastName, email, password } = this.state;
    const body = JSON.stringify({
      firstName,
      lastName,
      email,
      password
    });
    fetch('/api/register', {
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
      .then(() => {
        console.log('successful!');
        this.setState({
          success: true
        });
      })
      .catch(err => console.log(err));
  }

  render() {
    const { success, firstName, lastName, email, password } = this.state;
    return (
      <div className="custom-container">
        {success ? <Redirect to="/login" /> : null}
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
              <span style={styles.titleText}>Sign up</span>
            </div>
            <div style={styles.formContainer}>
              <RegistrationForm
                firstName={firstName}
                lastName={lastName}
                email={email}
                password={password}
                submit={this.submitForm}
                onChangeFirstName={this.onChangeFirstName}
                onChangeLastName={this.onChangeLastName}
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

export default TeacherRegistration;
