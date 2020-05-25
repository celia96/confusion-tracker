import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Button, Divider, Header, Table } from 'semantic-ui-react';
import Menu from './Menu';
import Authn from '../../Authn/Authn';
import { Link, Redirect } from 'react-router-dom';

class ProfessorMainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: []
    };
    this.handleStart = this.handleStart.bind(this);
    this.reload = this.reload.bind(this);
  }

  handleStart() {
    this.props.history.push('/professor/create/room');
  }

  reload() {
    window.location.reload();
  }

  componentDidMount() {
    //change professor email
    const profile = Authn.getProfile();
    fetch(`/api/classes/${profile.email}`)
      .then(response => {
        if (!response.ok) throw new Error(response.status_text);
        return response.json();
      })
      .then(responseJson => {
        const { classes } = responseJson;
        this.setState({ classes });
      })
      .catch(err => console.log(err));
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
    const startButton = (
      <Button
        onClick={() => this.handleStart()}
        style={{
          backgroundColor: '#F5b700',
          borderColor: '#F5b700',
          marginRight: '40px',
          borderRadius: '20px'
        }}
      >
        <Icon name="plus" />
        Start New Class
      </Button>
    );

    return (
      <div>
        <Menu history={this.props.history} handleHomeButton={this.reload} />
        <Divider hidden />
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginLeft: '50px',
            marginRight: '50px'
          }}
        >
          <Header style={{ marginLeft: '40px' }} textAlign="left" as="h2">
            <Icon name="archive" />
            <Header.Content>
              Classes
              <Header.Subheader>
                Select class to view class report
              </Header.Subheader>
            </Header.Content>
          </Header>
          {startButton}
        </div>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div style={{ margin: '40px' }} />
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>
                  CLASS
                  <Icon name="arrow down" />
                </Table.HeaderCell>
                <Table.HeaderCell />
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.state.classes.map(singleClass => (
                <Table.Row key={singleClass.roomName}>
                  <Table.Cell verticalAlign="middle">
                    {singleClass.roomName}
                  </Table.Cell>
                  <Table.Cell verticalAlign="middle" textAlign="right">
                    <Link
                      style={{ textDecoration: 'none' }}
                      to={{
                        pathname: `/professor/summary/${singleClass.roomName}`,
                        state: { owner: singleClass.owner }
                      }}
                    >
                      <Button>View</Button>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          <div style={{ margin: '40px' }} />
        </div>
      </div>
    );
  }
}

ProfessorMainPage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }),
  location: PropTypes.shape({
    state: PropTypes.shape({
      owner: PropTypes.string
    })
  })
};

export default ProfessorMainPage;
