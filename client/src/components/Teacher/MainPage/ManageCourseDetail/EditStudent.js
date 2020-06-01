import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  Label,
  Form,
  FormGroup,
  Row,
  Col
} from 'reactstrap';

const styles = {
  saveButton: {
    backgroundColor: '#F5b700',
    borderColor: '#F5b700',
    fontWeight: '600',
    color: '#614908'
  },
  submitForm: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end'
  }
};

const StudentForm = ({ studentInfo }) => {
  const { name, studentId, email } = studentInfo;
  const [nameValue, setName] = useState(name);
  const [studentIdValue, setStudentId] = useState(studentId);
  const [emailValue, setEmail] = useState(email);

  return (
    <Form>
      <Row form>
        <Col md={4}>
          <FormGroup>
            <Label for="student">Name</Label>
            <Input
              onChange={e => setName(e.target.value)}
              value={nameValue}
              type="text"
              name="studentName"
              id="studentName"
            />
          </FormGroup>
        </Col>
        <Col md={3}>
          <FormGroup>
            <Label for="id">Student ID</Label>
            <Input
              onChange={e => setStudentId(e.target.value)}
              value={studentIdValue}
              type="text"
              name="studentId"
              id="studentId"
            />
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup>
            <Label for="email">Email</Label>
            <Input
              onChange={e => setEmail(e.target.value)}
              value={emailValue}
              type="email"
              name="studentEmail"
              id="studentEmail"
            />
          </FormGroup>
        </Col>
        <Col md={1} style={{ display: 'flex', justifyContent: 'center' }}>
          <FormGroup style={styles.submitForm}>
            <Button style={styles.saveButton}>Save</Button>
          </FormGroup>
        </Col>
      </Row>
    </Form>
  );
};

const EditStudent = ({ isOpen, toggle, studentInfo }) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>Edit Student</ModalHeader>
      <ModalBody>
        <StudentForm studentInfo={studentInfo} />
      </ModalBody>
    </Modal>
  );
};

EditStudent.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired
};

export default EditStudent;
