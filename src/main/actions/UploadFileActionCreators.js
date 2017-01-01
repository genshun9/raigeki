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
        // TODO: 文字化けするので、扱いやすい配列に変換している
        AppDispatcher.dispatch({
          actionType: ActionTypes.UPLOAD,
          data: res.text.split(/\r\n|\r|\n/)
        })
      })
  },
  
  editFile(id, data) {
    AppDispatcher.dispatch({
      actionType: ActionTypes.EDIT,
      data: data,
      targetId: id
    })
  }
}