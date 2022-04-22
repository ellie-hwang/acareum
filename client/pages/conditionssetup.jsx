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
    const params = this.state;

    fetch('/api/conditions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    })
      .then(response => response.json())
      .then(resBody => {
        this.setState({
          pH: 7.0,
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
    if (event.target.getAttribute('id') === 'pH') {
      this.setState({
        pH: event.target.value
      });
    } else if (event.target.getAttribute('id') === 'temperature') {
      this.setState({
        temperature: event.target.value
      });
    } else if (event.target.getAttribute('id') === 'ammonia') {
      this.setState({
        ammonia: event.target.value
      });
    } else if (event.target.getAttribute('id') === 'nitrite') {
      this.setState({
        nitrite: event.target.value
      });
    } else if (event.target.getAttribute('id') === 'nitrate') {
      this.setState({
        nitrate: event.target.value
      });
    }
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
                    <label htmlFor="pH" className="form-label pb-2">pH</label>
                    <input required type="range" className="form-range" id="pH" name="pH" min="0.0" max="14.0" value={pH} step="0.1" onChange={this.setCondition} />
                    <output className="bubble-ph" style={{ left: calcLeft }}>{pH}</output>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="temperature" className="form-label">Temperature &deg;F </label>
                    <input required type="number" className="form-control" name="temperature" id="temperature" placeholder="75" value={this.state.temperature} onChange={this.setCondition} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="ammonia" className="form-label">Ammonia (ppm)</label>
                    <select required className="form-select" id="ammonia" onChange={this.setCondition}>
                      <option value="DEFAULT" hidden>Choose ammonia level</option>
                      <option value="0.0">0.0</option>
                      <option value="0.25">0.25</option>
                      <option value="0.50">0.50</option>
                      <option value="1.0">1.0</option>
                      <option value="2.0">2.0</option>
                      <option value="4.0">4.0</option>
                      <option value="8.0">8.0</option>
                    </select>
                  </div>
                </div>
                <div className="col-12 col-sm-6 col-md-6">
                  <div className="mb-3">
                    <label htmlFor="nitrite" className="form-label">Nitrite (ppm)</label>
                    <select required className="form-select" id="nitrite" onChange={this.setCondition}>
                      <option value="DEFAULT" hidden>Choose nitrite level</option>
                      <option value="0.0">0.0</option>
                      <option value="0.25">0.25</option>
                      <option value="0.50">0.50</option>
                      <option value="1.0">1.0</option>
                      <option value="2.0">2.0</option>
                      <option value="5.0">5.0</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="nitrate" className="form-label">Nitrate (ppm)</label>
                    <select required className="form-select" id="nitrate" onChange={this.setCondition}>
                      <option value="DEFAULT" hidden>Choose nitrate level</option>
                      <option value="0">0</option>
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="40">40</option>
                      <option value="80">80</option>
                      <option value="160">160</option>
                    </select>
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
