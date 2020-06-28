import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

import { joinClass } from '../../../redux/actions';

const styles = {
  contentContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 3
  },
  formContainer: {
    maxWidth: '600px',
    minWidth: '400px',
    backgroundColor: '#6495ed',
    padding: '20px',
    borderRadius: '5px'
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    margin: '5px'
  },
  titleText: {
    fontSize: '30px',
    fontWeight: '600'
  },
  submitButton: {
    width: '100%',
    marginTop: '20px',
    backgroundColor: '#F5b700',
    borderColor: '#F5b700',
    fontWeight: '600',
    color: '#614908'
  },
  cancelButton: {
    width: '100%',
    marginTop: '20px',
    backgroundColor: '#6c757d',
    borderColor: '#6c757d',
    fontWeight: '600',
    color: '#ffffff'
  },
  buttonContainer: {
    display: 'flex'
  },
  label: {
    color: '#000',
    fontWeight: '600'
  },
  action: {
    color: '#fff'
  }
};

const RoomCodeForm = ({ submit, roomCode, onChange }) => {
  return (
    <Form>
      <FormGroup>
        <Label style={styles.label}>Room Code</Label>
        <Input
          value={roomCode}
          onChange={e => onChange(e)}
          type="roomCode"
          name="roomCode"
          id="roomCode"
        />
      </FormGroup>
      <Button onClick={submit} style={styles.submitButton}>
        Submit
      </Button>
    </Form>
  );
};

const StudentIdForm = ({ goBack, submit, studentId, onChange }) => {
  return (
    <Form>
      <FormGroup>
        <Label style={styles.label}>Student ID</Label>
        <Input
          value={studentId}
          onChange={e => onChange(e)}
          type="text"
          name="studentId"
          id="studentId"
        />
      </FormGroup>
      <div style={styles.buttonContainer}>
        <Button onClick={goBack} style={styles.cancelButton}>
          Back
        </Button>
        <span style={{ margin: '10px' }} />
        <Button onClick={submit} style={styles.submitButton}>
          Submit
        </Button>
      </div>
    </Form>
  );
};

class StudentLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomCode: '',
      studentId: '',
      courseName: '',
      classId: '',
      grantedAccess: false,
      success: false
    };
    this.goBack = this.goBack.bind(this);
    this.onChangeRoomCode = this.onChangeRoomCode.bind(this);
    this.onChangeStudentId = this.onChangeStudentId.bind(this);
    this.getClassRoom = this.getClassRoom.bind(this);
    this.joinClassRoom = this.joinClassRoom.bind(this);
  }

  goBack() {
    this.props.history.push('/join');
    this.setState({
      grantedAccess: false
    });
  }

  onChangeRoomCode(e) {
    this.setState({
      roomCode: e.target.value
    });
  }

  onChangeStudentId(e) {
    this.setState({
      studentId: e.target.value
    });
  }

  getClassRoom() {
    const { roomCode } = this.state;
    const { join } = this.props;

    fetch(`/api/class/roomCode/${roomCode}`)
      .then(response => {
        if (!response.ok) throw new Error(response.status_text);
        return response.json();
      })
      .then(payload => {
        const { canAccess, courseName, classId } = payload;
        join({ classId, courseName });
        this.setState({
          grantedAccess: canAccess,
          courseName,
          classId
        });
        this.props.history.push({
          pathname: '/join',
          hash: `#${courseName}`
        });
      })
      .catch(err => console.log(err));
  }

  joinClassRoom() {
    const { studentId, classId, courseName } = this.state;
    console.log('submit form', studentId, classId);
    const { join } = this.props;
    join({ studentId, classId, courseName });
    this.props.history.push(`/student/class/${courseName}`);
  }

  render() {
    const {
      success,
      grantedAccess,
      roomCode,
      studentId,
      courseName
    } = this.state;
    return (
      <div className="custom-container">
        {success ? <Redirect to={`/student/class/${courseName}`} /> : null}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1
          }}
        >
          <div style={{ flex: 2 }} />
          <div style={styles.contentContainer}>
            <div style={styles.title}>
              {/* <GrUserSettings size="40" /> */}
              <span style={{ margin: '5px' }} />
              <span style={styles.titleText}>
                Join {!grantedAccess ? 'Class' : courseName}
              </span>
            </div>
            <div style={styles.formContainer}>
              {!grantedAccess ? (
                <RoomCodeForm
                  roomCode={roomCode}
                  submit={this.getClassRoom}
                  onChange={this.onChangeRoomCode}
                />
              ) : (
                <StudentIdForm
                  studentId={studentId}
                  goBack={this.goBack}
                  submit={this.joinClassRoom}
                  onChange={this.onChangeStudentId}
                />
              )}
            </div>
          </div>
          <div style={{ flex: 2 }} />
        </div>
      </div>
    );
  }
}

StudentLogin.propTypes = {
  join: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => {
  return {
    join: payload => dispatch(joinClass(payload))
  };
};

export default connect(null, mapDispatchToProps)(StudentLogin);
