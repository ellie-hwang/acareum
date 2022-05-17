import React from 'react';
import { Chart } from 'react-google-charts';

export default class ChartsView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tankId: this.props.tankId,
      condition: '',
      timeSpan: '',
      dataWeek: [],
      dataMonth: []
    };
    this.setConditionTimeSpan = this.setConditionTimeSpan.bind(this);
  }

  componentDidMount() {
    fetch(`/api/conditions/week/${this.state.tankId}`)
      .then(res => res.json())
      .then(dataWeek => this.setState({ dataWeek }))
      .catch(error => {
        console.error('Error:', error);
      });

    fetch(`/api/conditions/month/${this.state.tankId}`)
      .then(res => res.json())
      .then(dataMonth => this.setState({ dataMonth }))
      .catch(error => {
        console.error('Error:', error);
      });
  }

  setConditionTimeSpan(event) {
    if (event.target.getAttribute('id') === 'timeSpan') {
      this.setState({
        timeSpan: event.target.value
      });
    }
    if (event.target.getAttribute('id') === 'condition') {
      this.setState({
        condition: event.target.value
      });
    }
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
            <ChartComp tankId={this.state.tankId} condition={this.state.condition} timeSpan={this.state.timeSpan} dataWeek={this.state.dataWeek} dataMonth={this.state.dataMonth} />
            <div className="col-12 col-sm-6 col-md-6">
              <form>
                <div className="mb-3">
                  <label htmlFor="timeSpan" className="form-label">Time Frame</label>
                  <select required className="form-select" id="timeSpan" onChange={this.setConditionTimeSpan}>
                    <option value="" hidden>Choose time span</option>
                    <option value="7">Past 7 Days</option>
                    <option value="30">Past 30 Days</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="condition" className="form-label">Condition</label>
                  <select required className="form-select" id="condition" onChange={this.setConditionTimeSpan}>
                    <option value="" hidden>Choose condition</option>
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

function padTwoDigits(number) {
  return number.toString().padStart(2, '0');
}

function getDate(date) {
  return [
    padTwoDigits(date.getMonth() + 1),
    padTwoDigits(date.getDate()),
    padTwoDigits(date.getFullYear())
  ].join('/');
}

function ChartComp(props) {
  const { condition, timeSpan, dataWeek, dataMonth } = props;
  const chartData = [[{ type: 'date', label: 'Date' }, { type: 'number', label: { condition } }]];
  let title = '';
  let vaxisTitle = '';
  if (Number(timeSpan) === 7 && dataWeek.length !== 0) {
    for (let i = 0; i < dataWeek.length; i++) {
      const dataPoint = [];
      const date = new Date(dataWeek[i].max_dateLogged);
      const conditionValue = Number(Number(dataWeek[i][condition]).toFixed(1));
      dataPoint.push(date);
      dataPoint.push(conditionValue);
      chartData.push(dataPoint);
    }
  } else if (Number(timeSpan) === 30 && dataMonth.length !== 0) {
    for (let i = 0; i < dataMonth.length; i++) {
      const dataPoint = [];
      const date = new Date(dataMonth[i].max_dateLogged);
      const conditionValue = Number(Number(dataMonth[i][condition]).toFixed(1));
      dataPoint.push(date);
      dataPoint.push(conditionValue);
      chartData.push(dataPoint);
    }
  }

  if (condition === 'pH' && chartData.length > 1) {
    title = `${condition} Levels: ${getDate(chartData[1][0])} - ${getDate(chartData[chartData.length - 1][0])}`;
    vaxisTitle = condition;
  } else if (condition && (condition !== 'pH') && chartData.length > 1) {
    const conditionUpper = condition.charAt(0).toUpperCase() + condition.slice(1);
    vaxisTitle = conditionUpper;
    title = `${conditionUpper} Levels: ${getDate(chartData[1][0])} - ${getDate(chartData[chartData.length - 1][0])}`;
  }

  let max = 0;
  let min = 0;

  if (condition === 'pH') {
    max = 14.0;
    min = 0.0;
  } else if (condition === 'temperature') {
    max = 100;
    min = 50;
  } else if (condition === 'ammonia') {
    max = 8.0;
    min = 0.0;
  } else if (condition === 'nitrite') {
    max = 5.0;
    min = 0.0;
  } else if (condition === 'nitrate') {
    max = 50;
    min = 0;
  }

  const options = {
    legend: {
      position: 'none'
    },
    chartArea: {
      bottom: 60
    },
    lineWidth: 3,
    backgroundColor: {
      fill: '#000'
    },
    colors: ['#5E60CE'],
    hAxis: {
      title: 'Date',
      titleTextStyle: {
        color: '#FFF',
        fontSize: 14,
        bold: true
      },
      format: 'MM/dd',
      textStyle: {
        color: 'white'
      }
    },
    vAxis: {
      title: `${vaxisTitle} Level`,
      titleTextStyle: {
        color: '#FFF',
        fontSize: 14,
        bold: true
      },
      textStyle: {
        color: 'white'
      },
      minValue: min,
      maxValue: max
    }
  };

  const displayImg = (!condition || !timeSpan) ? '' : 'display-none';
  const displayNoData = (condition && timeSpan && chartData.length <= 1) ? '' : 'display-none';
  const displayChart = (condition && timeSpan && chartData.length > 1) ? '' : 'display-none';
  return (
    <div className="col-12 col-sm-6 col-md-6">
      <div className="chart-frame mb-3">
        <img src="images/placeholder-chart.png" alt="chart placeholder image" className={`chart-img ${displayImg}`} />
        <img src="images/data-not-available.png" alt="data not available image" className={`chart-img ${displayNoData}`} />
        <div className={`mt-3 mx-3 text-center ${displayChart}`}>
          <h6>{title}</h6>
          <Chart
            chartType="LineChart"
            width="auto"
            height="auto"
            data={chartData}
            options={options}
          />
        </div>
      </div>
    </div>
  );

}
