import React from 'react';
// import Home from './pages/home';
import Navbar from './components/navbar';
import MyAquariums from './pages/myaquariums';
import AquariumSetup from './pages/aquariumsetup';
import { parseRoute } from './lib';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: parseRoute(window.location.hash)
    };
  }

  componentDidMount() {
    onhashchange = event => {
      this.setState({
        route: parseRoute(window.location.hash)
      });
    };
  }

  renderPage() {
    const { route } = this.state;
    if (route.path === '') {
      return <MyAquariums />;
    }
    if (route.path === 'aquariumsetup') {
      return <AquariumSetup />;
    }
    return <MyAquariums />;
  }

  render() {
    return (
      <>
        <Navbar />
        { this.renderPage() }
      </>
    );
  }
}
