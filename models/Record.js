const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const RecordSchema = new Schema({
    _id: Schema.Types.ObjectId,
    key: String,
    value: String,
    createdAt: Date,
    counts: Array
});

module.exports = mongoose.model('records', RecordSchema);
