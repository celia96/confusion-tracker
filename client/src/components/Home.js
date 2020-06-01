import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Col, Button } from 'reactstrap';
import logo from '../assets/logo.png';

const styles = {
  logo: {
    maxWidth: '400px',
    margin: '20px'
  },
  button: {
    backgroundColor: '#75b8ff',
    borderColor: '#75b8ff'
  },
  link: {
    textDecoration: 'none'
  }
};

const MainPage = () => (
  <Container>
    <div style={{ margin: '30px' }} />
    <img src={logo} style={styles.logo} alt="logo" />
    <Col sm="12" md={{ size: 6, offset: 3 }}>
      <Link to="/login/student" style={styles.link}>
        <Button style={styles.button}>Student Login</Button>
      </Link>
      <span style={{ margin: '5px' }} />
      <Link to="/login/teacher" style={styles.link}>
        <Button style={styles.button}>Teacher Login</Button>
      </Link>
    </Col>
  </Container>
);

export default MainPage;
