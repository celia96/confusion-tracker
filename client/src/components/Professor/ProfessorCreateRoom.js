import React, { Component } from 'react';
import {
  Container,
  Col,
  Card,
  CardTitle,
  CardSubtitle,
  Input,
  Label,
  Button
} from 'reactstrap';
import Authn from '../Authn/Authn';
import { Redirect } from 'react-router-dom';
import { Dropdown } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import logo from '../../logo.png';

class ProfessorCreateRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomName: '',
      tags: [],
      options: [],
      duration: undefined,
      alert: undefined
    };
    this.handleRoomNameChange = this.handleRoomNameChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleAddition = this.handleAddition.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDuration = this.handleDuration.bind(this);
    this.handleAlert = this.handleAlert.bind(this);
    this.goBack = this.goBack.bind(this);
  }

  handleRoomNameChange(event) {
    this.setState({
      roomName: event.target.value
    });
  }
  handleAddition(e, { value }) {
    this.setState({
      options: [{ text: value, value }, ...this.state.options]
    });
  }

  handleChange(e, { value }) {
    this.setState({ tags: value });
  }

  handleDuration(e) {
    this.setState({ duration: e.target.value });
  }

  handleAlert(e) {
    this.setState({ alert: e.target.value });
  }
  goBack() {
    this.props.history.push('/professor/menu');
  }
  handleSubmit() {
    const profile = Authn.getProfile();
    fetch('/api/professor/create/room', {
      method: 'POST',
      body: JSON.stringify({
        roomName: this.state.roomName,
        owner: profile.email,
        tags: this.state.tags,
        duration: this.state.duration,
        alert: this.state.alert
      }),
      headers: new Headers({ 'Content-type': 'application/json' })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(response.status_text);
        }
        return response.json();
      })
      .then(responseJSON => {
        if (responseJSON.success) {
          const chart = {
            data: [],
            labels: []
          };
          localStorage.setItem('chart', JSON.stringify(chart));
          alert('successful');
          this.props.history.push(
            `/professor/room/${responseJSON.room.roomName}`
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
    const profile = Authn.getProfile();
    if (!profile) {
      return (
        <Redirect
          to={{
            pathname: '/login/professor',
            state: { from: this.props.location }
          }}
        />
      );
    }
    const { tags, options } = this.state;
    const isEnabled =
      this.state.roomName.length > 0 &&
      this.state.duration > 0 &&
      this.state.alert >= 0;

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
              Create Room:
            </CardTitle>
            <Label style={{ textAlign: 'left' }}>* Room Name</Label>
            <Input
              onChange={this.handleRoomNameChange}
              type="text"
              value={this.state.roomName}
              style={{ marginBottom: '10px' }}
            />
            <Label style={{ textAlign: 'left' }}>
              * Class Duration (in minutes){' '}
            </Label>
            <Input
              required="required"
              placeholder={'Enter #'}
              onChange={this.handleDuration}
              type="number"
              value={this.state.duration}
              style={{ marginBottom: '10px' }}
            />
            <Label style={{ textAlign: 'left' }}>
              * Alert Rate (percentage of confused students){' '}
            </Label>
            <Input
              placeholder={'Enter %, no decimal needed'}
              onChange={this.handleAlert}
              type="number"
              value={this.state.alert}
              style={{ marginBottom: '10px' }}
            />
            <Label style={{ textAlign: 'left' }}>Tags</Label>
            <Dropdown
              placeholder={'Add tags'}
              options={options}
              search
              selection
              fluid
              multiple
              allowAdditions
              value={tags}
              noResultsMessage={null}
              onAddItem={this.handleAddition}
              onChange={this.handleChange}
              style={{ marginBottom: '40px' }}
            />
            <Button
              onClick={this.handleSubmit}
              disabled={!isEnabled}
              style={{
                backgroundColor: '#75b8ff',
                borderColor: '#75b8ff',
                marginBottom: '10px'
              }}
            >
              Create
            </Button>
            <Button
              onClick={this.goBack}
              style={{
                backgroundColor: '#f5b700',
                borderColor: '#f5b700',
                marginBottom: '10px'
              }}
            >
              Cancel
            </Button>
            <CardSubtitle
              style={{
                textAlign: 'center',
                marginBottom: '15px'
              }}
            >
              * denotes required field
            </CardSubtitle>
          </Card>
        </Col>
      </Container>
    );
  }
}

ProfessorCreateRoom.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }),
  location: PropTypes.object.isRequired
};

export default ProfessorCreateRoom;
