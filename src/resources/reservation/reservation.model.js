const { Document, model, Model, Schema } = require("mongoose");

const reservationSchema = new Schema({
	reservationId: {
		type: String,
		required: true,
	},

	hotel: {
		type: String,
		required: true,
	},

	guestId: {
		type: String,
		required: true,
	},

	guestName: {
		type: String,
		required: true,
	},

	arrivalTime: {
		type: Date,
		required: true,
	},

	departureTime: {
		type: Date,
		required: true,
	},

	status: {
		type: String,
		enum: ["ACTIVE", "CANCELLED"],
		default: "ACTIVE",
	},

	baseAmount: {
		type: Number,
		required: true,
	},

	taxAmount: {
		type: Number,
		required: true,
	},

	createdAt: {
		type: Date,
		default: new Date(),
		required: true,
	},
});

const Reservation = model("Reservation", reservationSchema);

module.exports = Reservation;
