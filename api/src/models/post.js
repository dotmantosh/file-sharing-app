import _ from 'lodash'

class Post {
  constructor(app) {
    this.app = app;

    this.model = {
      from: null,
      to: null,
      message: null,
      files: [],
      created: new Date()
    }
  }

  insertPost(post) {
    this.model.from = _.get(post, 'from')
    this.model.to = _.get(post, 'to')
    this.model.message = _.get(post, 'message')
    this.model.files = _.get(post, 'files', [])
    this.model.created = _.get(post, 'created', new Date())

    return this.model;
  }
}

export default Post