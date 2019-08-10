import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Col, Button } from 'reactstrap';
import logo from '../logo.png';

const MainPage = () => (
  <Container>
    <div style={{ margin: '30px' }} />
    <img src={logo} style={{ maxWidth: '400px', margin: '20px' }} alt="logo" />
    <Col sm="12" md={{ size: 6, offset: 3 }}>
      <Link to="/login/student" style={{ textDecoration: 'none' }}>
        <Button style={{ backgroundColor: '#75b8ff', borderColor: '#75b8ff' }}>
          Student Login
        </Button>
      </Link>
      <span style={{ margin: '5px' }} />
      <Link to="/login/professor" style={{ textDecoration: 'none' }}>
        <Button style={{ backgroundColor: '#75b8ff', borderColor: '#75b8ff' }}>
          Professor Login
        </Button>
      </Link>
    </Col>
  </Container>
);

export default MainPage;
