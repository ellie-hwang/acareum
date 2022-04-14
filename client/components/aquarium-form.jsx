import React from 'react';

export default class AquariumForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: null,
      size: null
    };
    this.fileInputRef = React.createRef();
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      name: event.target.value,
      size: event.target.value
    });
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="column-full">
            <h1>Set up Tank</h1>
          </div>
        </div>
        <div className="row">
          <div className="column-half">
            <img src="../server/public/images/myaquarium.jpg" alt="" className="tank-form-img" />
          </div>
        </div>
      </div>
    );
  }

}
