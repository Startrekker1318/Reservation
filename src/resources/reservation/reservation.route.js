const express = require("express");
const httpStatus = require("http-status");
const mongoose = require("mongoose");

const startOfDay = require("date-fns/startOfDay");
const endOfDay = require("date-fns/endOfDay");
const isBefore = require("date-fns/isBefore");
const isAfter = require("date-fns/isAfter");

const Reservation = require("./reservation.model");
const logger = require("../../libraries/logger");

const { guestTimeline } = require("./reservation.service");

const userResponse = ({
	reservationId,
	hotel,
	guestId,
	guestName,
	arrivalTime,
	departureTime,
	status,
	baseAmount,
	taxAmount,
}) => ({
	reservationId,
	hotel,
	guestId,
	guestName,
	arrivalTime,
	departureTime,
	status,
	baseAmount,
	taxAmount,
});

function defineReservationRoutes(expressApp) {
	const reservationRouter = express.Router();

	reservationRouter.get("/", async (request, response) => {
		try {
			if (Object.keys(request.query).length === 0) {
				const result = await Reservation.find({});
				response.status(httpStatus.OK).send(result.map(userResponse));
				logger.fatal(`request completed ${request.headers["x-request-id"]}`);
				return undefined;
			}
			if (request.query.fromDate && request.query.toDate) {
				const data = await Reservation.find({ status: "ACTIVE" });
				const result = data.filter(
					(e) =>
						isAfter(
							new Date(e.arrivalTime),
							startOfDay(new Date(request.query.fromDate)),
						) &&
						isBefore(
							new Date(e.arrivalTime),
							endOfDay(new Date(request.query.toDate)),
						),
				);
				response.status(httpStatus.OK).send(result.map(userResponse));
				logger.fatal(`request completed ${request.headers["x-request-id"]}`);
				return undefined;
			}
			response.status(httpStatus.OK).send([]);
			logger.fatal(`request completed ${request.headers["x-request-id"]}`);
			return undefined;
		} catch (error) {
			logger.error(error);
			response
				.status(httpStatus.INTERNAL_SERVER_ERROR)
				.send(httpStatus.INTERNAL_SERVER_ERROR);
			return undefined;
		}
	});

	reservationRouter.get("/:id", async (request, response) => {
		try {
			const { id } = request.params;
			const result = await Reservation.find({ reservationId: id });
			response.status(httpStatus.OK).send(result.map(userResponse));
			logger.fatal(`request completed ${request.headers["x-request-id"]}`);
			return undefined;
		} catch (error) {
			logger.error(error);
			response
				.status(httpStatus.INTERNAL_SERVER_ERROR)
				.send(httpStatus.INTERNAL_SERVER_ERROR);
			return undefined;
		}
	});

	reservationRouter.post(
		"/",
		(request, response, next) => {
			const { guestName, arrivalTime, departureTime } = request.body;

			if (!guestName) {
				response
					.status(httpStatus.BAD_REQUEST)
					.send("Validation failed - guestName");
				logger.fatal(`validation error ${request.headers["x-request-id"]}`);
				return null;
			}
			if (typeof guestName !== "string") {
				response
					.status(httpStatus.BAD_REQUEST)
					.send("Validation failed - guestName");
				logger.fatal(`validation error ${request.headers["x-request-id"]}`);
				return null;
			}
			if (!arrivalTime) {
				response
					.status(httpStatus.BAD_REQUEST)
					.send("Validation failed - arrivalTime");
				logger.fatal(`validation error ${request.headers["x-request-id"]}`);
				return null;
			}
			if (typeof arrivalTime !== "string") {
				response
					.status(httpStatus.BAD_REQUEST)
					.send("Validation failed - arrivalTime");
				logger.fatal(`validation error ${request.headers["x-request-id"]}`);
				return null;
			}
			if (!departureTime) {
				response
					.status(httpStatus.BAD_REQUEST)
					.send("Validation failed - departureTime");
				logger.fatal(`validation error ${request.headers["x-request-id"]}`);
				return null;
			}
			if (typeof departureTime !== "string") {
				response
					.status(httpStatus.BAD_REQUEST)
					.send("Validation failed - departureTime");
				logger.fatal(`validation error ${request.headers["x-request-id"]}`);
				return null;
			}
			next();
		},
		async (request, response) => {
			try {
				const { guestName, arrivalTime, departureTime } = request.body;

				const reservationId = new mongoose.mongo.ObjectId();

				const lastStay = await Reservation.findOne({ guestName });
				if (lastStay) {
					const { guestId } = lastStay;
					const result = await Reservation.create({
						reservationId,
						guestId,
						guestName,
						hotel: "HOTEL",
						arrivalTime,
						departureTime,
						baseAmount: 100,
						taxAmount: 25,
					});
					response.status(httpStatus.OK).send([result].map(userResponse)[0]);
					logger.fatal(`request completed ${request.headers["x-request-id"]}`);
					return null;
				}

				const guestId = new mongoose.mongo.ObjectId();

				const result = await Reservation.create({
					reservationId,
					guestId,
					guestName,
					hotel: "HOTEL",
					arrivalTime,
					departureTime,
					baseAmount: 100,
					taxAmount: 25,
				});
				response.status(httpStatus.OK).send([result].map(userResponse)[0]);
				logger.fatal(`request completed ${request.headers["x-request-id"]}`);
				return null;
			} catch (error) {
				logger.error(error);
				response
					.status(httpStatus.INTERNAL_SERVER_ERROR)
					.send(httpStatus.INTERNAL_SERVER_ERROR);
				return undefined;
			}
		},
	);

	reservationRouter.post("/cancelling/:id/", async (request, response) => {
		try {
			const { id } = request.params;
			const result = await Reservation.findOneAndUpdate(
				{ reservationId: id },
				{ status: "CANCELLED" },
			);
			response.status(httpStatus.OK).send([result].map(userResponse)[0]);
			logger.fatal(`request completed ${request.headers["x-request-id"]}`);
			return undefined;
		} catch (error) {
			logger.error(error);
			response
				.status(httpStatus.INTERNAL_SERVER_ERROR)
				.send(httpStatus.INTERNAL_SERVER_ERROR);
			return undefined;
		}
	});

	reservationRouter.get("/guest/:id", async (request, response) => {
		try {
			const { id } = request.params;
			const data = await Reservation.find({
				guestId: id,
			});
			const result = guestTimeline(data);
			response.status(httpStatus.OK).send({ ...result, guestId: id });
			logger.fatal(`request completed ${request.headers["x-request-id"]}`);
			return undefined;
		} catch (error) {
			logger.error(error);
			response
				.status(httpStatus.INTERNAL_SERVER_ERROR)
				.send(httpStatus.INTERNAL_SERVER_ERROR);
			return undefined;
		}
	});

	reservationRouter.delete("/", async (request, response) => {
		try {
			await Reservation.deleteMany({ hotel: "HOTEL" });
			response.status(httpStatus.OK).send({});
			logger.fatal(`request completed ${request.headers["x-request-id"]}`);
			return undefined;
		} catch (error) {
			logger.error(error);
			response
				.status(httpStatus.INTERNAL_SERVER_ERROR)
				.send(httpStatus.INTERNAL_SERVER_ERROR);
			return undefined;
		}
	});

	expressApp.use("/api/v1/reservation", reservationRouter);
}

module.exports = defineReservationRoutes;
