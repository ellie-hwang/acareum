import React from 'react';
import Chart from '../components/chart';

export default class ChartsView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tankId: this.props.tankId,
      condition: '',
      timeSpan: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.setConditionTimeSpan = this.setConditionTimeSpan.bind(this);
  }

  handleChange(event) {
    event.preventDefault();
  }

  setConditionTimeSpan(event) {
  }

  render() {
    return (
      <>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 col-sm-6 col-md-6 mt-3 mb-3 d-flex justify-content-between align-items-center">
              <h1>Charts</h1>
            </div>
          </div>
          <Chart tankId={this.state.tankId} condition={this.state.condition} timeSpan={this.state.timeSpan} />
        </div>
      </>
    );
  }
}
