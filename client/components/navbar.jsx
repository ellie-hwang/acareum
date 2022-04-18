import React from 'react';

export default class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: false
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    if (event.target.matches('#nav-bars')) {
      this.setState({
        display: true
      });
    } else if (event.target.matches('.sidebar-item') || event.target.matches('.black-bg') || event.target.matches('#sb-bars')) {
      this.setState({
        display: false
      });
    }
  }

  render() {
    const bgVisible = this.state.display ? 'bg-visible' : '';
    const sbVisible = this.state.display ? 'sb-visible' : '';
    return (
      <>
        <div id="black-bg" className={`black-bg ${bgVisible}`} onClick={this.handleClick} />

        <div className={`sidebar ${sbVisible}`} onClick={this.handleClick}>
          <div className="row m-0 p-0 border-b align-items-center flex-nowrap">
            <p className="col-8 sidebar-header m-0 px-4 py-3"><strong>aCareum</strong></p>
            <div className="col-4 text-end">
              <i id="sb-bars" className="fas fa-bars pt-3" />
            </div>
          </div>
          <div className="row m-0 p-0 border-b">
            <div className="col-12 px-4 py-3" >
              <i className="fas fa-th-large" />
              <a className="sidebar-item m-o px-4 py-3" href="#">My Aquariums</a>
            </div>
          </div>
        </div>
        <header>
          <div className="container-fluid">
            <nav className="navbar">
              <i id="nav-bars" className="fas fa-bars" onClick={this.handleClick} />
              <a className="navbar-brand" href='#'>aCareum</a>
              <span></span>
            </nav>
          </div>
        </header>
      </>
    );
  }
}
