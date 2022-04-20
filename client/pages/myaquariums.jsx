import React from 'react';
import TankList from '../components/tanklist';

export default function MyAquariums(props) {
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 col-sm-6 col-md-6 mt-3 mb-3 d-flex justify-content-between align-items-center">
            <h1 className="myaquariums-h1">My Aquariums</h1>
            <a href={'#aquarium-setup'}><i className="fas fa-plus" /></a>
          </div>
        </div>
        <TankList />
      </div>
    </>
  );
}
