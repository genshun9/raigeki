import React from 'react'
import {isNil} from 'lodash'

function getNumber(str) {
  console.log("before", str);
  str.substr(1, str.length -1);
  console.log("after", str);
  return Number(str);
}

export default class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: props.data.split(',')[4],
      startTime: props.data.split(',')[17],
      endTime: props.data.split(',')[18]
    }
  };

  render() {
    return (
        <div>
          {this.state.date}{this.state.startTime}{this.state.endTime}
        </div>
    );
  }
}

List.propTypes = {
  data: React.PropTypes.any,
  header: React.PropTypes.any
};