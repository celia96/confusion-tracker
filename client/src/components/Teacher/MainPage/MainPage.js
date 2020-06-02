import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FaPlay } from 'react-icons/fa';
import { MdSchool } from 'react-icons/md';
import { GrUserSettings } from 'react-icons/gr';

import Header from './Header';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    maxHeight: '100vh'
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
    borderRadius: '10px',
    backgroundColor: '#F5b700',
    borderColor: '#F5b700'
  },
  text: {
    fontSize: '25px',
    fontWeight: '600',
    marginTop: '15px'
  }
};

const MainPage = ({ teacherInfo }) => {
  return (
    <div style={styles.container}>
      <Header teacherInfo={teacherInfo} />
      <div style={styles.subContainer}>
        <div style={styles.messageContainer} />
        <div style={styles.optionContainer}>
          <div style={styles.option}>
            <FaPlay size="50" />
            <span style={styles.text}>Start Class</span>
          </div>
          <div style={styles.option}>
            <MdSchool size="60" />
            <span style={styles.text}>Manage Courses</span>
          </div>
          <div style={styles.option}>
            <GrUserSettings size="50" />
            <span style={styles.text}>Profile Setting</span>
          </div>
        </div>
      </div>
    </div>
  );
};

MainPage.propTypes = {
  teacherInfo: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    teacherInfo: state && state.teacher
  };
};

const mapDispatchToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(MainPage);
