import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Label,
  Form,
  FormGroup
} from 'reactstrap';

const CourseForm = ({ courseName }) => {
  const [nameValue, setName] = useState(courseName);
  return (
    <div>
      <Form>
        <FormGroup>
          <Label for="course">Course name</Label>
          <Input
            onChange={e => setName(e.target.value)}
            value={nameValue}
            type="text"
            name="course"
            id="course"
          />
        </FormGroup>
      </Form>
    </div>
  );
};

const EditCourse = ({ isOpen, toggle, courseName }) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Change Course Name</ModalHeader>
      <ModalBody>
        <CourseForm courseName={courseName} />
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={toggle} style={styles.saveButton}>
          Save
        </Button>{' '}
      </ModalFooter>
    </Modal>
  );
};

const styles = {
  saveButton: {
    backgroundColor: '#F5b700',
    borderColor: '#F5b700',
    fontWeight: '600',
    color: '#614908'
  }
};

EditCourse.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired
};

export default EditCourse;
