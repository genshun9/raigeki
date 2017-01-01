import EventEmitter from 'events'

export default class Store extends EventEmitter {
  emitChange() {
    this.emit('change');
  }
  
  addChangeListener(callback) {
    this.on('change', callback);
  }
  
  removeChangeListener(callback) {
    this.off('change', callback);
  }
}