import {
  Container,
  Col,
  Card,
  CardTitle,
  Input,
  Button,
  Label
} from 'reactstrap';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import logo from '../../logo.png';

class StudentRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomName: ''
    };
    this.handleRoomNameChange = this.handleRoomNameChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleRoomNameChange(event) {
    this.setState({
      roomName: event.target.value
    });
  }

  handleSubmit() {
    // fetch get /api/student/join/roomName checks whether the room exist or not
    // if success:true, move to confusion button
    fetch(`/api/student/join/${this.state.roomName}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(response.status_text);
        }
        return response.json();
      })
      .then(responseJSON => {
        if (responseJSON.success) {
          this.props.history.push(
            `/login/student/nickname/${responseJSON.room.roomName}`
          );
        } else {
          alert(responseJSON.message);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }
  render() {
    const isEnabled = this.state.roomName.length > 0;
    return (
      <Container>
        <div style={{ margin: '30px' }} />
        <img src={logo} style={{ maxWidth: '300px' }} alt="logo" />
        <Col sm="12" md={{ size: 6, offset: 3 }}>
          <Card
            body
            style={{ backgroundColor: '#c4defc', borderColor: '#c4defc' }}
          >
            <CardTitle
              style={{
                fontWeight: 600,
                textAlign: 'left',
                fontSize: '24px',
                marginBottom: '30px'
              }}
            >
              Join room
            </CardTitle>
            <Label style={{ textAlign: 'left' }}>Room name</Label>
            <Input
              onChange={this.handleRoomNameChange}
              type="text"
              value={this.state.roomName}
              style={{ marginBottom: '10px' }}
            />
            <Button
              onClick={this.handleSubmit}
              disabled={!isEnabled}
              style={{
                backgroundColor: '#75b8ff',
                borderColor: '#75b8ff'
              }}
            >
              Join
            </Button>
          </Card>
        </Col>
      </Container>
    );
  }
}

StudentRoom.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  })
};

export default StudentRoom;
