import React from 'react';

export default class InhabitantList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inhabitants: [],
      inhabitantId: '',
      tankId: props.tankId,
      detailsOpen: false,
      displayModal: false,
      removeInhabitant: {
        inhabitantId: '',
        imageId: '',
        name: ''
      },
      errorMessage: '',
      loading: true
    };
    this.handleClick = this.handleClick.bind(this);
    this.displayModal = this.displayModal.bind(this);
    this.removeInhabitant = this.removeInhabitant.bind(this);
  }

  componentDidMount() {
    fetch(`/api/inhabitants/${this.state.tankId}`)
      .then(res => res.json())
      .then(inhabitants => this.setState({ inhabitants }))
      .catch(error => {
        console.error('Error:', error);
        this.setState({ errorMessage: error });
      });
    this.setState({ loading: false });
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

  displayModal(event) {
    if (event.target.matches('#trash-icon')) {
      this.setState({
        displayModal: true,
        removeInhabitant: {
          inhabitantId: event.target.getAttribute('data-remove-inhabitantid'),
          imageId: event.target.getAttribute('data-remove-imageid'),
          name: event.target.getAttribute('data-remove-inhabitantname')
        }
      });
    } else if (event.target.matches('.dialogue-cancel-button')) {
      this.setState({
        displayModal: false,
        removeInhabitant: {
          inhabitantId: '',
          imageId: '',
          name: ''
        }
      });
    }
  }

  removeInhabitant(event) {
    if (event.target.matches('.dialogue-remove-button')) {
      let { inhabitantId } = this.state.removeInhabitant;
      let index = null;
      inhabitantId = Number(inhabitantId);
      for (let i = 0; i < this.state.inhabitants.length; i++) {
        if (inhabitantId === this.state.inhabitants[i].inhabitantId) {
          index = i;
        }
      }
      fetch(`/api/inhabitants/${inhabitantId}`, {
        method: 'DELETE'
      })
        .then(() => {
          const inhabitantsCopy = this.state.inhabitants.slice(0);
          inhabitantsCopy.splice(index, 1);
          this.setState({
            inhabitants: inhabitantsCopy,
            displayModal: false,
            removeInhabitant: {
              inhabitantId: '',
              imageId: '',
              name: ''
            }
          });
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  }

  render() {
    const loading = this.state.loading === true ? '' : 'display-none';
    const error = this.state.errorMessage ? '' : 'display-none';
    const noInhabitants = (this.state.inhabitants.length === 0 && !this.state.errorMessage) ? '' : 'display-none';
    const toggleDetails = this.state.detailsOpen ? '' : 'display-none';
    const toggleModal = this.state.displayModal ? '' : 'display-none';
    const removeInhabitantName = this.state.removeInhabitant.name ? this.state.removeInhabitant.name : '';

    const inhabitants = this.state.inhabitants.map(inhabitant => {
      if (inhabitant.inhabitantId === this.state.inhabitantId) {
        return (
          <div className="mb-3 col-6 col-sm-3 col-md-3" key={inhabitant.inhabitantId.toString()} onClick={this.handleClick}>
            <Details display={toggleDetails} inhabitant={inhabitant} displayModal={this.displayModal} />
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
      <>
        <div className={`modal-bg ${toggleModal}`}>
          <div className="dialogue-box">
            <div className="dialogue-content text-center">
              <h5>
                <em>
                  Are you sure you want to remove <strong>{removeInhabitantName}</strong>?
                </em>
              </h5>
              <div className="row d-flex justify-content-around">
                <div className="col-4">
                  <button className="dialogue-cancel-button" onClick={this.displayModal}>
                    Cancel
                  </button>
                </div>
                <div className="col-4">
                  <button className="dialogue-remove-button" onClick={this.removeInhabitant}>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`row ${error}`}>
          <p>
            Sorry, there was an error connecting to the network! Please check your internet connection and try again.
          </p>
        </div>
        <div className={`row justify-content-center ${loading}`}>
          <div className={'lds-ripple'}><div></div><div></div></div>
        </div>
        <div className={`row ${noInhabitants}`} >
          <p>There are currently no inhabitants in your tank!</p>
        </div>
        <div className="row">
          {inhabitants}
        </div>
      </>
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
  const { name, species, inhabitantId, imageId } = props.inhabitant;
  return (
    <div className={`${props.display} inhabitant-frame inhabitant-details-container d-flex justify-content-center align-items-center`} data-inhabitant-id={inhabitantId}>
      <div className="inhabitant-details text-center">
        <h4>
          <strong>
            {name}
          </strong>
        </h4>
        <p>
          <em>
            ({species})
          </em>
        </p>
        <div className="trash-icon-container">
          <i id="trash-icon" className="far fa-trash-alt" data-remove-inhabitantid={inhabitantId} data-remove-imageid={imageId} data-remove-inhabitantname={name} onClick={props.displayModal} />
        </div>
      </div>
   </div>
  );
}
