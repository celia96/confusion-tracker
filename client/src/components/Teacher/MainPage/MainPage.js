import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlay } from 'react-icons/fa';
import { MdSchool } from 'react-icons/md';
import { GrUserSettings } from 'react-icons/gr';

import Header from './Header';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    minWidth: '500px'
  },
  subContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  messageContainer: {
    flex: 2,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  message: {
    width: '300px'
  },
  divider: {
    height: '1px',
    backgroundColor: 'black'
  },
  optionContainer: {
    flex: 5,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    // alignItems: 'center'
    alignItems: 'flex-start'
  },
  image: {
    maxHeight: '45px',
    marginLeft: '20px'
  },
  option: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '300px',
    height: '200px',
    margin: '10px',
    borderRadius: '10px',
    backgroundColor: '#F5b700',
    borderColor: '#F5b700'
  }
};

const MainPage = () => {
  return (
    <div className="custom-container">
      <Header />
      <div style={styles.subContainer}>
        <div style={styles.messageContainer} />
        <div style={styles.optionContainer}>
          <Link to="/home" className="router-link">
            <div style={styles.option}>
              {/* opens a Modal that creates a class */}
              <FaPlay color="#000" size="50" />
              <span className="link-option">Start Class</span>
            </div>
          </Link>
          <Link to="/courses" className="router-link">
            <div style={styles.option}>
              <MdSchool color="#000" size="60" />
              <span className="link-option">Manage Courses</span>
            </div>
          </Link>
          <Link to="/profile" className="router-link">
            <div style={styles.option}>
              <GrUserSettings color="#000" size="50" />
              <span className="link-option">Profile Setting</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
