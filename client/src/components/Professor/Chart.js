import React, { Component } from 'react';
import { Button, Container } from 'reactstrap';
import { Line } from 'react-chartjs-2';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import logo from '../../logo.png';
import { Redirect } from 'react-router-dom';
import Authn from '../Authn/Authn';

const ButtonBar = styled.div`
  margin: 20px;
`;

class Chart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      labels: [],
      data: [],
      tags: [],
      completeView: true,
      studentsPresent: 1,
      duration: 3,
      alert: 50
    };
    this.changeView = this.changeView.bind(this);
  }
  changeView() {
    this.setState({ completeView: !this.state.completeView });
  }
  componentDidMount() {
    fetch(`/api/professor/get/${this.props.match.params.roomName}`)
      .then(response => {
        if (!response.ok) throw new Error(response.status_text);
        return response.json();
      })
      .then(responseJson => {
        const roominfo = responseJson.room;
        const { tags, duration, alert } = roominfo;
        const sorted = Object.keys(tags).sort((a, b) => tags[b] - tags[a]);
        // take out the top 10
        const topTags = sorted.slice(0, 10);
        this.setState({
          labels: JSON.parse(localStorage.getItem('chart')).labels,
          data: JSON.parse(localStorage.getItem('chart')).data,
          duration,
          alert,
          tags: topTags
        });
      })
      .catch(err => console.log(err));

    this.interval = setInterval(() => {
      const urls = [
        `/api/confusions/${this.props.match.params.roomName}`, // check here (match not being passed in?)
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
        // Confusion Level
        const studentMap = results[0].students;
        let overallConfusion = 0;
        const confusionArray = Object.values(studentMap);
        confusionArray.forEach(oneStudentConfusion => {
          if (oneStudentConfusion === true) {
            overallConfusion += 1;
          }
          // if confusion > 0, we can subtract
          // otherwise no one is confused.
          if (oneStudentConfusion > 0) {
            if (oneStudentConfusion === false) {
              overallConfusion -= 1;
            }
          }
        });
        const currTime = new Date();
        const data = this.state.data.slice();
        data.push(overallConfusion);
        const labels = this.state.labels.slice();
        labels.push(currTime);
        const chart = {
          data,
          labels
        };
        localStorage.setItem('chart', JSON.stringify(chart));
        // Top 10 Tags
        // sort by descending order
        const { tags } = results[1];
        const sorted = Object.keys(tags).sort((a, b) => tags[b] - tags[a]);
        // take out the top 10
        const topTags = sorted.slice(0, 10);
        this.setState({
          data: data,
          labels: labels,
          tags: topTags,
          studentsPresent: confusionArray.length ? confusionArray.length : 1
        });
      });
    }, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  endClass() {
    const profile = Authn.getProfile();
    fetch('/api/end/class', {
      method: 'POST',
      body: JSON.stringify({
        roomName: this.props.match.params.roomName,
        data: this.state.data,
        labels: this.state.labels,
        email: profile.email
      }),
      headers: new Headers({ 'Content-type': 'application/json' })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(response.status_text);
        }
        return response.json();
      })
      .then(responseJson => {
        if (responseJson.success) {
          alert('Class is over!');
          this.props.history.push(
            `/professor/summary/${this.props.match.params.roomName}`
          );
        }
      })
      .catch(err => {
        console.log(err);
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
    const currTime = new Date();
    const endOfClassTime = new Date(
      currTime.setMinutes(currTime.getMinutes() + this.state.duration)
    );
    const chartData = {
      labels: this.state.labels,
      datasets: [
        {
          data: this.state.data,
          borderColor: '#3e95cd',
          backgroundColor: ['rgba(117, 184, 255, 0.2)']
        }
      ]
    };
    const fullViewButton = (
      <Button
        onClick={() => this.changeView()}
        style={{ backgroundColor: '#75b8ff', borderColor: '#75b8ff' }}
        disabled={this.state.completeView}
      >
        Complete
      </Button>
    );
    const simplisticViewButton = (
      <Button
        onClick={() => this.changeView()}
        style={{ backgroundColor: '#75b8ff', borderColor: '#75b8ff' }}
        disabled={!this.state.completeView}
      >
        Simple
      </Button>
    );

    const complete = this.state.completeView;
    const confusionReached =
      Math.floor(
        (parseInt(this.state.data.slice(-1)) * 100) / this.state.studentsPresent
      ) >= this.state.alert;

    const percentage = `${Math.floor(
      (parseInt(this.state.data.slice(-1)) * 100) / this.state.studentsPresent
    ).toString()} %`;
    return (
      <div
        style={{
          backgroundColor: confusionReached ? '#FFB266' : '#FFFFFF',
          minHeight: '100vh'
        }}
      >
        <img src={logo} style={{ maxWidth: '200px' }} alt="logo" />

        <div>
          <div style={{ margin: '20px' }} />
          <ButtonBar>
            {' '}
            {fullViewButton} {simplisticViewButton}{' '}
          </ButtonBar>
        </div>

        {complete ? (
          <div>
            <div className="chart">
              <Line
                width={800}
                height={290}
                data={chartData}
                options={{
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
                          max: endOfClassTime,
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
                          max: this.state.studentsPresent,
                          stepSize: 1
                        }
                      }
                    ]
                  }
                }}
              />
            </div>
          </div>
        ) : (
          <Container style={{ minWidth: '600px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                height: '200px',
                textAlign: 'center',
                fontSize: '200px',
                marginTop: '50px',
                marginBottom: '100px',
                color: '#545251'
              }}
            >
              {this.state.studentsPresent ? percentage : '0 %'}
            </div>
          </Container>
        )}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: '10px'
          }}
        >
          <div style={{ marginLeft: '100px' }} />
          <div>
            {this.state.tags.map(tag => (
              <Button disabled style={{ margin: '5px' }} key={tag}>
                {tag}
              </Button>
            ))}
          </div>
          <div style={{ marginRight: '30px' }}>
            <Button
              onClick={() => this.endClass()}
              style={{
                margin: '5px',
                backgroundColor: '#75b8ff',
                borderColor: '#75b8ff'
              }}
            >
              End Class
            </Button>
          </div>
        </div>

        {/* <div style={{ margin: '10px', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <Button
            onClick={() => this.endClass()}
            style={{ backgroundColor: '#75b8ff', borderColor: '#75b8ff' }}
          >
            End Class
          </Button>
        </div> */}
      </div>
    );
  }
}

Chart.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      roomName: PropTypes.string.isRequired
    })
  }),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }),
  location: PropTypes.object.isRequired
};

export default Chart;
