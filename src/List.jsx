import React from 'react'
import {isNil} from 'lodash'
import If from 'ifx'
import {addGenreTimes} from './stores/TimeDataStore.js'
import {convertMinutesFromData, convertDataFromMinutes} from './utils/dataUtils.js'

function getValue(str) {
  return str.substr(1, str.length - 2);
}

export default class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      header: props.header,
      id: props.data.id,
      date: props.data.date,
      startTime: props.data.startTime,
      endTime: props.data.endTime,
      workTime: props.data.workTime,
      restTime: props.data.restTime,
      genreTimes: props.data.genreTimes
    };
  };

  componentWillReceiveProps(nextProps) {
    this.setState({header: nextProps.header, genreTimes: nextProps.data.genreTimes, restTime: nextProps.data.restTime});
  }

  render() {
    // 土日の場合削除する。
    if (this.state.startTime.substr(1, this.state.startTime.length - 2) === "") {
      return (
          <div />
      )
    }

    const additionalInputElms = this.state.header.map((h, i) =>
        (i > 3) ? <input type="text" placeholder={`${h}を入力してください`} key={i}
                         onChange={e => this.props.addGenreTimes(this.state.id, i - 3, e.target.value)} /> : null
    );

    return (
        <div >
          <input defaultValue={this.state.date}/>
          <input defaultValue={this.state.startTime}/>
          <input defaultValue={this.state.endTime}/>
          <input defaultValue={this.state.workTime}/>
          {additionalInputElms}
          <input value={this.state.restTime}/>
          <button disabled={this.state.genreTimes.size === 0} onClick={this.updateRestTime.bind(this)}>{'restTime更新'}</button>
        </div>
    );
  }

  updateRestTime() {
    var sumGenreTimes = 0;
    this.state.genreTimes.toArray().forEach(g => {
      let time = (isNil(g) || g === '') ? '00:00' : g.time;
      sumGenreTimes += convertMinutesFromData(time);
    });
    var updatedRestTime = convertDataFromMinutes(convertMinutesFromData(this.state.workTime), sumGenreTimes);
    this.props.updateRestTime(this.state.id, updatedRestTime);
  }
}

List.propTypes = {
  data: React.PropTypes.any,
  header: React.PropTypes.any,
  addGenreTimes: React.PropTypes.func,
  updateRestTime: React.PropTypes.func
};