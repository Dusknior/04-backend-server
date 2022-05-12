const { Schema, model } = require('mongoose')

const hospitalSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    img: {
        type: String,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

hospitalSchema.methods.toJSON = function() {
    const { __v, ...object } = this.toObject();
    return object
}

module.exports = model('Hospital', hospitalSchema)