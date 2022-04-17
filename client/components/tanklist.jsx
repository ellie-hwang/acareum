import React from 'react';

export default class TankList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tanks: []
    };
  }

  componentDidMount() {
    fetch('/api/aquariums')
      .then(res => res.json())
      .then(tanks => this.setState({ tanks }));
  }

  render() {
    return (
      <div className="row">
        {
          this.state.tanks.map(tank => (
            <div key={tank.tankId} className="mb-3 col-xs-12 col-md-6 tank-img-container">
              <Tank tank={tank} />
            </div>
          ))
        }
      </div>
    );
  }
}

function Tank(props) {
  // const { tankId, tankName, imageId, imageUrl, pH, ammonia, temperature, nitrite, nitrate, population } =
  // props.tank;
  const { imageUrl } = props.tank;
  // console.log(tankId, tankName, imageId, imageUrl, pH, ammonia, temperature, nitrite, nitrate, population);
  return (
    <img src={imageUrl} alt="picture of user's tank" className="tank-img" />
  );
}
