import React from 'react'
import {isNil} from 'lodash'

function getValue(str) {
  return str.substr(1, str.length - 2);
}

export default class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: getValue(props.data.split(',')[4]),
      startTime: getValue(props.data.split(',')[16]),
      endTime: getValue(props.data.split(',')[17]),
      workTime: getValue(props.data.split(',')[19])
    }
  };

  render() {
    // 土日の場合削除する。
    if (this.state.startTime.substr(1, this.state.startTime.length - 2) === "") {
      return (
          <div />
      )
    } else {

      return (
          <div >
            <input defaultValue={this.state.date}/>
            <input defaultValue={this.state.startTime}/>
            <input defaultValue={this.state.endTime}/>
            <input defaultValue={this.state.workTime}/>
            <input type="text" placeholder="数値を入力してください!"/>
          </div>
      );
    }
  }
}

List.propTypes = {
  data: React.PropTypes.any,
  header: React.PropTypes.any
};