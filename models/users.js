const mongoose = require(`mongoose`);

const usersSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    address: String,
    username: String,
    password: String,
    email: String,
    dob: Date,
    registerDate: Date
});

module.exports = mongoose.model(`Users`, usersSchema);
