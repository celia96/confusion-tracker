import React, { useRef } from 'react';
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

const CourseForm = ({ courseNameRef }) => (
  <div>
    <Form>
      <FormGroup>
        <Label for="course">Course name</Label>
        <Input
          innerRef={courseNameRef}
          type="text"
          name="course"
          id="course"
          placeholder=""
        />
      </FormGroup>
    </Form>
  </div>
);

const AddCourse = ({ isOpen, toggle, addCourse }) => {
  const courseNameRef = useRef(null);
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>New Course</ModalHeader>
      <ModalBody>
        <CourseForm courseNameRef={courseNameRef} />
      </ModalBody>
      <ModalFooter>
        <Button
          color="primary"
          onClick={() => {
            const courseName = courseNameRef.current.value;
            addCourse(courseName);
            courseNameRef.current.value = '';
            toggle();
          }}
          style={styles.saveButton}
        >
          Save
        </Button>
      </ModalFooter>
    </Modal>
  );
};

AddCourse.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired
};

export default AddCourse;
