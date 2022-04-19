import React from 'react';

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tank: ''
    };
  }

  componentDidMount() {
    fetch(`/api/aquariums/${this.props.tankId}`)
      .then(res => res.json())
      .then(tank => this.setState({ tank }))
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
        <div className="row mb-3 g-3">
          <div className="col-12 col-sm-6 col-md-6">
            <TankImg tank={this.state.tank} />
          </div>
            {/* <div className="col-12 col-sm-6 col-md-6">
              CONDITIONS PLACEHOLDER
            </div> */}
        </div>
        <div className="row mb-3 g-3">
          <div className="col-6 col-sm-3 col-md-3">
            <Population tank={this.state.tank} />
          </div>
          {/* <div className="col-6 col-sm-3 col-md-3">
            DATA TAB PLACEHOLDER
          </div> */}
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
    <div>
      <img src={imageUrl} alt="picture of user's tank" data-image-id={imageId} data-tank-id={tankId} className="db-tank-img" />
    </div>
  );
}

function Population(props) {
  const { population, tankId } = props.tank;
  return (
      <div className="population-tab">
        <div className="population-details text-center">
          <h5>Population</h5>
          <h1 className="population-h1">{population}</h1>
          <div className="text-end population-icon-container">
            <a href={`#inhabitants?tankId=${tankId}`}><i className="fas fa-plus" /></a>
          </div>
        </div>
      </div>
  );
}
