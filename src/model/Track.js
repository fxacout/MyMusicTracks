const ObjectID = require('mongodb').ObjectID
const {Schema, model} =  require('mongoose')


const TrackSchema = new Schema({
    name: String,
    autor: String,
    trackId: ObjectID
})


module.exports= model("Track",TrackSchema)