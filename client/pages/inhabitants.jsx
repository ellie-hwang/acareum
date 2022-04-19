import React from 'react';
import InhabitantList from '../components/inhabitantlist';

export default function Inhabitants(props) {
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-xs-12 col-md-6 mt-3 mb-3 d-flex justify-content-between align-items-center">
            <h1 className="inhabitants-h1">Inhabitants</h1>
            <a href={`#inhabitant-setup?tankId=${props.tankId}`}><i className="fas fa-plus" /></a>
          </div>
        </div>
        <InhabitantList tankId={props.tankId} />
      </div>
    </>
  );
}
