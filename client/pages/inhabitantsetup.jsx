import React from 'react';
export default class InhabitantSetup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tankId: this.props.tankId,
      name: '',
      species: '',
      url: '',
      file: ''
    };
    this.fileInputRef = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderPreview = this.renderPreview.bind(this);
    this.setSpecies = this.setSpecies.bind(this);
    this.setName = this.setName.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append('tankId', this.state.tankId);
    formData.append('name', this.state.name);
    formData.append('species', this.state.species);
    formData.append('image', this.fileInputRef.current.files[0]);

    fetch('/api/inhabitants', {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(resBody => {
        this.setState({
          name: '',
          species: '',
          url: '',
          file: ''
        });
        this.fileInputRef.current.value = null;
      })
      .catch(error => {
        console.error('Error:', error);
      });
    window.location.hash = `inhabitants?tankId=${this.props.tankId}`;
  }

  renderPreview(event) {
    this.setState({
      file: URL.createObjectURL(event.target.files[0]),
      url: event.target.value
    });
  }

  setSpecies(event) {
    this.setState({
      species: event.target.value
    });
  }

  setName(event) {
    this.setState({
      name: event.target.value
    });
  }

  render() {
    const placeholder = this.state.file ? this.state.file : 'images/placeholder.png';

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col mt-3 mb-3">
            <h1>Add Inhabitant</h1>
          </div>
        </div>
        <div className="row">
          <div className="mb-3 col-12 col-sm-6 col-md-6" >
            <div className="circular-frame">
              <img src={placeholder} alt="picture of inhabitant" className="inhabitant-form-img" />
            </div>
          </div>
          <div className="col-12 col-sm-6 col-md-6">
            <form id="aquarium-form" onSubmit={this.handleSubmit}>
              <div className="mb-3">
                <label htmlFor="formFile" className="form-label custom-file-upload">Image</label>
                <input required autoFocus className="form-control" type="file" id="formFile" name="image" ref={this.fileInputRef} accept=".png, .jpg, .jpeg, .gif" onChange={this.renderPreview} value={this.state.url} />
              </div>
              <div className="mb-3">
                <label htmlFor="inhabitantName" className="form-label">Name</label>
                <input required type="text" className="form-control" name="tankName" id="inhabitantkName" placeholder="Nemo" value={this.state.name} onChange={this.setName} />
              </div>
              <div className="mb-3">
                <label htmlFor="species" className="form-label">Species</label>
                <input required type="text" className="form-control" name="species" id="species" placeholder="Betta Fish" value={this.state.species} onChange={this.setSpecies} />
              </div>
              <div className="text-end">
                <button type="submit">Add</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

}
