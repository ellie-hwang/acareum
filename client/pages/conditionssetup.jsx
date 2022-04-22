import React from 'react';

export default class ConditionsSetup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tankId: this.props.tankId,
      pH: 7.0,
      temperature: '',
      ammonia: '',
      nitrite: '',
      nitrate: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setCondition = this.setCondition.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append('tankId', this.state.tankId);
    formData.append('pH', this.state.pH);
    formData.append('temperature', this.state.temperature);
    formData.append('ammonia', this.state.ammonia);
    formData.append('nitrite', this.state.nitrite);
    formData.append('nitrate', this.state.nitrate);

    fetch('/api/conditions', {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(resBody => {
        this.setState({
          pH: '',
          temperature: '',
          ammonia: '',
          nitrite: '',
          nitrate: ''
        });
        window.location.hash = `dashboard?tankId=${this.props.tankId}`;
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  setCondition(event) {
    this.setState({
      pH: event.target.value
    });
  }

  render() {
    const pH = this.state.pH ? this.state.pH : '7.0';

    const min = 0.0;
    const max = 14.0;
    const newVal = Number(((pH - min) * 100) / (max - min));
    const calcLeft = `calc(${newVal}% + (${8 - newVal * 0.15}px))`;

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col mt-3 mb-3">
            <h1>H<sub>2</sub>O Conditions</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <form id="conditions-form" onSubmit={this.handleSubmit}>
              <div className="row">
                <div className="col-12 col-sm-6 col-md-6">
                  <div className="range-wrap">
                    <label htmlFor="pH" className="form-label pb-3">pH</label>
                    <input required type="range" className="form-range" id="pH" name="pH" min="0.0" max="14.0" value={pH} step="0.1" onChange={this.setCondition} />
                    <output className="bubble-ph" style={{ left: calcLeft }}>{pH}</output>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="temperature" className="form-label">Temperature &deg;F </label>
                    <input required type="text" className="form-control" name="temperature" id="temperature" placeholder="75" value={this.state.temperature} onChange={this.setCondition} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="ammonia" className="form-label">Ammonia (ppm)</label>
                    <input required type="text" className="form-control" name="ammonia" id="ammonia" placeholder="0.0" value={this.state.ammonia} onChange={this.setCondition} />
                  </div>
                </div>
                <div className="col-12 col-sm-6 col-md-6">
                  <div className="mb-3">
                    <label htmlFor="nitrite" className="form-label">Nitrite (ppm)</label>
                    <input required type="text" className="form-control" name="nitrite" id="nitrite" placeholder="0.0" value={this.state.nitrite} onChange={this.setCondition} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="nitrate" className="form-label">Nitrate (ppm)</label>
                    <input required type="text" className="form-control" name="nitrate" id="nitrate" placeholder="45" value={this.state.nitrate} onChange={this.setCondition} />
                  </div>
                  <div className="text-end">
                    <button type="submit">Set</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

}
