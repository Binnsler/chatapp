var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Chat', new Schema({
    name: String,
    admin: String,
    members: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    chats: [{username: String,
             message: String}]
}));
