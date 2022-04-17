import React from 'react';
// import Home from './pages/home';
import Navbar from './components/navbar';
import MyAquariums from './pages/myaquariums';
// import AquariumForm from './pages/aquarium-form';

export default class App extends React.Component {
  render() {
    return (
      <>
        <Navbar />
        <MyAquariums />
      </>
    );
  }
}
