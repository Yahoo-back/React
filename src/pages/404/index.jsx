import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class NoFound extends Component {
  render() {
    return (
      <div style={{ textAlign: 'center' }}>
        <Link to="/">
          <img
            style={{ width: 400, marginTop: '50px' }}
            src={require('../../assets/images/404.png')}
            alt=""
          />
        </Link>
      </div>
    );
  }
}
export default NoFound;
