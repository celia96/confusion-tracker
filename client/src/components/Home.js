import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Button } from 'reactstrap';
import logo from '../assets/logo.png';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    maxWidth: '400px',
    margin: '20px'
  },
  button: {
    backgroundColor: '#6495ed',
    borderColor: '#6495ed'
  },
  link: {
    textDecoration: 'none'
  }
};

const Home = () => (
  <Container style={styles.container}>
    {/* <div style={{ margin: '30px' }} /> */}
    <img src={logo} style={styles.logo} alt="logo" />
    <div>
      <Link to="/join" style={styles.link}>
        <Button style={styles.button}>Student Login</Button>
      </Link>
      <span style={{ margin: '5px' }} />
      <Link to="/login" style={styles.link}>
        <Button style={styles.button}>Teacher Login</Button>
      </Link>
      <Link to="/register" style={styles.link}>
        <Button style={styles.button}>Teacher Register</Button>
      </Link>
    </div>
  </Container>
);

export default Home;
