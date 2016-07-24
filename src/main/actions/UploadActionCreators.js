function uploadFile(file) {
    const action = {
        type: 'UPLOAD',
        file: file
    }
    dispatch(action)
}