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
    if (parseInt(event.target.getAttribute('data-inhabitant-id')) === this.state.inhabitantId) {
      this.setState({
        inhabitantId: '',
        detailsOpen: false
      });
    } else if (parseInt(event.target.getAttribute('data-inhabitant-id')) !== this.state.inhabitantId && this.state.detailsOpen === true) {
      this.setState({
        inhabitantId: parseInt(event.target.getAttribute('data-inhabitant-id')),
        detailsOpen: true
      });
    } else if (parseInt(event.target.getAttribute('data-inhabitant-id')) !== this.state.inhabitantId && this.state.detailsOpen === false) {
      this.setState({
        inhabitantId: parseInt(event.target.getAttribute('data-inhabitant-id')),
        detailsOpen: true
      });
    }
  }

  render() {
    const toggleDetails = this.state.detailsOpen ? '' : 'display-none';
    const inhabitants = this.state.inhabitants.map(inhabitant => {
      if (inhabitant.inhabitantId === this.state.inhabitantId) {
        return (
          <div className="mb-3 col-6 col-sm-3 col-md-3" key={inhabitant.inhabitantId.toString()} onClick={this.handleClick}>
            <Details display={toggleDetails} inhabitant={inhabitant} />
          </div>
        );
      } else {
        return (
          <div className="mb-3 col-6 col-sm-3 col-md-3" key={inhabitant.inhabitantId.toString()} onClick={this.handleClick}>
            <InhabitantImg display='' inhabitant={inhabitant} />
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
  const { imageId, imageUrl, inhabitantId } = props.inhabitant;
  return (
    <div className={`${props.display} inhabitant-frame`}>
      <img src={imageUrl} alt="picture of user's tank" className="inhabitant-img" data-inhabitant-id={inhabitantId} data-image-id={imageId} />
    </div>
  );
}

function Details(props) {
  const { name, species, inhabitantId } = props.inhabitant;
  return (
    <div className={`${props.display} inhabitant-frame inhabitant-details-container d-flex justify-content-center align-items-center`} data-inhabitant-id={inhabitantId}>
      <div className="inhabitant-details text-center">
        <h4>
          <strong>
            {name}
          </strong>
        </h4>
        <p className="inhabitant-details-p">
          <em>
            ({species})
          </em>
        </p>
        <div className="trash-icon-container">

        </div>
      </div>
   </div>
  );
}
