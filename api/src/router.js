import { version } from '../package.json'
import path from 'path'
import _ from 'lodash'
import File from './models/file'
import Post from './models/post'
import { ObjectId } from 'mongodb'
class AppRouter {
    constructor(app) {
        this.app = app;

        this.setupRouter()
    }

    setupRouter() {
        const app = this.app;
        const db = app.get('db')
        const uploadDir = app.get('storageDir')
        const upload = app.get('upload')
        // root routing
        app.get('/', (req, res) => {
            return res.json({
                version
            })
        })

        // upload file routing

        app.post('/api/upload', upload.array('files'), (req, res) => {
            const files = _.get(req, 'files', [])
            let fileModels = []
            _.each(files, (fileObject) => {
                const newFile = new File(app).initWithObject(fileObject)
                fileModels.push(newFile)
            })

            if (fileModels.length) {
                db.collection('files').insertMany(fileModels, (err, result) => {
                    if (err) {
                        return res.status(503).json({
                            error: {
                                message: 'unable to save your file'
                            }
                        })
                    }

                    let post = new Post(app).insertPost({
                        from: _.get(req, 'body.from'),
                        to: _.get(req, 'body.to'),
                        message: _.get(req, 'body.message'),
                        files: Object.values(result.insertedIds)

                    })

                    //save the post
                    db.collection('post').insertOne(post, (err, result) => {
                        if (err) {
                            return res.status(503).json({ error: { message: 'Your upload could not be saved' } })
                        }

                        return res.json(post)
                    })

                })
            } else {
                return res.status(503).json({
                    error: {
                        message: 'A file to upload must be selected'
                    }
                })
            }
        })

        //download file routing
        app.get('/api/download/:id', (req, res) => {
            const fileId = req.params.id
            db.collection('files').find({ _id: ObjectId(fileId) }).toArray((err, result) => {
                const fileName = _.get(result, '[0].name')
                if (err || !fileName) {
                    return res.status(404).json({
                        error: {
                            message: 'File not found'
                        }
                    })
                }
                const filePath = path.join(uploadDir, fileName)

                return res.download(filePath, fileName, (err) => {
                    if (err) {
                        return res.status(404).json({
                            error: {
                                message: 'File not found'
                            }
                        })
                    }

                })
            })



        })

    }
}

export default AppRouter