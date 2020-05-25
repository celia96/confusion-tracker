import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { Button, Text } from 'reactstrap';
import { Line } from 'react-chartjs-2';

import { store } from '../../../redux/store';
import { updateClass } from '../../../redux/actions';

class ConfusionGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      labels:
        (this.props.confusionChart && this.props.confusionChart.labels) || [],
      data: (this.props.confusionChart && this.props.confusionChart.data) || [],
      tags: [],
      duration: 5,
      alert: 50,
      confusionRate: 0,
      attendees: []
    };
    this.fetchConfusion = this.fetchConfusion.bind(this);
  }

  componentDidMount() {
    // console.log('store ', store.getState());
    // this.fetchConfusion();
    // this.interval = setInterval(() => this.fetchConfusion(), 5000);
  }

  // componentWillUnmount() {
  //   clearInterval(this.interval);
  // }

  fetchConfusion() {
    const { data, labels } = this.state;
    const { classId, updateClassInfo } = this.props;
    fetch(`/api/class/${classId}`)
      .then(response => {
        if (!response.ok) throw new Error(response.status_text);
        return response.json();
      })
      .then(classRoom => {
        const { confusionRate, attendees } = classRoom;
        this.setState({
          confusionRate
        });
        const dataCopy = data.slice();
        dataCopy.push(confusionRate);

        const labelsCopy = labels.slice();
        labelsCopy.push(new Date());

        const chart = {
          data: dataCopy,
          labels: labelsCopy
        };

        console.log('confusion rate ', confusionRate);
        updateClassInfo({ chart, confusionRate });
        console.log('store ', store.getState());
        this.setState({
          data: dataCopy,
          labels: labelsCopy,
          attendees: Object.keys(attendees)
        });
      })
      .catch(err => console.log(err));
  }

  render() {
    const { data, labels, confusionRate } = this.state;
    const currTime = new Date();
    const endOfClassTime = new Date(
      currTime.setMinutes(currTime.getMinutes() + this.state.duration)
    );
    const chartData = {
      labels,
      datasets: [
        {
          data,
          borderColor: '#3e95cd',
          backgroundColor: ['rgba(117, 184, 255, 0.2)']
        }
      ]
    };

    return (
      <div style={styles.container}>
        <div>Confusion Rate: {confusionRate}</div>
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
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: '10px'
          }}
        />
      </div>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }
};

const mapStateToProps = state => {
  return {
    classId: state && state.classRoom && state.classRoom.classId,
    confusionChart: state && state.classRoom && state.classRoom.chart
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateClassInfo: confusion => dispatch(updateClass(confusion))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfusionGraph);
