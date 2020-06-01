/* import {
  Container,
  Col,
  Label,
  Card,
  Input,
  Button,
  CardTitle
} from 'reactstrap';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import logo from '../../../logo.png';

class TeacherRegistration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      passwordConfirm: ''
    };
    this.handleEmail = this.handleEmail.bind(this);
    this.handleFirstName = this.handleFirstName.bind(this);
    this.handleLastName = this.handleLastName.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handlePasswordConfirm = this.handlePasswordConfirm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleEmail(event) {
    this.setState({
      email: event.target.value
    });
  }

  handleFirstName(event) {
    this.setState({
      firstName: event.target.value
    });
  }

  handleLastName(event) {
    this.setState({
      lastName: event.target.value
    });
  }

  handlePassword(event) {
    this.setState({
      password: event.target.value
    });
  }

  handlePasswordConfirm(event) {
    this.setState({
      passwordConfirm: event.target.value
    });
  }

  handleSubmit() {
    const { email, firstName, lastName, password } = this.state;

    if (this.state.password === this.state.passwordConfirm) {
      fetch('/api/teacher/register', {
        method: 'POST',
        body: JSON.stringify({
          email: this.state.email,
          password: this.state.password
        }),
        headers: new Headers({ 'Content-type': 'application/json' })
      })
        .then(response => {
          if (!response.status !== 200) {
            throw new Error(response.status_text);
          }
          alert('successful registration');
          this.props.history.push('/login/professor');
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      alert('password mismatch');
    }
  }

  render() {
    return (
      <Container>
        <div style={{ margin: '30px' }} />
        <img src={logo} style={{ maxWidth: '300px' }} alt="logo" />
        <Col sm="12" md={{ size: 6, offset: 3 }}>
          <Card
            body
            style={{ backgroundColor: '#c4defc', borderColor: '#c4defc' }}
          >
            <CardTitle
              style={{
                fontWeight: 600,
                textAlign: 'left',
                fontSize: '24px',
                marginBottom: '30px'
              }}
            >
              Registeration
            </CardTitle>
            <Label style={{ textAlign: 'left' }}>Email</Label>
            <Input
              onChange={this.handleEmail}
              type="email"
              value={this.state.email}
              style={{ marginBottom: '10px' }}
            />
            <Label style={{ textAlign: 'left' }}>Password</Label>
            <Input
              onChange={this.handlePassword}
              type="password"
              value={this.state.password}
              style={{ marginBottom: '10px' }}
            />
            <Label style={{ textAlign: 'left' }}>Confirm Password</Label>
            <Input
              onChange={this.handlePasswordConfirm}
              type="password"
              value={this.state.passwordConfirm}
              style={{ marginBottom: '10px' }}
            />
            <Button
              onClick={this.handleSubmit}
              style={{
                backgroundColor: '#75b8ff',
                borderColor: '#75b8ff',
                marginBottom: '10px'
              }}
            >
              Register
            </Button>
          </Card>
        </Col>
      </Container>
    );
  }
}

TeacherRegistration.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  })
};

export default TeacherRegistration;
 */
