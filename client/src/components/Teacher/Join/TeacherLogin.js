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
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import logo from '../../../logo.png';

class TeacherLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
    this.handleEmail = this.handleEmail.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleEmail(event) {
    this.setState({
      email: event.target.value
    });
  }

  handlePassword(event) {
    this.setState({
      password: event.target.value
    });
  }

  handleLogin() {
    const { email, password } = this.state;
    fetch('/api/teacher/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password
      }),
      headers: new Headers({ 'Content-type': 'application/json' })
    })
      .then(response => {
        if (!response.status !== 200) {
          throw new Error(response.status_text);
        }
        return response.json();
      })
      .then(responseJson => {
        alert('successful login');
        const { teacher } = responseJson;
        const { _id, email, firstName, lastName, courses } = teacher;
        const payload = {
          teacherId: _id,
          email,
          firstName,
          lastName,
          courses
        };
        this.props.onLogin(payload);
        this.props.history.push('/teacher/main');
      })
      .catch(error => {
        alert('Invalid email or password. Try again!');
        console.log(error);
      });
  }

  render() {
    const { email, password } = this.state;
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
              Login
            </CardTitle>
            <Label style={{ textAlign: 'left' }}>Email</Label>
            <Input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={this.handleEmail}
            />
            <div style={{ marginBottom: '10px' }} />
            <Label style={{ textAlign: 'left' }}>Password</Label>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={this.handlePassword}
              style={{ marginBottom: '10px' }}
            />
            <Button
              onClick={this.handleLogin}
              style={{
                backgroundColor: '#75b8ff',
                borderColor: '#75b8ff',
                marginBottom: '10px'
              }}
            >
              Login
            </Button>
            <Link
              to="/login/teacher/register"
              style={{ textDecoration: 'none', display: 'flex' }}
            >
              <Button
                style={{
                  flex: 1,
                  backgroundColor: '#F5b700',
                  borderColor: '#F5b700',
                  marginBottom: '10px'
                }}
              >
                Register
              </Button>
            </Link>
          </Card>
        </Col>
      </Container>
    );
  }
}

TeacherLogin.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  })
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    // update the user state by logging in
    onLogin: payload =>
      dispatch({
        type: 'LOGIN',
        payload
      })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TeacherLogin);
