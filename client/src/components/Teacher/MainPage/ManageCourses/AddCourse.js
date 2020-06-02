import React from 'react';
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

const CourseForm = () => (
  <div>
    <Form>
      <FormGroup>
        <Label for="course">Course name</Label>
        <Input type="text" name="course" id="course" placeholder="" />
      </FormGroup>
    </Form>
  </div>
);

const AddCourse = ({ isOpen, toggle }) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>New Course</ModalHeader>
      <ModalBody>
        <CourseForm />
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={toggle} style={styles.saveButton}>
          Save
        </Button>{' '}
      </ModalFooter>
    </Modal>
  );
};

AddCourse.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired
};

export default AddCourse;
