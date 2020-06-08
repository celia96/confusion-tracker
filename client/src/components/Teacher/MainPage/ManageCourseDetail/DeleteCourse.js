import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const styles = {
  modalFooter: {
    borderTop: '0px'
  },
  modalBody: {
    fontWeight: '600'
  },
  confirmButton: {
    backgroundColor: '#F5b700',
    borderColor: '#F5b700',
    fontWeight: '600',
    color: '#614908'
  }
};

const DeleteCourse = ({
  isOpen,
  deleteCourse,
  toggle,
  courseName,
  courseId
}) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Delete {courseName}</ModalHeader>
      <ModalBody style={styles.modalBody}>
        Are you sure you want to delete {courseName}?
      </ModalBody>
      <ModalFooter style={styles.modalFooter}>
        <Button
          color="primary"
          onClick={() => {
            deleteCourse(courseId);
            toggle();
          }}
          style={styles.confirmButton}
        >
          Confirm
        </Button>{' '}
        <Button onClick={toggle}>Cancel</Button>{' '}
      </ModalFooter>
    </Modal>
  );
};

DeleteCourse.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired
};

export default DeleteCourse;
