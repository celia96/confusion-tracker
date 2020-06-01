import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { IoMdAnalytics } from 'react-icons/io';
import { RiDeleteBin6Line } from 'react-icons/ri';
import moment from 'moment';

import Header from '../Header';

import data from '../../../../data/data.json';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    maxHeight: '100vh'
  },
  subContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '50px',
    marginLeft: '70px',
    marginRight: '70px'
  },
  title: {
    display: 'flex',
    alignItems: 'center'
  },
  titleText: {
    fontSize: '30px',
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
  },
  pointer: {
    cursor: 'pointer'
  }
};

class ManageAnalytics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courseName: '',
      timestamp: ''
    };
  }

  componentDidMount() {
    // fetch
    const { dateCreated, courseName } = data;
    const timestamp = moment(dateCreated).format('YYYY/MM/DD');

    this.setState({
      courseName,
      timestamp
    });
  }

  render() {
    const { timestamp, courseName } = this.state;
    const { teacherInfo } = this.props;

    return (
      <div style={styles.container}>
        <Header teacherInfo={teacherInfo} />
        <div style={styles.subContainer}>
          <div style={styles.title}>
            <IoMdAnalytics size="40" />
            <span style={{ margin: '5px' }} />
            <span style={styles.titleText}>
              {courseName} : {timestamp}
            </span>
          </div>
          <div style={styles.pointer}>
            <RiDeleteBin6Line size="40" />
          </div>
        </div>
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
