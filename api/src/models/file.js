import _ from 'lodash'
class File{
    constructor(app){
        this.app = app;

        this.model = {
            name: null,
            originalName: null,
            mimetype: null,
            size: null,
            created: Date.now()
        }
    }

    initWithObject(object){
        this.model.name = _.get(object, 'filename')
        this.model.originalName = _.get(object, 'originalname')
        this.model.mimetype = _.get(object, 'mimetype')
        this.model.size = _.get(object, 'size')
        this.model.created = Date.now()
        return this.model
    }


    save(callback){
        const app = this.app
        const db = app.get('db')

        db.collection('files').insertOne(this.model, (err, result)=>{
            return callback(err, result)
        })
    }
}

export default File