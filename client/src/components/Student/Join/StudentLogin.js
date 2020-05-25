import React, { Component } from 'react';
import {
  Container,
  Col,
  Card,
  CardTitle,
  Input,
  Button,
  Label
} from 'reactstrap';
import logo from '../../../logo.png';

class StudentLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nickname: '',
      roomName: this.props.match.params.roomName
    };
    this.handleNicknameChange = this.handleNicknameChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleNicknameChange(event) {
    this.setState({
      nickname: event.target.value
    });
  }

  handleSubmit() {
    fetch('/api/student/login', {
      method: 'POST',
      body: JSON.stringify({
        nickname: this.state.nickname,
        roomName: this.state.roomName
      }),
      headers: new Headers({ 'Content-type': 'application/json' })
    })
      .then(response => {
        if (!response.ok) {
          throw Error(response.status_text);
        }
        return response.json();
      })
      .then(responseJson => {
        if (responseJson.success) {
          alert('Your login is successful');
          sessionStorage.setItem(
            'student',
            JSON.stringify({ student: responseJson.nickname })
          );
          this.props.history.push(
            `/student/${responseJson.nickname}/room/${
              responseJson.room.roomName
            }`
          );
        } else {
          alert(responseJson.message);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }
  render() {
    const isEnabled = this.state.nickname.length > 0;
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
              Enter Nickname
            </CardTitle>
            <Label style={{ textAlign: 'left' }}>Nickname</Label>
            <Input
              onChange={this.handleNicknameChange}
              type="text"
              value={this.state.nickname}
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
              Confirm
            </Button>
          </Card>
        </Col>
      </Container>
    );
  }
}

export default StudentLogin;
