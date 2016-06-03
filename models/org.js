var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Org', new Schema({
    name: String,
    code: String,
    admin: { type: mongoose.Schema.ObjectId, ref: 'User' },
    members: [{ type: mongoose.Schema.ObjectId, ref: 'User' }]
}));
