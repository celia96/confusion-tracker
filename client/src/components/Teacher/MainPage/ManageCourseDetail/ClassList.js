import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FaChalkboardTeacher } from 'react-icons/fa';
import { BsPeopleFill } from 'react-icons/bs';
import { Table, Button, Badge } from 'reactstrap';
import moment from 'moment';

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '30px'
  },
  subContainer: {
    // width: '80%'
    flex: 1
  },
  subHeaderContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginLeft: '10px',
    marginRight: '10px',
    marginBottom: '10px'
  },
  titleText: {
    fontSize: '25px',
    fontWeight: '600'
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  tableContainer: {
    textAlign: 'center'
  },
  button: {
    backgroundColor: '#F5b700',
    borderColor: '#F5b700',
    fontWeight: '600',
    color: '#614908'
  },
  aligned: {
    verticalAlign: 'middle'
  },
  largeBadge: {
    fontSize: 'medium',
    backgroundColor: '#6495ed'
  },
  badge: {
    fontSize: 'xx-small',
    backgroundColor: '#6495ed'
  }
};

const ClassList = ({ classes }) => {
  return (
    <div style={styles.container}>
      <div style={styles.subContainer}>
        <div style={styles.subHeaderContainer}>
          <div style={styles.iconContainer}>
            <span style={styles.titleText}>Classes</span>
            <span style={{ margin: '5px' }} />
            <FaChalkboardTeacher size="30" />
            <span style={{ margin: '1px' }} />
            <Badge style={styles.largeBadge}>{classes.length}</Badge>
          </div>
        </div>
        <Table hover style={styles.tableContainer}>
          <thead style={{ backgroundColor: '#f5f5f5', textAlign: 'center' }}>
            <tr>
              <th style={{ width: '5%' }}>#</th>
              <th style={{ width: '25%' }}>Date Created</th>
              <th style={{ width: '50% ' }} />
              <th style={{ textAlign: 'center' }}>Attendees</th>
              <th style={{ textAlign: 'center' }}>Analyitcs</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((item, index) => (
              <tr
                style={{ textAlign: 'center' }}
                key={item.courseName + item._id}
              >
                <th scope="row" style={styles.aligned}>
                  {index + 1}
                </th>
                <td style={styles.aligned}>
                  {moment(item.dateCreated).format('LL')}
                </td>
                <td />
                <td style={{ textAlign: 'center', ...styles.aligned }}>
                  <BsPeopleFill size="20" />
                  <Badge style={styles.badge}>
                    {Object.keys(item.attendees).length}
                  </Badge>
                </td>
                <td style={{ textAlign: 'center', ...styles.aligned }}>
                  <Link
                    to={{
                      pathname: `/courses/${item.courseName}/analytics`,
                      search: `?date=${new Date(
                        item.dateCreated
                      ).toISOString()}`,
                      state: {
                        classId: item._id
                      }
                    }}
                    className="router-link"
                  >
                    <Button style={styles.button}>View</Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

ClassList.propTypes = {
  classes: PropTypes.array.isRequired
};

export default ClassList;
