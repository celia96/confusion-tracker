import React from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  Form,
  FormGroup,
  Row,
  Col,
  Label,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap';

const StudentForm = ({ studentInfo }) => {
  const { name, studentId, email } = studentInfo;
  return (
    <Table bordered>
      <thead>
        <tr>
          <th>Name</th>
          <th>Student ID</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{name}</td>
          <td>{studentId}</td>
          <td>{email}</td>
        </tr>
      </tbody>
    </Table>
  );
};

const DeleteStudent = ({ isOpen, toggle, studentInfo }) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Delete Student</ModalHeader>
      <ModalBody>
        <div style={styles.bodyText}>
          Are you sure you want to delete this student?
        </div>
        <StudentForm studentInfo={studentInfo} />
      </ModalBody>
      <ModalFooter style={styles.modalFooter}>
        <Button color="primary" onClick={toggle} style={styles.confirmButton}>
          Confirm
        </Button>{' '}
        <Button onClick={toggle}>Cancel</Button>{' '}
      </ModalFooter>
    </Modal>
  );
};

const styles = {
  modalFooter: {
    borderTop: '0px'
  },
  bodyText: {
    fontWeight: '600',
    marginBottom: '10px'
  },
  confirmButton: {
    backgroundColor: '#F5b700',
    borderColor: '#F5b700',
    fontWeight: '600',
    color: '#614908'
  }
};

DeleteStudent.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired
};

export default DeleteStudent;
