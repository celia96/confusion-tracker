import {
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
import logo from '../../logo.png';

class ProfessorRegistration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      passwordRetyped: ''
    };
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handlePasswordRetyped = this.handlePasswordRetyped.bind(this);
    this.register = this.register.bind(this);
  }

  handleEmailChange(event) {
    this.setState({
      email: event.target.value
    });
  }

  handlePasswordChange(event) {
    this.setState({
      password: event.target.value
    });
  }

  handlePasswordRetyped(event) {
    this.setState({
      passwordRetyped: event.target.value
    });
  }

  register() {
    if (this.state.password === this.state.passwordRetyped) {
      fetch('/api/professor/register', {
        method: 'POST',
        body: JSON.stringify({
          email: this.state.email,
          password: this.state.password
        }),
        headers: new Headers({ 'Content-type': 'application/json' })
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(response.status_text);
          }
          return response.json();
        })
        .then(responseJSON => {
          if (responseJSON.success) {
            alert('successful');
            this.props.history.push('/login/professor');
          }
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
              onChange={this.handleEmailChange}
              type="email"
              value={this.state.email}
              style={{ marginBottom: '10px' }}
            />
            <Label style={{ textAlign: 'left' }}>Password</Label>
            <Input
              onChange={this.handlePasswordChange}
              type="password"
              value={this.state.password}
              style={{ marginBottom: '10px' }}
            />
            <Label style={{ textAlign: 'left' }}>Confirm Password</Label>
            <Input
              onChange={this.handlePasswordRetyped}
              type="password"
              value={this.state.passwordRetyped}
              style={{ marginBottom: '10px' }}
            />
            <Button
              onClick={this.register}
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

ProfessorRegistration.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  })
};

export default ProfessorRegistration;
