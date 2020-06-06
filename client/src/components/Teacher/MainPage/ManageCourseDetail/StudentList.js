import React from 'react';
import PropTypes from 'prop-types';
import { FaUserPlus, FaRegUserCircle } from 'react-icons/fa';
import { BsPeopleFill } from 'react-icons/bs';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { TiEdit } from 'react-icons/ti';
import { Table, Button, Badge } from 'reactstrap';

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '30px'
  },
  subContainer: {
    // width: '100%'
    flex: 1
  },
  subHeaderContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginLeft: '10px',
    marginRight: '10px',
    marginBottom: '10px'
  },
  titleText: {
    fontSize: '25px',
    fontWeight: '600'
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  listItem: {
    display: 'flex',
    alignItems: 'center'
  },
  badge: {
    fontSize: 'medium',
    backgroundColor: '#6495ed'
  },
  button: {
    backgroundColor: '#F5b700',
    borderColor: '#F5b700',
    borderRadius: '50px',
    fontWeight: '600',
    color: '#614908',
    display: 'flex',
    alignItems: 'center'
  }
};

const StudentList = ({
  students,
  loadStudent,
  toggleAddStudent,
  toggleEditStudent,
  toggleDeleteStudent
}) => {
  return (
    <div style={styles.container}>
      <div style={styles.subContainer}>
        <div style={styles.subHeaderContainer}>
          <div style={styles.iconContainer}>
            <span style={styles.titleText}>Students</span>
            <span style={{ margin: '5px' }} />
            <BsPeopleFill size="30" />
            <span style={{ margin: '1px' }} />
            <Badge style={styles.badge}>4</Badge>
          </div>
          <Button onClick={toggleAddStudent} style={styles.button}>
            <FaUserPlus />
            <span style={{ margin: '5px' }} />
            <span>Add Students</span>
          </Button>
        </div>
        <Table>
          <thead style={{ backgroundColor: '#f5f5f5' }}>
            <tr>
              <th />
              <th>Name</th>
              <th>Student ID</th>
              <th>Email</th>
              <th />
              <th />
            </tr>
          </thead>
          <tbody>
            {students.map(student => {
              const { studentId, name, email } = student;
              return (
                <tr key={studentId}>
                  <th scope="row" style={{ textAlign: 'center' }}>
                    <FaRegUserCircle size="25" style={{ margin: '5px' }} />
                  </th>
                  <td>{name}</td>
                  <td>{studentId}</td>
                  <td>{email}</td>
                  <td
                    onClick={() => {
                      loadStudent(student);
                      toggleEditStudent();
                    }}
                  >
                    <TiEdit className="pointer" size="23" />
                  </td>
                  <td
                    onClick={() => {
                      loadStudent(student);
                      toggleDeleteStudent();
                    }}
                  >
                    <RiDeleteBin6Line className="pointer" size="20" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

StudentList.propTypes = {
  students: PropTypes.array.isRequired,
  toggleAddStudent: PropTypes.func.isRequired
};

export default StudentList;
