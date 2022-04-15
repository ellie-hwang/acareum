import React from 'react';

export default class Navbar extends React.Component {
  render() {
    return (
      <header>
        <div className="container-fluid">
          <nav className="navbar">
            <i className="fas fa-bars" />
            <a className="navbar-brand" href='#'>aCareum</a>
            <span></span>
          </nav>
        </div>
      </header>
    );
  }
}
