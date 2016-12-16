import AppDispatcher from '../dispatchers/AppDispatcher.js'
import request from 'superagent'
import {ActionTypes} from '../constants/Constants.js'

export default {
  uploadFile(file) {
    const formData = new FormData();
    formData.append("userfile", file);
    request
      .post('/upload')
      .send(formData)
      .end(function (err, res) {
        AppDispatcher.dispatch({
          actionType: ActionTypes.UPLOAD,
          data: res.body
        })
      })
  }
}