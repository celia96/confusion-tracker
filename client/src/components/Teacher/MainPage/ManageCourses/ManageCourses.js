import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { MdSchool } from 'react-icons/md';
import { TiPlus } from 'react-icons/ti';
import { Button } from 'reactstrap';

import Header from '../Header';
import CourseList from './CourseList';
import AddCourse from './AddCourse';

// import data from '../../../../data/data.json';

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
    this.addCourse = this.addCourse.bind(this);
  }

  componentDidMount() {
    // fetch
    const { teacherId } = this.props;
    fetch(`/api/courses/${teacherId}`)
      .then(response => {
        if (!response.ok) throw new Error(response.status_text);
        return response.json();
      })
      .then(courses => {
        console.log('courses ', courses);
        this.setState({
          courses
        });
      })
      .catch(err => console.log(err));
  }

  toggleAddCourseModal() {
    const { isOpen } = this.state;
    this.setState({
      isOpen: !isOpen
    });
  }

  addCourse(courseName) {
    console.log('adding course ', courseName);
    const { teacherId } = this.props;
    const body = JSON.stringify({
      teacherId,
      courseName
    });
    console.log('bodty ', body);
    fetch('/api/course', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body
    })
      .then(response => {
        if (!response.ok) throw new Error(response.status_text);
        return response.json();
      })
      .then(newCourse => {
        const courses = [newCourse, ...this.state.courses];
        this.setState({
          courses
        });
      })
      .catch(err => console.log(err));
  }

  render() {
    const { courses, isOpen } = this.state;

    return (
      <div className="custom-container">
        <Header />
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
        <AddCourse
          isOpen={isOpen}
          addCourse={this.addCourse}
          toggle={this.toggleAddCourseModal}
        />
      </div>
    );
  }
}

ManageCourses.propTypes = {
  teacherId: PropTypes.string.isRequired
};

const mapStateToProps = state => {
  return {
    teacherId: state && state.teacher.teacherId
  };
};

export default connect(mapStateToProps, null)(ManageCourses);
