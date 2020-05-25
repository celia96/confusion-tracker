/* eslint-disable react/prefer-stateless-function, react/no-unused-state*/
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Form, FormGroup, ButtonGroup } from 'reactstrap';
import { Dropdown, Message } from 'semantic-ui-react';
import logo from '../../logo.png';

class StudentButton extends Component {
  constructor(props) {
    super(props);
    // Initialize the App state
    this.state = {
      mode: 'view',
      confused: false,
      tags: [],
      chartData: {},
      tagValue: '',
      individualTags: [],
      showMessage: false,
      positiveMessage: false
    };
    this.changeConfusion = this.changeConfusion.bind(this);
    this.submitTag = this.submitTag.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidMount() {
    fetch(
      `/api/confusions/${this.props.match.params.roomName}/${
        this.props.match.params.nickname
      }`
    )
      .then(response => {
        if (!response.ok) throw new Error(response.status_text);
        return response.json();
      })
      .then(responseJson => {
        this.setState({ confused: responseJson.confused });
      })
      .catch(err => console.log(err));

    this.interval = setInterval(() => {
      const urls = [
        `/api/end/class/${this.props.match.params.roomName}`, // check here (match not being passed in?)
        `/api/tags/${this.props.match.params.roomName}`
        // implicit props from router, one level deeper no longer has them?
        //where are props coming from originally?
      ];
      Promise.all(
        urls.map(url =>
          fetch(url)
            .then(response => {
              if (!response.ok) throw new Error(response.status_text);
              return response.json();
            })
            .catch(err => console.log(err))
        )
      ).then(results => {
        if (results[0].isOver) {
          this.props.history.push(
            `/student/comments/${this.props.match.params.roomName}`
          );
        }
        const tags = Object.keys(results[1].tags).map(tag => {
          const obj = {
            text: tag,
            value: tag,
            active: false,
            selected: false
          };
          return obj;
        });
        this.setState({
          tags
        });
      });
    }, 3000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  changeConfusion() {
    const { nickname, roomName } = this.props.match.params;
    fetch('/api/confusions', {
      method: 'PUT',
      body: JSON.stringify({
        confused: !this.state.confused,
        nickname,
        roomName
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
          this.setState({ confused: !this.state.confused });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleSearch(e) {
    this.setState({
      tagValue: e.target.value
    });
  }

  submitTag(value) {
    this.setState({ showMessage: true });
    if (this.state.individualTags.includes(value)) {
      this.setState({ positiveMessage: false });
      //alert("You can't submit the same tag twice!");
    } else {
      this.setState({ positiveMessage: true });
      const joined = this.state.individualTags.slice().concat(value);

      this.setState({ individualTags: joined });
      fetch('/api/tags', {
        method: 'POST',
        body: JSON.stringify({
          roomName: this.props.match.params.roomName,
          tag: value
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
            console.log('successful');
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
    setTimeout(() => {
      this.setState({ showMessage: false });
    }, 3000);
  }

  handleChange(e, { value }) {
    this.setState({ tagValue: value });
  }

  render() {
    const student = JSON.parse(sessionStorage.getItem('student'));
    const { roomName } = this.props.match.params;
    if (!student) {
      return (
        <Redirect
          to={{
            pathname: `/login/student/nickname/${roomName}`,
            state: { from: this.props.location }
          }}
        />
      );
    }
    return (
      <div>
        <img
          src={logo}
          style={{ maxWidth: '300px', margin: '10px' }}
          alt="logo"
        />

        <Form>
          <FormGroup>
            <Button
              disabled={this.state.confused}
              onClick={this.changeConfusion}
            >
              Confused
            </Button>{' '}
            <Button
              disabled={!this.state.confused}
              onClick={this.changeConfusion}
            >
              Not Confused
            </Button>{' '}
          </FormGroup>
        </Form>
        <ButtonGroup>
          <Dropdown
            placeholder="Enter or Select a Tag"
            search
            selection
            noResultsMessage={null}
            disabled={!this.state.confused}
            options={this.state.tags}
            onSearchChange={this.handleSearch}
            value={this.state.tagValue}
            onChange={this.handleChange}
          />
          <Button onClick={() => this.submitTag(this.state.tagValue)}>
            Submit
          </Button>
        </ButtonGroup>
        {this.state.showMessage ? (
          <div style={{ margin: '40px' }}>
            <Message
              hidden={this.state.positiveMessage}
              negative
              header="Submission Failed"
              content="The tag you have chosen has already been submitted."
            />
            <Message
              hidden={!this.state.positiveMessage}
              success
              header="Tag submitted successfully"
              content="The tag you have chosen has been submitted."
            />
          </div>
        ) : null}
      </div>
    );
  }
}

StudentButton.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      roomName: PropTypes.string.isRequired,
      nickname: PropTypes.string.isRequired
    })
  }),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }),
  location: PropTypes.object.isRequired
};

export default StudentButton;
