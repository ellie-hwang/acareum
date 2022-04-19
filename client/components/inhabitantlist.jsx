import React from 'react';

export default class InhabitantList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inhabitants: [],
      inhabitantId: '',
      tankId: props.tankId,
      detailsOpen: false
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    fetch(`/api/inhabitants/${this.state.tankId}`)
      .then(res => res.json())
      .then(inhabitants => this.setState({ inhabitants }))
      .catch(error => {
        console.error('Error:', error);
      });
  }

  handleClick(event) {

  }

  render() {
    const toggleImg = this.state.detailsOpen ? 'display-none' : '';
    const toggleDetails = this.state.detailsOpen ? '' : 'display-none';
    const inhabitants = this.state.inhabitants.map(inhabitant => {
      if (inhabitant.inhabitantId === this.state.inhabitantId) {
        return (
          <div className="mb-3 col-6 col-sm-3 col-md-3" key={inhabitant.inhabitantId.toString()} data-inhabitant-id={inhabitant.inhabitantId} onClick={this.handleClick}>
            <InhabitantImg display={toggleImg} inhabitant={inhabitant} />
            <Details display={toggleDetails} inhabitant={inhabitant} />
          </div>
        );
      } else {
        return (
          <div className="mb-3 col-6 col-sm-3 col-md-3" key={inhabitant.inhabitantId.toString()} data-inhabitant-id={inhabitant.inhabitantId} onClick={this.handleClick}>
            <InhabitantImg display='' inhabitant={inhabitant} />
            <Details display='display-none' inhabitant={inhabitant} />
          </div>
        );
      }
    });
    return (
      <div className="row">
        {inhabitants}
      </div>
    );
  }
}

function InhabitantImg(props) {
  const { imageId, imageUrl } =
    props.inhabitant;
  return (
    <div className={props.display}>
      <img src={imageUrl} alt="picture of user's tank" data-image-id={imageId} className="inhabitant-img" />
    </div>
  );
}

function Details(props) {
  const { name, species } =
    props.inhabitant;

  return (
    <div className={`details-container ${props.display}`}>
      <div className="details">
        <div className="row">
          <h4 className="col">
            <strong>
              {name}
            </strong>
          </h4>
          <h6 className="col">
            <em>
              {species}
            </em>
          </h6>
        </div>
      </div>
    </div>
  );
}
