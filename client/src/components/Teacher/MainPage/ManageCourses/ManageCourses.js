import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { MdSchool } from 'react-icons/md';
import { TiPlus } from 'react-icons/ti';
import { Button } from 'reactstrap';

import Header from '../Header';
import CourseList from './CourseList';
import AddCourse from './AddCourse';

import data from '../../../../data/data.json';

const styles = {
  subContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '50px',
    marginLeft: '70px',
    marginRight: '70px'
  },
  title: {
    display: 'flex',
    alignItems: 'center'
  },
  titleText: {
    fontSize: '30px',
    fontWeight: '600'
  },
  button: {
    backgroundColor: '#F5b700',
    borderColor: '#F5b700',
    borderRadius: '50px',
    fontWeight: '600',
    color: '#614908',
    padding: '10px',
    display: 'flex',
    alignItems: 'center'
  }
};

class ManageCourses extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courses: [],
      isOpen: false
    };
    this.toggleAddCourseModal = this.toggleAddCourseModal.bind(this);
  }

  componentDidMount() {
    // fetch
    const { courses } = data;
    this.setState({
      courses
    });
  }

  toggleAddCourseModal() {
    const { isOpen } = this.state;
    this.setState({
      isOpen: !isOpen
    });
  }

  render() {
    const { courses, isOpen } = this.state;
    const { teacherInfo } = this.props;

    return (
      <div className="custom-container">
        <Header teacherInfo={teacherInfo} />
        <div style={styles.subContainer}>
          <div style={styles.title}>
            <MdSchool size="40" />
            <span style={{ margin: '5px' }} />
            <span style={styles.titleText}>Courses</span>
          </div>
          <Button style={styles.button} onClick={this.toggleAddCourseModal}>
            <TiPlus />
            <span style={{ margin: '5px' }} />
            <span>{' Add Course'}</span>
          </Button>
        </div>
        <CourseList courses={courses} />
        <AddCourse isOpen={isOpen} toggle={this.toggleAddCourseModal} />
      </div>
    );
  }
}

ManageCourses.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageCourses);
