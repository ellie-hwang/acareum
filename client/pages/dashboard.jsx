import React from 'react';

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tank: '',
      conditions: ''
    };
  }

  componentDidMount() {
    fetch(`/api/aquariums/${this.props.tankId}`)
      .then(res => res.json())
      .then(tank => this.setState({ tank }))
      .catch(error => {
        console.error('Error:', error);
      });

    fetch(`/api/conditions/${this.props.tankId}`)
      .then(res => res.json())
      .then(conditions => this.setState({ conditions }))
      .catch(error => {
        console.error('Error:', error);
      });
  }

  render() {
    if (!this.state.tank) return null;
    const { tankName } = this.state.tank;
    return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col col-sm-6 col-md-6 mt-3 mb-3 d-flex justify-content-between align-items-center">
            <h1>{tankName}</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-sm-6 col-md-6 mb-3">
            <TankImg tank={this.state.tank} />
          </div>
          <div className="col-6 col-sm-3 col-md-3 mb-3 order-1 order-sm-2 order-md-2">
            <Population tank={this.state.tank} />
          </div>
          {/* <div className="col-6 col-sm-3 col-md-3">
            DATA TAB PLACEHOLDER
          </div> */}
          <div className="col-12 col-sm-6 col-md-6 mb-3 order-2 order-sm-1 order-md-1">
            <Conditions conditions={this.state.conditions[0]} />
          </div>
        </div>
      </div>
    </>
    );
  }
}

function TankImg(props) {
  const { imageId, imageUrl, tankId } =
    props.tank;
  return (
    <div className="tank-img-tab">
      <img src={imageUrl} alt="picture of user's tank" data-image-id={imageId} data-tank-id={tankId} className="db-tank-img" />
    </div>
  );
}

function Population(props) {
  const { population, tankId } = props.tank;
  return (
      <div className="population-tab">
      <div className="population-details d-flex align-items-center justify-content-center text-center">
        <div>
          <h5 className="population-details-h5 m-0">Population</h5>
          <h1 className="population-h1">{population}</h1>
          <div className="text-end population-icon-container">
            <a href={`#inhabitants?tankId=${tankId}`}><i className="fas fa-plus" /></a>
          </div>
        </div>
        </div>
      </div>
  );
}

function Conditions(props) {
  let pH, temperature, ammonia, nitrite, nitrate;
  if (!props.conditions) {
    pH = temperature = ammonia = nitrite = nitrate = 'N/A';
  } else {
    pH = props.conditions.pH;
    ammonia = `${props.conditions.ammonia} ppm`;
    nitrite = `${props.conditions.nitrite} ppm`;
    temperature = `${props.conditions.temperature}\u00B0F`;
    nitrate = `${props.conditions.nitrate} ppm`;
  }
  return (
    <div className="conditions-tab">
      <div className="row d-flex justify-content-center align-items-center">
        <div className="col-4 col-sm-4 col-md-4 conditions-details me-0">
          <h5 className="text-end">Conditions</h5>
          <h1 className="conditions-h1 text-end mb-1">H<sub>2</sub>O</h1>
          <div className="text-end conditions-icon-container">
            <a href={'#conditions-setup'}><i className="fas fa-plus" /></a>
          </div>
        </div>
        <div className="col-3 col-sm-3 col-md-3 conditions-details mx-0 pe-0 text-end">
          <p><strong>Temp:</strong></p>
          <p><strong>pH:</strong></p>
          <p><strong>Ammonia:</strong></p>
          <p><strong>Nitrite:</strong></p>
          <p><strong>Nitrate:</strong></p>
        </div>
        <div className="col-4 col-sm-4 col-md-4 conditions-details mx-0 text-start">
          <p>{temperature}</p>
          <p>{pH}</p>
          <p>{ammonia}</p>
          <p>{nitrite}</p>
          <p>{nitrate}</p>
        </div>
      </div>
    </div>
  );
}
