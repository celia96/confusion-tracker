import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FaUserCircle } from 'react-icons/fa';
import { MdArrowDropDown } from 'react-icons/md';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';

import { logout } from '../../../redux/actions';

import logo from '../../../assets/image.png';

const styles = {
  container: {
    height: '58px',
    minHeight: '58px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#6495ed'
  },
  logo: {
    maxHeight: '45px',
    marginLeft: '20px'
  },
  name: {
    color: '#fff',
    fontSize: '20px',
    fontWeight: '600'
  },
  profile: {
    display: 'flex',
    alignItems: 'center',
    color: '#fff',
    fontSize: '20px',
    marginRight: '20px'
  }
};

const ProfileDropdown = ({ isOpen, toggle, signout }) => (
  <Dropdown isOpen={isOpen} toggle={toggle}>
    <DropdownToggle tag="span" data-toggle="dropdown" aria-expanded={isOpen}>
      <FaUserCircle size="1.5em" className="pointer" />
      <MdArrowDropDown size="2em" className="pointer" />
    </DropdownToggle>
    <DropdownMenu right>
      <DropdownItem header>Signed in as Celia Choy</DropdownItem>
      <DropdownItem divider />
      <Link to="/profile" className="router-link">
        <DropdownItem>Profile Setting</DropdownItem>
      </Link>
      <DropdownItem divider />
      <DropdownItem onClick={signout}>Sign out</DropdownItem>
    </DropdownMenu>
  </Dropdown>
);

const Header = ({ teacherInfo, clearStore }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [successLogout, redirect] = useState(false);
  const toggle = () => {
    console.log('toggling');
    setDropdownOpen(prevState => !prevState);
  };

  const signout = () => {
    fetch('/api/logout')
      .then(response => {
        if (!response.ok) throw new Error(response.status_text);
        redirect(true);
        clearStore();
      })
      .catch(err => console.log(err));
  };

  const { firstName, lastName } = teacherInfo;
  return (
    <div style={styles.container}>
      {successLogout ? <Redirect to="/login" /> : null}
      <Link to="/home" className="router-link">
        <img src={logo} style={styles.logo} alt="logo" />
      </Link>
      <span style={styles.name}>
        {firstName} {lastName}
      </span>
      <div style={styles.profile}>
        <ProfileDropdown
          isOpen={dropdownOpen}
          toggle={toggle}
          signout={signout}
        />
      </div>
    </div>
  );
};

Header.propTypes = {
  teacherInfo: PropTypes.object.isRequired,
  clearStore: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    teacherInfo: state && state.teacher
  };
};

const mapDispatchToProps = dispatch => {
  return {
    clearStore: () => dispatch(logout())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
