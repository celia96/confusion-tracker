/* eslint-disable react/prefer-stateless-function, react/no-unused-state*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import { Bar, Line } from 'react-chartjs-2';
import { Redirect } from 'react-router-dom';
import Menu from './Menu';
import Authn from '../Authn/Authn';

class ClassSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sendemail: false,
      comments: [],
      ratings: [],
      finalData: [],
      finalLabels: [],
      tagValues: [],
      tagKeys: [],
      owner: this.props.location.state ? this.props.location.state.owner : ''
    };
    this.goBack = this.goBack.bind(this);
  }

  componentDidMount() {
    fetch(`/api/comments/ratings/${this.props.match.params.roomName}`)
      .then(response => {
        if (!response.ok) throw new Error(response.status_text);
        return response.json();
      })
      .then(responseJson => {
        const ratingCountArray = Object.values(responseJson.ratings);
        this.setState({
          comments: responseJson.comments,
          ratings: ratingCountArray
        });
        return fetch(`/api/professor/get/${this.props.match.params.roomName}`);
      })
      .then(roomResponse => {
        if (!roomResponse.ok) throw new Error(roomResponse.status_text);
        return roomResponse.json();
      })
      .then(roomResponseJson => {
        const tagLabelArray = Object.keys(roomResponseJson.room.tags);
        const tagDataArray = Object.values(roomResponseJson.room.tags);
        this.setState({
          tagKeys: tagLabelArray,
          tagValues: tagDataArray,
          finalLabels: roomResponseJson.room.labels,
          finalData: roomResponseJson.room.data
        });
      })

      .catch(err => console.log(err));
  }

  goBack() {
    this.props.history.push('/professor/menu');
  }

  render() {
    // alert that the user does not have access and redirect to main page
    const profile = Authn.getProfile();
    if (!profile) {
      alert('You are not logged in');
      return <Redirect to={{ pathname: '/login/professor' }} />;
    }
    const ratingData = {
      labels: [
        // tag names /or ratings go here
        '1',
        '2',
        '3',
        '4',
        '5'
      ],
      datasets: [
        {
          label: 'Student Count',
          data: this.state.ratings,
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(255, 99, 132, 0.6)'
          ]
        }
      ]
    };
    const tagsData = {
      labels: this.state.tagKeys,
      datasets: [
        {
          label: 'Student Count',
          data: this.state.tagValues,
          backgroundColor: 'rgba(54, 162, 235, 0.6)'
        }
      ]
    };
    const chartData = {
      labels: this.state.finalLabels,
      datasets: [
        {
          data: this.state.finalData,
          borderColor: '#3e95cd',
          backgroundColor: ['rgba(117, 184, 255, 0.2)']
        }
      ]
    };
    return (
      // bar chart data
      <div className="chart">
        <Menu history={this.props.history} handleHomeButton={this.goBack} />
        <div style={{ margin: '40px' }}>
          <Line
            width={800}
            height={300}
            data={chartData}
            options={{
              title: {
                display: 'Confusion Graph',
                text: 'Confusion Graph',
                fontSize: 30
              },
              bezierCurve: false,
              tooltips: {
                custom: function(tooltip) {
                  if (!tooltip) return;
                  // disable displaying the color box;
                  tooltip.displayColors = false;
                },
                callbacks: {
                  title: function(tooltipItem, data) {
                    console.log(tooltipItem, data);
                    return '';
                  },
                  label: function(tooltipItem, data) {
                    //var datasetLabel = '';
                    //var label = data.labels[tooltipItem.index]; a
                    return `Number of Confused Students: ${
                      data.datasets[tooltipItem.datasetIndex].data[
                        tooltipItem.index
                      ]
                    }`;
                  }
                }
              },
              legend: {
                display: false
              },
              scales: {
                xAxes: [
                  {
                    type: 'time',
                    time: {
                      unit: 'minute'
                    },
                    distibution: 'linear'
                  }
                ],
                yAxes: [
                  {
                    ticks: {
                      beginAtZero: true,
                      min: 0,
                      stepSize: 1
                    }
                  }
                ]
              }
            }}
          />
        </div>
        <div style={{ margin: '40px' }}>
          <Bar
            data={tagsData}
            options={{
              title: {
                display: true,
                text: 'Tag Count',
                fontSize: 30
              },
              legend: {
                position: 'bottom'
              },
              scales: {
                yAxes: [
                  {
                    ticks: {
                      beginAtZero: true,
                      callback: function(value) {
                        if (value % 1 === 0) {
                          return value;
                        }
                      }
                    }
                  }
                ]
              }
            }}
          />
        </div>
        <div style={{ margin: '40px' }}>
          <Bar
            data={ratingData}
            options={{
              title: {
                display: 'Student Ratings',
                text: 'Student Ratings',
                fontSize: 30
              },
              legend: {
                position: 'bottom'
              },
              scales: {
                yAxes: [
                  {
                    ticks: {
                      beginAtZero: true,
                      callback: function(value) {
                        if (value % 1 === 0) {
                          return value;
                        }
                      }
                    }
                  }
                ]
              }
            }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div style={{ margin: '20px' }} />
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>COMMENTS</Table.HeaderCell>
                <Table.HeaderCell />
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.state.comments.map((comment, index) => (
                <Table.Row key={comment}>
                  <Table.Cell
                    collapsing
                    verticalAlign="middle"
                    textAlign="center"
                  >
                    {index + 1}
                  </Table.Cell>
                  <Table.Cell verticalAlign="middle" textAlign="left">
                    {comment}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          <div style={{ margin: '20px' }} />
        </div>
      </div>
    );
  }
}

ClassSummary.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      roomName: PropTypes.string.isRequired
    })
  }),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }),
  location: PropTypes.shape({
    state: PropTypes.shape({
      owner: PropTypes.string
    })
  })
};

export default ClassSummary;
