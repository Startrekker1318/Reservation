const isFuture = require("date-fns/isFuture");
const differenceInDays = require("date-fns/differenceInDays");

const guestTimeline = (data) => {
	const info = data.reduce(
		(accum, value) => {
			if (value.status === "CANCELLED") {
				return {
					...accum,
					cancelled: accum.cancelled.concat([value]),
				};
			}
			if (isFuture(new Date(value.arrivalTime))) {
				return {
					...accum,
					upcoming: accum.upcoming.concat([value]),
				};
			} else {
				return {
					...accum,
					past: accum.past.concat([value]),
				};
			}
		},
		{
			upcoming: [],
			past: [],
			cancelled: [],
		},
	);

	const result = {
		upcomingStay: {
			numberOfUpcomingStay: info.upcoming.length,
			numberOfNightStay: info.upcoming.reduce((accm, val) => {
				return (
					accm +
					differenceInDays(
						new Date(val.departureTime),
						new Date(val.arrivalTime),
					)
				);
			}, 0),
			totalAmount: info.upcoming.reduce((accm, val) => {
				return accm + val.baseAmount + val.taxAmount;
			}, 0),
		},
		pastStay: {
			numberOfPastStay: info.past.length,
			numberOfNightStay: info.past.reduce((accm, val) => {
				return (
					accm +
					differenceInDays(
						new Date(val.departureTime),
						new Date(val.arrivalTime),
					)
				);
			}, 0),
			totalAmount: info.past.reduce((accm, val) => {
				return accm + val.baseAmount + val.taxAmount;
			}, 0),
		},
		cancelledStay: info.cancelled.length,
		totalAmount: info.past.concat(info.upcoming).reduce((accm, val) => {
			return accm + val.baseAmount + val.taxAmount;
		}, 0),
	};

	return result;
};

module.exports = { guestTimeline };
