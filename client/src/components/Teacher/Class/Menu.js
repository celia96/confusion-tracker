import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Badge, ListGroup, ListGroupItem } from 'reactstrap';
import moment from 'moment';

import logo from '../../../assets/logo.png';
import menuIcon from '../../../assets/open-menu.png';

const styles = {
  container: {
    zIndex: 1,
    position: 'absolute',
    left: '0px',
    display: 'flex',
    flexDirection: 'row',
    height: '100vh',
    padding: '10px'
  },
  listGroupContainer: {
    margin: '5px'
  },
  badge: {
    backgroundColor: '#6495ed'
  },
  endClassButton: {
    backgroundColor: '#F5b700',
    borderColor: '#F5b700',
    width: '100%'
  }
};

const VerticalButton = ({ toggle }) => (
  <Button
    color="primary"
    onClick={toggle}
    style={{
      display: 'flex',
      margin: '5px',
      height: 'fit-content',
      backgroundColor: '#6495ed',
      borderColor: '#6495ed'
    }}
  >
    <img src={menuIcon} style={{ maxWidth: '20px' }} alt="open-menu" />
  </Button>
);

const Menu = ({ classInfo, teacherInfo, collapse, toggle }) => {
  const { questions, confusionRate, students, courseName } = classInfo;
  const { firstName, lastName } = teacherInfo;
  const studentsNum = Object.keys(students).length;
  const questionsNum = Object.keys(questions).length;
  const percentage = `${Math.floor(
    (confusionRate * 100) / studentsNum
  ).toString()} %`;
  const containerStyle = collapse
    ? { ...styles.container, width: '40%' }
    : styles.container;

  return (
    <div style={containerStyle}>
      {collapse ? (
        <ListGroup style={styles.listGroupContainer}>
          <ListGroupItem className="justify-content-between">
            <img
              src={logo}
              style={{ maxWidth: '300px', margin: '10px' }}
              alt="logo"
            />
          </ListGroupItem>
          <ListGroupItem className="justify-content-between">
            Hello, {firstName} {lastName}
          </ListGroupItem>
          <ListGroupItem className="justify-content-between">
            {moment().format('dddd, MMMM Do YYYY')}
          </ListGroupItem>
          <ListGroupItem className="justify-content-between">
            Class: {courseName}
          </ListGroupItem>
          <ListGroupItem className="justify-content-between">
            Students{' '}
            <Badge pill style={styles.badge}>
              {studentsNum}
            </Badge>
          </ListGroupItem>
          <ListGroupItem className="justify-content-between">
            Questions{' '}
            <Badge pill style={styles.badge}>
              {questionsNum}
            </Badge>
          </ListGroupItem>
          <ListGroupItem className="justify-content-between">
            Confusion: {percentage}
          </ListGroupItem>
          <ListGroupItem>
            <Button style={styles.endClassButton}>End Class</Button>
          </ListGroupItem>
        </ListGroup>
      ) : null}
      <VerticalButton style={{ marginBottom: '1rem' }} toggle={toggle} />
    </div>
  );
};

Menu.propTypes = {
  classInfo: PropTypes.object,
  teacherInfo: PropTypes.object
};

const mapStateToProps = state => {
  return {
    classInfo: state && state.classRoom,
    teacherInfo: state && state.teacher
  };
};

export default connect(mapStateToProps, null)(Menu);
