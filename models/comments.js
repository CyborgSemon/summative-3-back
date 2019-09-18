const mongoose = require(`mongoose`);

const commentsSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    commentUsername: String,
    commentText: String,
	commentDate: Date,
    commentReply: {
        reple: Boolean,
        replyId: mongoose.Schema.Types.ObjectId
    },
	commentUserId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: `users`
	},
	listingId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: `listings`
	}
});

module.exports = mongoose.model(`Comments`, commentsSchema);
