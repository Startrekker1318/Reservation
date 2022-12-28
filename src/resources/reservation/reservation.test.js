const { guestTimeline } = require("./reservation.service");

test("Empty value check", () => {
	const initValue = [];
	const expectValue = {
		upcomingStay: {
			numberOfUpcomingStay: 0,
			numberOfNightStay: 0,
			totalAmount: 0,
		},
		pastStay: {
			numberOfPastStay: 0,
			numberOfNightStay: 0,
			totalAmount: 0,
		},
		cancelledStay: 0,
		totalAmount: 0,
	};
	expect(guestTimeline(initValue)).toStrictEqual(expectValue);
});

test("One upcoming event check", () => {
	const initValue = [
		{
			arrivalTime: "2023-12-19T21:00:30.000Z",
			departureTime: "2023-12-21T07:00:30.000Z",
			status: "ACTIVE",
			baseAmount: 100,
			taxAmount: 25,
		},
	];
	const expectValue = {
		upcomingStay: {
			numberOfUpcomingStay: 1,
			numberOfNightStay: 1,
			totalAmount: 125,
		},
		pastStay: {
			numberOfPastStay: 0,
			numberOfNightStay: 0,
			totalAmount: 0,
		},
		cancelledStay: 0,
		totalAmount: 125,
	};
	expect(guestTimeline(initValue)).toStrictEqual(expectValue);
});

test("One past event check", () => {
	const initValue = [
		{
			arrivalTime: "2020-12-19T21:00:30.000Z",
			departureTime: "2020-12-21T07:00:30.000Z",
			status: "ACTIVE",
			baseAmount: 100,
			taxAmount: 25,
		},
	];
	const expectValue = {
		upcomingStay: {
			numberOfUpcomingStay: 0,
			numberOfNightStay: 0,
			totalAmount: 0,
		},
		pastStay: {
			numberOfPastStay: 1,
			numberOfNightStay: 1,
			totalAmount: 125,
		},
		cancelledStay: 0,
		totalAmount: 125,
	};
	expect(guestTimeline(initValue)).toStrictEqual(expectValue);
});

test("Two cancelled event check", () => {
	const initValue = [
		{
			arrivalTime: "2020-12-19T21:00:30.000Z",
			departureTime: "2020-12-21T07:00:30.000Z",
			status: "CANCELLED",
			baseAmount: 100,
			taxAmount: 25,
		},
		{
			arrivalTime: "2020-12-19T21:00:30.000Z",
			departureTime: "2020-12-21T07:00:30.000Z",
			status: "CANCELLED",
			baseAmount: 100,
			taxAmount: 25,
		},
	];

	const expectValue = {
		upcomingStay: {
			numberOfUpcomingStay: 0,
			numberOfNightStay: 0,
			totalAmount: 0,
		},
		pastStay: {
			numberOfPastStay: 0,
			numberOfNightStay: 0,
			totalAmount: 0,
		},
		cancelledStay: 2,
		totalAmount: 0,
	};
	expect(guestTimeline(initValue)).toStrictEqual(expectValue);
});
