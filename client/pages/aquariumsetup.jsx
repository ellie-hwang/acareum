import React from 'react';
export default class AquariumSetup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      size: 100,
      url: '',
      file: ''
    };
    this.fileInputRef = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderPreview = this.renderPreview.bind(this);
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
          size: 100,
          url: '',
          file: ''
        });
        this.fileInputRef.current.value = null;
      })
      .catch(error => {
        console.error('Error:', error);
      });
    window.location.hash = '#';
  }

  renderPreview(event) {
    this.setState({
      file: URL.createObjectURL(event.target.files[0]),
      url: event.target.value
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
    const size = this.state.size ? this.state.size : '100';

    const min = 0;
    const max = 200;
    const newVal = Number(((size - min) * 100) / (max - min));
    const calcLeft = `calc(${newVal}% + (${8 - newVal * 0.15}px))`;

    const placeholder = this.state.file ? this.state.file : 'images/placeholder.png';

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col mt-3 mb-3">
            <h1>Set up Tank</h1>
          </div>
        </div>
        <div className="row">
          <div className="mb-3 col-12 col-md-6" >
            <img src={placeholder} alt="picture of aquarium" className="tank-form-img" />
          </div>
          <div className="col-12 col-md-6">
            <form id="aquarium-form" onSubmit={this.handleSubmit}>
              <div className="mb-3">
                <label htmlFor="formFile" className="form-label custom-file-upload">Image</label>
                <input required autoFocus className="form-control" type="file" id="formFile" name="image" ref={this.fileInputRef} accept=".png, .jpg, .jpeg, .gif" onChange={this.renderPreview} value={this.state.url} />
              </div>
              <div className="mb-3">
                <label htmlFor="tankName" className="form-label">Name</label>
                <input required type="text" className="form-control" name="tankName" id="tankName" placeholder="MyAquarium" value={this.state.name} onChange={this.setName}/>
              </div>
              <div className="range-wrap">
                <label htmlFor="size" className="form-label pb-3">Gallons</label>
                <input required type="range" className="form-range" id="size" name="size" min="0" max="200" value={size} onChange={this.setSize} />
                <output className="bubble" style={{ left: calcLeft }}>{size}</output>
              </div>
              <div className="text-end">
                <button type="submit">Complete Setup</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

}
