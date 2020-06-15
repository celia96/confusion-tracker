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

const ClassForm = ({ roomCodeRef }) => (
  <div>
    <Form>
      <FormGroup>
        <Label for="course">Set Room Code</Label>
        <Input
          innerRef={roomCodeRef}
          type="text"
          name="roomCode"
          id="roomCode"
          placeholder="e.g. YALE-CS101-vpdlvkf"
        />
      </FormGroup>
    </Form>
  </div>
);

const StartClass = ({ isOpen, startClass, toggle, courseName }) => {
  const roomCodeRef = useRef(null);

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Start Class for {courseName}</ModalHeader>
      <ModalBody style={styles.modalBody}>
        <ClassForm roomCodeRef={roomCodeRef} />
      </ModalBody>
      <ModalFooter style={styles.modalFooter}>
        <Button
          color="primary"
          onClick={() => {
            const roomCode = roomCodeRef.current.value;
            startClass(roomCode);
            roomCodeRef.current.value = '';
            toggle();
          }}
          style={styles.confirmButton}
        >
          Confirm
        </Button>
        <Button onClick={toggle}>Cancel</Button>
      </ModalFooter>
    </Modal>
  );
};

StartClass.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired
};

export default StartClass;
