import React from 'react';

export default class AquariumForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      size: ''
    };
    this.fileInputRef = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setSize = this.setSize.bind(this);
    this.setName = this.setName.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append('name', this.state.name);
    formData.append('size', this.state.size);
    formData.append('image', this.fileInputRef.current.files[0]);

    fetch('/api/aquariums', {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(resBody => {
        this.setState({
          name: '',
          size: ''
        });
        this.fileInputRef.current.value = null;
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  setSize(event) {
    this.setState({
      size: event.target.value
    });
  }

  setName(event) {
    this.setState({
      name: event.target.value
    });
  }

  render() {
    const size = this.state.size;
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col mt-3">
            <h1>Set up Tank</h1>
          </div>
        </div>
        <div className="row">
          <div className="mb-3 col-xs-12 col-md-6">
            <img src="images/myaquarium.jpg" alt="" className="tank-form-img" />
          </div>
          <div className="col-xs12 col-md-6">
            <form id="aquarium-form" onSubmit={this.handleSubmit}>
              <div className="mb-3">
                <label htmlFor="formFile" className="form-label custom-file-upload">Image</label>
                <input required className="form-control" type="file" id="formFile" name="image" ref={this.fileInputRef} accept=".png, .jpg, .jpeg, .gif" />
              </div>
              <div className="mb-3">
                <label htmlFor="tankName" className="form-label">Name</label>
                <input required type="text" className="form-control" name="tankName" id="tankName" placeholder="MyAquarium" value={this.state.name} onChange={this.setName}/>
              </div>
              <label htmlFor="size" className="form-label">Gallons</label>
              <input required type="range" className="form-range" id="size" name="size" min="0" max="200" value={this.state.size} onChange={this.setSize} />
              <output>{size}</output>
              <div className="text-end">
                <button type="button">Complete Setup</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

}
