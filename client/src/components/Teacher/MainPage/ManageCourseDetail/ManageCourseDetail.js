import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FaChalkboardTeacher, FaPlay } from 'react-icons/fa';
import { BsFillArchiveFill, BsPeopleFill } from 'react-icons/bs';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { MdEdit } from 'react-icons/md';
import {
  Button,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Row,
  Col
} from 'reactstrap';

import Header from '../Header';
import ClassList from './ClassList';
import StudentList from './StudentList';

import AddStudent from './AddStudent';
import EditStudent from './EditStudent';
import EditCourse from './EditCourse';
import DeleteStudent from './DeleteStudent';
import DeleteCourse from './DeleteCourse';

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
  },
  navContainer: {
    margin: '50px',
    marginTop: '30px'
  },
  delete: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end'
  }
};

class ManageCourseDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: [],
      students: [],
      courseName: '',
      activeTab: '1',
      openAddStudent: false,
      openEditStudent: false,
      openEditCourse: false,
      openDeleteStudent: false,
      openDeleteCourse: false,
      studentInfo: {}
    };
    this.editCourse = this.editCourse.bind(this);
    this.deleteCourse = this.deleteCourse.bind(this);
    this.toggleTab = this.toggleTab.bind(this);
    this.toggleAddStudentModal = this.toggleAddStudentModal.bind(this);
    this.toggleEditStudentModal = this.toggleEditStudentModal.bind(this);
    this.toggleEditCourseModal = this.toggleEditCourseModal.bind(this);
    this.toggleDeleteStudentModal = this.toggleDeleteStudentModal.bind(this);
    this.toggleDeleteCourseModal = this.toggleDeleteCourseModal.bind(this);
    this.loadStudentInfo = this.loadStudentInfo.bind(this);
  }

  componentDidMount() {
    const { courseId } = this.props;
    console.log('course id ', courseId);
    fetch(`/api/course/${courseId}`)
      .then(response => {
        if (!response.ok) throw new Error(response.status_text);
        return response.json();
      })
      .then(course => {
        const { classes, students, courseName } = course;
        this.setState({
          classes,
          students,
          courseName
        });
      })
      .catch(err => console.log(err));
  }

  editCourse(newCourseName) {
    const { courseId } = this.props;
    const body = JSON.stringify({
      courseName: newCourseName
    });
    fetch(`/api/course/${courseId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body
    })
      .then(response => {
        if (!response.ok) throw new Error(response.status_text);
        return response.json();
      })
      .then(courseName => {
        this.setState({
          courseName
        });
      })
      .catch(err => console.log(err));
  }

  deleteCourse(courseId) {
    console.log('delete ', courseId);
    const { teacherId } = this.props;
    const body = JSON.stringify({
      teacherId
    });
    fetch(`/api/course/${courseId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body
    }).then(response => {
      if (!response.ok) throw new Error(response.status_text);
      console.log('redirect');
      this.props.history.push('/courses');
    });
  }

  toggleTab(tab) {
    const { activeTab } = this.state;
    if (activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  toggleAddStudentModal() {
    const { openAddStudent } = this.state;
    this.setState({
      openAddStudent: !openAddStudent
    });
  }

  toggleEditStudentModal() {
    const { openEditStudent } = this.state;
    this.setState({
      openEditStudent: !openEditStudent
    });
  }

  toggleEditCourseModal() {
    const { openEditCourse } = this.state;
    this.setState({
      openEditCourse: !openEditCourse
    });
  }

  toggleDeleteStudentModal() {
    const { openDeleteStudent } = this.state;
    this.setState({
      openDeleteStudent: !openDeleteStudent
    });
  }

  toggleDeleteCourseModal() {
    const { openDeleteCourse } = this.state;
    this.setState({
      openDeleteCourse: !openDeleteCourse
    });
  }

  loadStudentInfo(student) {
    this.setState({
      studentInfo: student
    });
  }

  render() {
    const {
      courseName,
      classes,
      students,
      activeTab,
      openAddStudent,
      openEditStudent,
      openEditCourse,
      openDeleteStudent,
      openDeleteCourse,
      studentInfo
    } = this.state;
    const { courseId } = this.props;

    return (
      <div className="custom-container">
        <Header />
        <div style={styles.subContainer}>
          <div style={styles.title}>
            <FaChalkboardTeacher size="40" />
            <span style={{ margin: '5px' }} />
            <span style={styles.titleText}>{courseName}</span>
            <span style={{ margin: '10px' }} />
            <MdEdit
              className="pointer"
              onClick={this.toggleEditCourseModal}
              size="25"
            />
          </div>
          <Button style={styles.button}>
            <FaPlay />
            <span style={{ margin: '5px' }} />
            <span>Start Class</span>
          </Button>
        </div>
        <div style={styles.navContainer}>
          <Nav tabs>
            <NavItem className="pointer">
              <NavLink
                className={activeTab === '1' ? 'active' : ''}
                onClick={() => this.toggleTab('1')}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <BsFillArchiveFill size="20" />
                  <span style={{ margin: '3px' }} />
                  <span>Class Archive</span>
                </div>
              </NavLink>
            </NavItem>
            <NavItem className="pointer">
              <NavLink
                className={activeTab === '2' ? 'active' : ''}
                onClick={() => this.toggleTab('2')}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <BsPeopleFill size="20" />
                  <span style={{ margin: '3px' }} />
                  <span>Students</span>
                </div>
              </NavLink>
            </NavItem>
            <div style={styles.delete}>
              <div onClick={this.toggleDeleteCourseModal}>
                <RiDeleteBin6Line className="pointer" size="25" />
              </div>
            </div>
          </Nav>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
              <Row>
                <Col sm="12">
                  <ClassList classes={classes} courseName={courseName} />
                </Col>
              </Row>
            </TabPane>
            <TabPane tabId="2">
              <Row>
                <Col sm="12">
                  <StudentList
                    students={students}
                    loadStudent={this.loadStudentInfo}
                    toggleAddStudent={this.toggleAddStudentModal}
                    toggleEditStudent={this.toggleEditStudentModal}
                    toggleDeleteStudent={this.toggleDeleteStudentModal}
                  />
                </Col>
              </Row>
            </TabPane>
          </TabContent>
        </div>
        <AddStudent
          isOpen={openAddStudent}
          toggle={this.toggleAddStudentModal}
        />
        <EditStudent
          isOpen={openEditStudent}
          toggle={this.toggleEditStudentModal}
          studentInfo={studentInfo}
        />
        <EditCourse
          isOpen={openEditCourse}
          editCourse={this.editCourse}
          toggle={this.toggleEditCourseModal}
          courseName={courseName}
        />
        <DeleteCourse
          isOpen={openDeleteCourse}
          deleteCourse={this.deleteCourse}
          toggle={this.toggleDeleteCourseModal}
          courseName={courseName}
          courseId={courseId}
        />
        <DeleteStudent
          isOpen={openDeleteStudent}
          toggle={this.toggleDeleteStudentModal}
          studentInfo={studentInfo}
        />
      </div>
    );
  }
}

ManageCourseDetail.propTypes = {
  courseId: PropTypes.string.isRequired
};

const mapStateToProps = (state, props) => {
  return {
    courseId:
      (props &&
        props.location &&
        props.location.state &&
        props.location.state.courseId) ||
      '5ed1d9d5e7179a6b63659629', // prob from redux... or save it in session...?
    teacherId: state && state.teacher && state.teacher.teacherId
  };
};

export default connect(mapStateToProps, null)(ManageCourseDetail);
