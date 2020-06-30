import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Chart from 'react-apexcharts';
import { Button } from 'reactstrap';
import moment from 'moment';

import { updateClass } from '../../../redux/actions';

const styles = {
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '20px'
  },
  chartContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  infoContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  resumeButton: {
    backgroundColor: '#6495ed',
    borderColor: '#6495ed',
    fontWeight: '600'
  },
  pauseButton: {
    backgroundColor: '#F5b700',
    borderColor: '#F5b700',
    fontWeight: '600',
    color: '#614908'
  },
  confusionFont: {
    fontWeight: 700
  }
};

class ConfusionGraph extends Component {
  constructor(props) {
    super(props);

    this.state = {
      paused: false,
      confusionRate: 0,
      options: {
        chart: {
          id: 'realtime',
          height: 700,
          width: '100%',
          type: 'line',
          animations: {
            enabled: true,
            easing: 'linear',
            dynamicAnimation: {
              speed: 1000
            }
          },
          toolbar: {
            show: false
          }
        },
        stroke: {
          curve: 'smooth'
        },
        markers: {
          size: 0
        },
        xaxis: {
          type: 'numeric',
          labels: {
            formatter: function(time) {
              return moment(time).format('h:mmA');
            }
          },
          tickAmount: 10,
          range: 60000 // currently set to 1 minute
        },
        yaxis: {
          min: 0,
          max: this.props.students.length,
          tickAmount:
            this.props.students.length < 10 ? this.props.students.length : 10,
          // forceNiceScale: this.props.students.length < 10 ? true : false,
          labels: {
            formatter: function(val) {
              return val.toFixed(0);
            }
          }
        }
      },
      series: [
        {
          name: 'confusion',
          data: []
        }
      ]
    };
    this.fetchConfusion = this.fetchConfusion.bind(this);
    this.pauseClass = this.pauseClass.bind(this);
    this.resumeClass = this.resumeClass.bind(this);
  }

  componentDidMount() {
    // const { dateCreated, paused } = this.props;
    this.fetchConfusion();
    this.interval = setInterval(() => {
      this.fetchConfusion();
    }, 3000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  pauseClass() {
    console.log('pause a class');
    this.setState({
      paused: true
    });
    clearInterval(this.interval);
  }

  resumeClass() {
    console.log('resume a class');
    this.setState({
      paused: false
    });
    this.interval = setInterval(() => {
      this.fetchConfusion();
    }, 3000);
  }

  fetchConfusion() {
    const { options, series } = this.state;
    const { classId, updateClassInfo } = this.props;
    fetch(`/api/class/${classId}`)
      .then(response => {
        if (!response.ok) throw new Error(response.status_text);
        return response.json();
      })
      .then(classRoom => {
        const { confusionRate, attendees } = classRoom; //
        console.log('fetch ', confusionRate);
        const chartData = series.slice()[0].data.slice();
        const data = [new Date().getTime(), confusionRate];
        chartData.push(data);
        console.log('chart ', chartData);

        this.setState({
          options: {
            ...options,
            yaxis: {
              ...options.yaxis,
              max: Object.keys(attendees).length
            }
          },
          series: [
            {
              ...series[0],
              data: chartData
            }
          ],
          confusionRate
        });

        updateClassInfo({
          chartData,
          confusionRate,
          students: Object.keys(attendees)
        });
      })
      .catch(err => console.log(err));
  }

  render() {
    const { paused, confusionRate, options, series } = this.state;
    return (
      <div style={styles.container}>
        <div style={styles.infoContainer}>
          <div style={styles.confusionFont}>Confusion: {confusionRate}</div>
          <span style={{ margin: '10px' }} />
          {paused ? (
            <Button style={styles.resumeButton} onClick={this.resumeClass}>
              Resume
            </Button>
          ) : (
            <Button style={styles.pauseButton} onClick={this.pauseClass}>
              Pause
            </Button>
          )}
        </div>
        <div id="chart" style={styles.chartContainer}>
          <Chart options={options} series={series} type="line" width="1000" />
        </div>
      </div>
    );
  }
}

ConfusionGraph.propTypes = {
  classId: PropTypes.string.isRequired,
  students: PropTypes.array.isRequired,
  chartData: PropTypes.array.isRequired,
  updateClassInfo: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    classId: state && state.classRoom && state.classRoom.classId,
    students: state && state.classRoom && state.classRoom.students,
    dateCreated: state && state.classRoom && state.classRoom.dateCreated,
    chartData: state && state.classRoom && state.classRoom.chartData
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateClassInfo: confusion => dispatch(updateClass(confusion))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfusionGraph);
