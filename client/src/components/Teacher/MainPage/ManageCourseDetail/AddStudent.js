import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { RiDeleteBin6Line } from 'react-icons/ri';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Label,
  Form,
  FormGroup,
  FormText,
  CustomInput,
  Row,
  Col,
  Table
} from 'reactstrap';

const AddFileForm = () => (
  <Form>
    <FormGroup>
      <Label for="customFileBrowser">Student List File</Label>
      <CustomInput type="file" id="customFileBrowser" name="customFile" />
      <FormText>The file should be formatted accordingly</FormText>
    </FormGroup>
  </Form>
);

const AddManuallyForm = ({ add }) => {
  const nameRef = useRef(null);
  const studentIdRef = useRef(null);
  const emailRef = useRef(null);

  return (
    <Form>
      <Row form>
        <Col md={4}>
          <FormGroup>
            <Label for="student">Name</Label>
            <Input
              innerRef={nameRef}
              type="text"
              name="studentName"
              id="studentName"
              placeholder="Thor Odinson"
            />
          </FormGroup>
        </Col>
        <Col md={3}>
          <FormGroup>
            <Label for="id">Student ID</Label>
            <Input
              innerRef={studentIdRef}
              type="text"
              name="studentId"
              id="studentId"
              placeholder="00000000"
            />
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup>
            <Label for="email">Email</Label>
            <Input
              innerRef={emailRef}
              type="email"
              name="studentEmail"
              id="studentEmail"
              placeholder="example@example.com"
            />
          </FormGroup>
        </Col>
        <Col md={1} style={{ display: 'flex', justifyContent: 'center' }}>
          <FormGroup style={styles.submitForm}>
            <Button
              style={styles.addButton}
              onClick={() => {
                const student = {
                  name: nameRef.current.value,
                  studentId: studentIdRef.current.value,
                  email: emailRef.current.value
                };
                add(student);
                nameRef.current.value = '';
                studentIdRef.current.value = '';
                emailRef.current.value = '';
              }}
            >
              Add
            </Button>
          </FormGroup>
        </Col>
      </Row>
    </Form>
  );
};

const AddedStudents = ({ students }) => (
  <Table>
    <thead style={{ backgroundColor: '#f5f5f5' }}>
      <tr>
        <th>#</th>
        <th>Name</th>
        <th>Student ID</th>
        <th>Email</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {students.map((student, index) => {
        const { name, studentId, email } = student;
        return (
          <tr key={studentId}>
            <td>{index + 1}</td>
            <td>{name}</td>
            <td>{studentId}</td>
            <td>{email}</td>
            <td style={{ textAlign: 'right' }}>
              <RiDeleteBin6Line size="25" />
            </td>
          </tr>
        );
      })}
    </tbody>
  </Table>
);

const Option = ({ choose }) => (
  <div style={styles.optionContainer}>
    <Button onClick={() => choose('1')} style={styles.addButton}>
      Add Manually
    </Button>
    <Button onClick={() => choose('2')} style={styles.addButton}>
      Add File
    </Button>
  </div>
);

const AddStudent = ({ isOpen, toggle }) => {
  const [option, setOption] = useState(undefined);
  const [addedStudents, setAddedStudents] = useState([]);

  const choose = op => setOption(op);
  const add = student => {
    const students = addedStudents.slice();
    students.push(student);
    setAddedStudents(students);
  };

  const close = () => {
    toggle();
    setOption(undefined);
    setAddedStudents([]);
  };

  return (
    <Modal isOpen={isOpen} toggle={close} size={option ? 'lg' : 'sm'}>
      <ModalHeader toggle={close}>
        {option
          ? option === '1'
            ? 'Add Students Manually'
            : 'Add Students by File'
          : 'Add Students'}
      </ModalHeader>
      <ModalBody>
        {option ? (
          addedStudents.length > 0 ? (
            <AddedStudents students={addedStudents} />
          ) : null
        ) : null}
        {option ? (
          option === '1' ? (
            <AddManuallyForm add={add} />
          ) : (
            <AddFileForm add={add} />
          )
        ) : (
          <Option choose={choose} />
        )}
      </ModalBody>
      <ModalFooter style={styles.modalFooter}>
        {option ? (
          <div>
            <Button
              onClick={() => {
                close();
                console.log('save');
              }}
              style={styles.saveButton}
            >
              Save
            </Button>
          </div>
        ) : null}
        {option ? (
          <Button color="secondary" onClick={() => choose(undefined)}>
            Back
          </Button>
        ) : null}
      </ModalFooter>
    </Modal>
  );
};

const styles = {
  modalFooter: {
    borderTop: '0px'
  },
  optionContainer: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  addButton: {
    backgroundColor: '#6495ed',
    borderColor: '#6495ed'
  },
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

AddStudent.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired
};

export default AddStudent;
