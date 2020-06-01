import React from 'react';
import PropTypes from 'prop-types';
import { BsPeopleFill } from 'react-icons/bs';
import { Table, Button, Badge } from 'reactstrap';

const CourseList = ({ courses }) => {
  return (
    <div style={styles.container}>
      <Table hover style={styles.tableContainer}>
        <thead style={{ backgroundColor: '#f5f5f5', textAlign: 'center' }}>
          <tr>
            <th style={{ width: '5%' }}>#</th>
            <th style={{ width: '15%' }}>Course Name</th>
            <th style={{ width: '15%' }}>Students</th>
            <th style={{ width: '55%' }}></th>
            <th>Archive</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course, index) => (
            <tr
              style={{ textAlign: 'center' }}
              key={course.courseName + course.id}
            >
              <th scope="row" style={styles.aligned}>
                {index + 1}
              </th>
              <td style={styles.aligned}>{course.courseName}</td>
              <td style={styles.aligned}>
                <BsPeopleFill size="20" />
                <Badge style={styles.badge}>{course.students.length}</Badge>
              </td>
              <td />
              <td style={{ textAlign: 'center', ...styles.aligned }}>
                <Button style={styles.button}>View</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

const styles = {
  container: {
    padding: '50px',
    paddingTop: '30px'
  },
  tableContainer: {
    textAlign: 'center'
  },
  button: {
    backgroundColor: '#F5b700',
    borderColor: '#F5b700',
    fontWeight: '600',
    color: '#614908'
    // marginRight: '20px'
  },
  aligned: {
    verticalAlign: 'middle'
  },
  badge: {
    fontSize: 'xx-small',
    backgroundColor: '#6495ed'
  }
};

CourseList.propTypes = {
  courses: PropTypes.array.isRequired
};

export default CourseList;
