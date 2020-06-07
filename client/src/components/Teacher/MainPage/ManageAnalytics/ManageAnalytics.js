import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Chart from 'react-apexcharts';
import moment from 'moment';
import { IoMdAnalytics } from 'react-icons/io';
import { RiDeleteBin6Line } from 'react-icons/ri';
// import { GoGraph } from 'react-icons/go';
import { BsGraphUp } from 'react-icons/bs';

import Header from '../Header';
import DeleteClass from './DeleteClass';

import data from '../../../../data/data.json';

const styles = {
  subHeaderContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '50px',
    marginLeft: '70px',
    marginRight: '70px',
    marginBottom: '50px'
  },
  contentContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  chartContainer: {
    display: 'flex'
  },
  title: {
    display: 'flex',
    alignItems: 'center'
  },
  titleText: {
    fontSize: '30px',
    fontWeight: '600'
  },
  smallTitleText: {
    fontSize: '25px',
    fontWeight: '600'
  },
  button: {
    backgroundColor: '#F5b700',
    borderColor: '#F5b700',
    borderRadius: '50px',
    fontWeight: '600',
    color: '#614908',
    padding: '15px',
    display: 'flex',
    alignItems: 'center'
  },
  navContainer: {
    margin: '50px',
    marginTop: '30px'
  }
};

const ConfusionChart = ({ students, chartData }) => {
  const options = {
    chart: {
      height: 700,
      width: '100%',
      type: 'line',
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
      }
    },
    yaxis: {
      min: 0,
      max: students.length,
      tickAmount: students.length < 10 ? null : 10,
      forceNiceScale: students.length < 10 ? true : false,
      labels: {
        formatter: function(val) {
          return val.toFixed(0);
        }
      }
    }
  };
  const series = [
    {
      name: 'confusion',
      data: chartData
    }
  ];
  return (
    <div id="chart" style={styles.chartContainer}>
      <div style={{ flex: 1 }} />
      <div style={{ flex: 3 }}>
        <div style={(styles.title, { marginLeft: '25px' })}>
          <BsGraphUp size="30" />
          <span style={{ margin: '5px' }} />
          <span style={styles.smallTitleText}>Confusion Graph</span>
        </div>
        <Chart
          options={options}
          series={series}
          type="line"
          width="1000"
          height="500"
        />
      </div>
      <div style={{ flex: 1 }} />
    </div>
  );
};

class ManageAnalytics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courseName: '',
      timestamp: '',
      chartData: [],
      students: [],
      openDeleteClass: false
    };
    this.toggleDeleteClassModal = this.toggleDeleteClassModal.bind(this);
  }

  componentDidMount() {
    // fetch
    const { dateCreated, courseName, chartData, students } = data;
    const timestamp = moment(dateCreated).format('YYYY/MM/DD');
    console.log('props ', this.props);
    this.setState({
      courseName,
      timestamp,
      chartData,
      students
    });
  }

  toggleDeleteClassModal() {
    const { openDeleteClass } = this.state;
    this.setState({
      openDeleteClass: !openDeleteClass
    });
  }

  render() {
    const {
      timestamp,
      courseName,
      students,
      chartData,
      openDeleteClass
    } = this.state;
    const { teacherInfo } = this.props;

    return (
      <div className="custom-container">
        <Header teacherInfo={teacherInfo} />
        <div style={styles.subHeaderContainer}>
          <div style={styles.title}>
            <IoMdAnalytics size="40" />
            <span style={{ margin: '5px' }} />
            <span style={styles.titleText}>
              {courseName} : {timestamp}
            </span>
          </div>
          <div className="pointer" onClick={this.toggleDeleteClassModal}>
            <RiDeleteBin6Line size="40" />
          </div>
        </div>
        <div style={styles.contentContainer}>
          <ConfusionChart students={students} chartData={chartData} />
        </div>
        <DeleteClass
          isOpen={openDeleteClass}
          toggle={this.toggleDeleteClassModal}
          courseName={courseName}
          timestamp={timestamp}
        />
      </div>
    );
  }
}

ManageAnalytics.propTypes = {
  teacherInfo: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    teacherInfo: state && state.teacher
  };
};

const mapDispatchToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageAnalytics);
