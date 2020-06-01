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

import data from '../../../../data/data.json';
import AddStudent from './AddStudent';
import EditStudent from './EditStudent';
import EditCourse from './EditCourse';
import DeleteStudent from './DeleteStudent';
import DeleteCourse from './DeleteCourse';

class ManageCourseDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: [],
      students: [],
      courseName: '',
      activeTab: '2',
      openAddStudent: false,
      openEditStudent: false,
      openEditCourse: false,
      openDeleteStudent: false,
      openDeleteCourse: false,
      studentInfo: {}
    };
    this.toggleTab = this.toggleTab.bind(this);
    this.toggleAddStudentModal = this.toggleAddStudentModal.bind(this);
    this.toggleEditStudentModal = this.toggleEditStudentModal.bind(this);
    this.toggleEditCourseModal = this.toggleEditCourseModal.bind(this);
    this.toggleDeleteStudentModal = this.toggleDeleteStudentModal.bind(this);
    this.toggleDeleteCourseModal = this.toggleDeleteCourseModal.bind(this);
    this.loadStudentInfo = this.loadStudentInfo.bind(this);
  }

  componentDidMount() {
    // Below data will be fetched from classInfo
    const course = (data.courses && data.courses[0]) || {};

    const classes = course.classes || [];
    const courseName = course.courseName || '';
    const students = course.students || [];

    this.setState({
      classes,
      courseName,
      students
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
    const { teacherInfo } = this.props;

    return (
      <div style={styles.container}>
        <Header teacherInfo={teacherInfo} />
        <div style={styles.subContainer}>
          <div style={styles.title}>
            <FaChalkboardTeacher size="40" />
            <span style={{ margin: '5px' }} />
            <span style={styles.titleText}>{courseName}</span>
            <span style={{ margin: '10px' }} />
            <MdEdit
              onClick={this.toggleEditCourseModal}
              style={styles.pointer}
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
            <NavItem style={styles.pointer}>
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
            <NavItem style={styles.pointer}>
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
                <RiDeleteBin6Line style={styles.pointer} size="25" />
              </div>
            </div>
          </Nav>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
              <Row>
                <Col sm="12">
                  <ClassList classes={classes} />
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
          toggle={this.toggleEditCourseModal}
          courseName={courseName}
        />
        <DeleteCourse
          isOpen={openDeleteCourse}
          toggle={this.toggleDeleteCourseModal}
          courseName={courseName}
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

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    maxHeight: '100vh'
  },
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
  },
  pointer: {
    cursor: 'pointer'
  }
};

ManageCourseDetail.propTypes = {
  teacherInfo: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    teacherInfo: state && state.teacher
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageCourseDetail);
