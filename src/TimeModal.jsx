import React from 'react'
import {Modal} from 'react-bootstrap'

export default class TimeModal extends React.Component {
  //constructor(props) {
  //  super(props);
  //}

  render() {
    const getContent = id => {

    };

    return (
        <div>
          <Modal show={this.props.show} onHide={this.props.onHide}>
            <Modal.Header>
              <Modal.Title>{this.props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {this.props.genreId}
            </Modal.Body>
            <Modal.Footer>
              <button onClick={this.props.onHide}>{'閉じる'}</button>
            </Modal.Footer>
          </Modal>
        </div>
    )
  }
}

TimeModal.propTypes = {
  show: React.PropTypes.boolean,
  title: React.PropTypes.string,
  genreId: React.PropTypes.number,
  onHide: React.PropTypes.func
};