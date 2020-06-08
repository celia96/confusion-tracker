import React, { useState, useRef } from 'react';
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

const styles = {
  saveButton: {
    backgroundColor: '#F5b700',
    borderColor: '#F5b700',
    fontWeight: '600',
    color: '#614908'
  }
};

const CourseForm = ({ courseNameRef, courseName }) => {
  const [nameValue, setName] = useState(courseName);
  return (
    <div>
      <Form>
        <FormGroup>
          <Label for="course">Course name</Label>
          <Input
            innerRef={courseNameRef}
            onChange={e => {
              setName(e.target.value);
              courseNameRef.current.value = e.target.value;
            }}
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

const EditCourse = ({ isOpen, editCourse, toggle, courseName }) => {
  const courseNameRef = useRef({ value: courseName });
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Change Course Name</ModalHeader>
      <ModalBody>
        <CourseForm courseNameRef={courseNameRef} courseName={courseName} />
      </ModalBody>
      <ModalFooter>
        <Button
          color="primary"
          onClick={() => {
            editCourse(courseNameRef.current.value);
            toggle();
          }}
          style={styles.saveButton}
        >
          Save
        </Button>{' '}
      </ModalFooter>
    </Modal>
  );
};

EditCourse.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired
};

export default EditCourse;
