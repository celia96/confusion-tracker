import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';

import image from '../../../assets/image.png';

const Header = ({ courseName, studentId }) => {
  return (
    <div style={styles.container}>
      <img src={image} style={styles.logo} alt="logo" />
      <span style={styles.name}>{`Class ${courseName} - ${studentId}`}</span>
      <Button style={styles.leaveButton}>Leave</Button>
    </div>
  );
};

const styles = {
  container: {
    height: '58px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#6495ed'
  },
  logo: {
    maxWidth: '30px',
    margin: '10px',
    marginLeft: '20px'
  },
  name: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: '20px'
  },
  leaveButton: {
    backgroundColor: '#F5b700',
    color: '#ffffff',
    borderColor: '#F5b700',
    margin: '10px',
    marginRight: '20px'
  }
};

Header.propTypes = {
  courseName: PropTypes.string.isRequired,
  studentId: PropTypes.string.isRequired
};

export default Header;
