import React from 'react';

export default class TankList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tanks: [],
      tankId: '',
      detailsOpen: false,
      errorMessage: '',
      loading: true
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    fetch('/api/aquariums')
      .then(res => res.json())
      .then(tanks => this.setState({ tanks }))
      .catch(error => {
        console.error('Error:', error);
        this.setState({ errorMessage: error });
      });
    this.setState({ loading: false });
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
    const loading = this.state.loading === true ? '' : 'display-none';
    const error = this.state.errorMessage ? '' : 'display-none';
    const noTanks = (this.state.tanks.length === 0 && !this.state.errorMessage) ? '' : 'display-none';
    const toggleDetails = this.state.detailsOpen ? '' : 'display-none';
    const tanks = this.state.tanks.map(tank => {
      if (tank.tankId === this.state.tankId) {
        return (
          <div className="mb-3 col-12 col-sm-6 col-md-6" key={tank.tankId.toString()} data-tank-id={tank.tankId} onClick={this.handleClick}>
            <Details display={toggleDetails} tank={tank} />
          </div>
        );
      } else {
        return (
          <div className="mb-3 col-12 col-sm-6 col-md-6" key={tank.tankId.toString()} data-tank-id={tank.tankId} onClick={this.handleClick}>
            <TankImg display='' tank={tank} />
          </div>
        );
      }
    });
    return (
      <>
        <div className={`row ${error}`}>
          <p>
            Sorry, there was an error connecting to the network! Please check your internet connection and try again.
          </p>
        </div>
        <div className={`row justify-content-center ${loading}`}>
          <div className={'lds-ripple'}><div></div><div></div></div>
        </div>
        <div className={`row ${noTanks}`} >
            <p>There are currently no aquariums set up!</p>
        </div>
        <div className="row">
          {tanks}
        </div>
      </>
    );
  }
}

function TankImg(props) {
  const { imageId, imageUrl, tankId } = props.tank;
  return (
    <div className={props.display}>
      <img src={imageUrl} alt="picture of user's tank" data-image-id={imageId} data-tank-id={tankId} className="tank-img" />
    </div>
  );
}

function Details(props) {
  const { tankName, population, tankId } = props.tank;
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
  } else {
    temperature = `${temperature}\u00B0F`;
  }
  if (!nitrate) {
    nitrate = 'N/A';
  } else {
    nitrate = `${nitrate} ppm`;
  }
  return (
    <div className={`details-container ${props.display}`}>
      <div className="details">
        <div className="row">
          <h4 className="col-10 col-md-10">
            <strong>
              {tankName}
            </strong>
          </h4>
          <div className="col-2 col-md-2 text-end">
            <a href={`#dashboard?tankId=${tankId}`}><i className="far fa-edit" /></a>
          </div>
        </div>
        <h5 className="my-2">
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
