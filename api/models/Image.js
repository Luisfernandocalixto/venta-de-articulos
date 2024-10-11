const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    imageUrl: { type: String, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now() }
})


module.exports = mongoose.model('Image', ImageSchema);