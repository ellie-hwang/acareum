import React from 'react';

export default class TankList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tanks: [],
      tankId: '',
      detailsOpen: false
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    fetch('/api/aquariums')
      .then(res => res.json())
      .then(tanks => this.setState({ tanks }))
      .catch(error => {
        console.error('Error:', error);
      });
  }

  handleClick(event) {
    // console.log(this.state.tanks);
  }

  render() {
    // const details = this.state.detailsOpen ? '' : 'display-none';
    return (
      <div className="row">
        {
          this.state.tanks.map(tank => (
            <div key={tank.tankId} className="mb-3 col-xs-12 col-md-6 tank-img-container" onClick={this.handleClick}>
              <Tank tank={tank} />
              <Details tank={tank} />
            </div>
          ))
        }
      </div>
    );
  }
}

function Tank(props) {
  const { imageId, imageUrl } =
  props.tank;
  return (
    <>
      <img src={imageUrl} alt="picture of user's tank" data-imageId={imageId} className="tank-img" />
    </>
  );
}

function Details(props) {
  const { tankName, population } =
    props.tank;
  let { pH, ammonia, temperature, nitrite, nitrate } = props.tank;
  if (!pH) {
    pH = 'N/A';
  }
  if (!ammonia) {
    ammonia = 'N/A';
  }
  if (!nitrite) {
    nitrite = 'N/A';
  }
  if (!temperature) {
    temperature = 'N/A';
  }
  if (!nitrate) {
    nitrate = 'N/A';
  }
  return (
    <div className="details-container">
      <div className="details">
        <h4>
          <strong>
          {tankName}
          </strong>
        </h4>
        <h5 className="my-3">
          Population: <strong>{population}</strong>
        </h5>
        <div className="row">
          <div className="col-6 col-md-6">
            <p className="mb-1">pH: <strong>{pH}</strong></p>
            <p className="mb-1">nitrite: <strong>{nitrite}</strong></p>
            <p className="mb-1">nitrate: <strong>{nitrate}</strong></p>
          </div>
          <div className="col-6 col-md-6">
            <p className="mb-1">temperature: <strong>{temperature}</strong></p>
            <p className="mb-1">ammonia: <strong>{ammonia}</strong></p>
          </div>
        </div>
    </div>
    </div>
  );
}
