import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Chart from 'react-apexcharts';
import moment from 'moment';

// import { store } from '../../../redux/store';
import { updateClass } from '../../../redux/actions';

class ConfusionGraph extends Component {
  constructor(props) {
    super(props);

    this.state = {
      confusionRate: 0,
      attendees: [],
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
          }
        },
        stroke: {
          curve: 'smooth'
        },
        markers: {
          size: 0
        },
        title: {
          text: 'Dynamic Updating Chart',
          align: 'left'
        },
        xaxis: {
          type: 'numeric',
          labels: {
            formatter: function(time) {
              return moment(time).format('h:mmA');
            }
          }
        },
        yaxis: {
          min: 0,
          max: this.props.students.length,
          tickAmount: 10,
          forceNiceScale: this.props.students.length < 10 ? true : false,
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
          data: (this.props.chartData && this.props.chartData) || []
        }
      ]
    };
    this.fetchConfusion = this.fetchConfusion.bind(this);
  }

  componentDidMount() {
    // console.log('store ', store.getState());
    this.fetchConfusion();
    this.interval = setInterval(() => {
      this.fetchConfusion();
    }, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
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
        const { confusionRate, attendees } = classRoom;

        const chartData = series.slice()[0].data.slice();
        const data = [new Date().getTime(), confusionRate];
        chartData.push(data);

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
          attendees: Object.keys(attendees),
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
    const { options, series } = this.state;
    return (
      <div id="chart" style={styles.container}>
        <Chart options={options} series={series} type="line" width="1000" />
      </div>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
};

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
    chartData: state && state.classRoom && state.classRoom.chartData
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
