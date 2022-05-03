import React from 'react';
// import { Chart } from 'react-google-charts';

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
          <div className="row">
            <ChartComp tankId={this.state.tankId} condition={this.state.condition} timeSpan={this.state.timeSpan} />
            <div className="col-12 col-sm-6 col-md-6">
              <form>
                <div className="mb-3">
                  <label htmlFor="timeSpan" className="form-label">Time Frame</label>
                  <select required className="form-select" id="timeSpan" onChange={this.setConditionTimeSpan}>
                    <option value="DEFAULT" hidden>Choose time span</option>
                    <option value="7">Past 7 Days</option>
                    <option value="30">Past 30 Days</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="condition" className="form-label">Condition</label>
                  <select required className="form-select" id="condition" onChange={this.setConditionTimeSpan}>
                    <option value="DEFAULT" hidden>Choose condition</option>
                    <option value="pH">pH</option>
                    <option value="temperature">temperature</option>
                    <option value="ammonia">ammonia</option>
                    <option value="nitrite">nitrite</option>
                    <option value="nitrate">nitrate</option>
                  </select>
                </div>
              </form>
            </div>
          </div>
        </div>
      </>
    );
  }
}

function ChartComp(props) {
  const { condition, timeSpan } = props;
  return (
    <div className="col-12 col-sm-6 col-md-6">
      <div className="chart-frame mb-3">
        {
          (!condition || !timeSpan) &&
          <img src="images/placeholder-chart.png" alt="chart placeholder image" className="chart-img" />
        }
      </div>
    </div>
  );
}
