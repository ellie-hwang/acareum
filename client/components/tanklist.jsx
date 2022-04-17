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
    if (parseInt(event.target.getAttribute('data-tank-id')) === this.state.tankId) {
      this.setState({
        tankId: '',
        detailsOpen: false
      });
    } else if (parseInt(event.target.getAttribute('data-tank-id')) !== this.state.tankId && this.state.detailsOpen === true) {
      this.setState({
        tankId: parseInt(event.target.getAttribute('data-tank-id')),
        detailsOpen: true
      });
    } else if (parseInt(event.target.getAttribute('data-tank-id')) !== this.state.tankId && this.state.detailsOpen === false) {
      this.setState({
        tankId: parseInt(event.target.getAttribute('data-tank-id')),
        detailsOpen: true
      });
    }
  }

  render() {
    const toggleDetails = this.state.detailsOpen ? '' : 'display-none';
    const toggleImg = this.state.detailsOpen ? 'display-none' : '';
    const tanks = this.state.tanks.map(tank => {
      if (tank.tankId === this.state.tankId) {
        return (
          <div className="mb-3 col-12 col-sm-6 col-md-6" key={tank.tankId.toString()} data-tank-id={tank.tankId} onClick={this.handleClick}>
            <TankImg display={toggleImg} tank={tank} />
            <Details display={toggleDetails} tank={tank} />
          </div>
        );
      } else {
        return (
          <div className="mb-3 col-12 col-sm-6 col-md-6" key={tank.tankId.toString()} data-tank-id={tank.tankId} onClick={this.handleClick}>
            <TankImg display='' tank={tank} />
            <Details display='display-none' tank={tank} />
          </div>
        );
      }
    });
    return (
      <div className="row">
        {tanks}
      </div>
    );
  }
}

function TankImg(props) {
  const { imageId, imageUrl, tankId } =
  props.tank;
  return (
    <div className={props.display}>
      <img src={imageUrl} alt="picture of user's tank" data-image-id={imageId} data-tank-id={tankId} className="tank-img" />
    </div>
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
  } else {
    ammonia = `${ammonia} ppm`;
  }
  if (!nitrite) {
    nitrite = 'N/A';
  } else {
    nitrite = `${nitrite} ppm`;
  }
  if (!temperature) {
    temperature = 'N/A';
  }
  if (!nitrate) {
    nitrate = 'N/A';
  } else {
    nitrate = `${nitrate} ppm`;
  }
  return (
    <div className={`details-container ${props.display}`}>
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
