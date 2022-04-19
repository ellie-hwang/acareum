import React from 'react';
// import Home from './pages/home';
import Navbar from './components/navbar';
import MyAquariums from './pages/myaquariums';
import AquariumSetup from './pages/aquariumsetup';
import Dashboard from './pages/dashboard';
import Inhabitants from './pages/inhabitants';
import InhabitantSetup from './pages/inhabitantsetup';
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
    if (route.path === 'aquarium-setup') {
      return <AquariumSetup />;
    }
    if (route.path === 'dashboard') {
      const tankId = route.params.get('tankId');
      return <Dashboard tankId={tankId} />;
    }
    if (route.path === 'inhabitants') {
      const tankId = route.params.get('tankId');
      return <Inhabitants tankId={tankId} />;
    }
    if (route.path === 'inhabitant-setup') {
      const tankId = route.params.get('tankId');
      return <InhabitantSetup tankId={tankId} />;
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
