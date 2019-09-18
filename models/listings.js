const mongoose = require(`mongoose`);

const listingSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	title: String,
	description: String,
	price: String,
	filePath: String,
	originalName: String,
	uploaderId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: `users`
	}
});

module.exports = mongoose.model(`Listings`, listingSchema);
