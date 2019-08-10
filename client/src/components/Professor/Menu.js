import React, { Component } from 'react';
import PropTypes from 'prop-types';
import image from '../../image.png';
import { Button } from 'semantic-ui-react';
import { GoogleLogout } from 'react-google-login';
import Authn from '../Authn/Authn';

const GOOGLE_CLIENT_ID =
  '909978624274-2vqguu0i6pph09ucsdqtcguntkm81jl2.apps.googleusercontent.com';

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleLogout = this.handleLogout.bind(this);
    this.logout = this.logout.bind(this);
  }

  handleLogout() {
    this.props.history.push('/');
  }

  logout() {
    fetch('/api/logout', {
      method: 'POST',
      headers: new Headers({ 'Content-type': 'application/json' })
    })
      .then(response => {
        if (!response.ok) {
          throw Error(response.status_text);
        }
        return response.json();
      })
      .then(responseJson => {
        if (responseJson.success) {
          alert('Your logout is successful');
          Authn.logout();
          this.props.history.push('/');
        } else {
          alert('Error');
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    const profile = Authn.getProfile();
    return (
      <div
        style={{
          height: '10vh',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#75b8ff'
        }}
      >
        <div
          style={{ cursor: 'pointer' }}
          onClick={this.props.handleHomeButton}
        >
          <img
            src={image}
            style={{ maxWidth: '5vh', margin: '10px', marginLeft: '20px' }}
            alt="logo"
          />
        </div>
        <div>
          <span
            style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff' }}
          >
            {profile.email}
          </span>
        </div>
        <div style={{ margin: '10px', marginRight: '20px' }}>
          <GoogleLogout
            clientId={GOOGLE_CLIENT_ID}
            render={renderProps => (
              <Button
                disabled={renderProps.disabled}
                onClick={this.logout}
                style={{
                  flex: 1,
                  backgroundColor: '#F5b700',
                  borderColor: '#F5b700'
                }}
              >
                Logout
              </Button>
            )}
            onLogoutSuccess={this.handleLogout}
          />
        </div>
      </div>
    );
  }
}

Menu.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }),
  handleHomeButton: PropTypes.func.isRequired
};

export default Menu;
