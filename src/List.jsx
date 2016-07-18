import React from 'react'
import {isNil} from 'lodash'
import If from 'ifx'

function getValue(str) {
  return str.substr(1, str.length - 2);
}

export default class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      header: props.header,
      date: getValue(props.data.split(',')[4]),
      startTime: getValue(props.data.split(',')[16]),
      endTime: getValue(props.data.split(',')[17]),
      workTime: getValue(props.data.split(',')[19])
    };

    this.state.restTime = this.state.workTime;
  };

  componentWillReceiveProps(nextProps) {
    this.setState({header: nextProps.header});
  }

  render() {
    // 土日の場合削除する。
    if (this.state.startTime.substr(1, this.state.startTime.length - 2) === "") {
      return (
          <div />
      )
    }

    const additionalInputElms = this.state.header.map((h, i) =>
        (i > 3) ? <input type="text" placeholder={`${h}を入力してください`} key={i}/> : null
    );

    return (
        <div >
          <input defaultValue={this.state.date}/>
          <input defaultValue={this.state.startTime}/>
          <input defaultValue={this.state.endTime}/>
          <input defaultValue={this.state.workTime}/>
          {additionalInputElms}
          <input defaultValue={this.state.restTime}/>
        </div>
    );
  }
}

List.propTypes = {
  data: React.PropTypes.any,
  header: React.PropTypes.any
};