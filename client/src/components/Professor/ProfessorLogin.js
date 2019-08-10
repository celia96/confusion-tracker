import {
  Container,
  Col,
  Label,
  Card,
  Input,
  Button,
  CardTitle
} from 'reactstrap';
import { Divider } from 'semantic-ui-react';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import logo from '../../logo.png';
import Authn from '../Authn/Authn';
import { GoogleLogin } from 'react-google-login';

const GOOGLE_CLIENT_ID =
  '909978624274-2vqguu0i6pph09ucsdqtcguntkm81jl2.apps.googleusercontent.com';

class ProfessorLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleGoogleLogin = this.handleGoogleLogin.bind(this);
    this.handleGoogleFailure = this.handleGoogleFailure.bind(this);
    this.login = this.login.bind(this);
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

  handleGoogleLogin(response) {
    fetch('/api/professor/googleLogin', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${response.tokenId}`
      }
    })
      .then(fetchResponse => {
        if (!fetchResponse.ok) {
          // fail!
          alert('Unable to authenticate', fetchResponse.statusText);
        }
        return fetchResponse.json();
      })
      .then(responseJson => {
        const profile = {
          id: responseJson.id,
          email: responseJson.professor
        };
        Authn.saveProfile(profile);

        this.props.history.push('/professor/menu');
      })
      .catch(err => console.log(err));
  }

  handleGoogleFailure() {
    alert('Login failed!');
  }

  login() {
    fetch('/api/professor/login', {
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
      .then(responseJson => {
        alert('successful');
        const profile = {
          id: responseJson.id,
          email: responseJson.professor
        };
        Authn.saveProfile(profile);
        this.props.history.push('/professor/menu');
      })
      .catch(error => {
        // alert('Invalid email or password. Try again!');
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
              onChange={this.handleEmailChange}
            />
            <div style={{ marginBottom: '10px' }} />
            <Label style={{ textAlign: 'left' }}>Password</Label>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={this.handlePasswordChange}
              style={{ marginBottom: '10px' }}
            />
            <Button
              onClick={this.login}
              style={{
                backgroundColor: '#75b8ff',
                borderColor: '#75b8ff',
                marginBottom: '10px'
              }}
            >
              Login
            </Button>
            <Link
              to="/login/professor/register"
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
            <Divider horizontal>Or</Divider>
            <GoogleLogin
              clientId={GOOGLE_CLIENT_ID}
              buttonText="Login with Google"
              onSuccess={this.handleGoogleLogin}
              onFailure={this.handleGoogleFailure}
            />
          </Card>
        </Col>
      </Container>
    );
  }
}

ProfessorLogin.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  })
};

export default ProfessorLogin;
