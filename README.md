ReadMe file

1.Project Title
	API for managing hotel reservation
2.Project Description:
To develop API using node js( version 14 or higher) to manage hotel reservation   

3.Getting Started
3.1 Prerequisites 
	->VS Code application
	-> Node js software
	-> Postman application
3.2 To run the application

	-> clone the application to local machine
	->npm install
	->npm run dev ( To run application in dev environment)

The application starts running at port 8080

4.API ENDPOINTS:

4.1 An endpoint for retrieving all reservations

Method: GET
Endpoint: http://localhost:8080/api/v1/reservation
Response : [
    {
        “reservationId”: “63ac89039a27194eec253894",
        “hotel”: “HOTEL”,
        “guestId”: “63ac89039a27194eec253896",
        “guestName”: “Krishna”,
        “arrivalTime”: “2021-05-05T00:00:00.000Z”,
        “departureTime”: “2021-05-12T00:00:00.000Z”,
        “status”: “ACTIVE”,
        “baseAmount”: 100,
        “taxAmount”: 25
    }
]

4.2An endpoint for retrieving reservation by Id
Method: GET
Endpoint: http://localhost:8080/api/v1/reservation/:reservationId
Request:http://localhost:8080/api/v1/reservation/63ac89039a27194eec253894
Response : [
    {
        “reservationId”: “63ac89039a27194eec253894",
        “hotel”: “HOTEL”,
        “guestId”: “63ac89039a27194eec253896",
        “guestName”: “Krishna”,
        “arrivalTime”: “2021-05-05T00:00:00.000Z”,
        “departureTime”: “2021-05-12T00:00:00.000Z”,
        “status”: “ACTIVE”,
        “baseAmount”: 100,
        “taxAmount”: 25
    }
]

4.3 An Endpoint for creating reservation
Method:POST
Endpoint: http://localhost:8080/api/v1/reservation
Request Body:{
    “guestName”: “Krishna”,
    “arrivalTime”: “2021-05-05",
    “departureTime”:  “2021-05-12"
}

Response:{
    “reservationId”: “63ac89039a27194eec253894",
    “hotel”: “HOTEL”,
    “guestId”: “63ac89039a27194eec253896",
    “guestName”: “Krishna”,
    “arrivalTime”: “2021-05-05T00:00:00.000Z”,
    “departureTime”: “2021-05-12T00:00:00.000Z”,
    “status”: “ACTIVE”,
    “baseAmount”: 100,
    “taxAmount”: 25
}

4.4 An Endpoint for cancelling reservation
Method:POST
Endpoint:http://localhost:8080/api/v1/reservation/cancelling/:reservationId

Request:http://localhost:8080/api/v1/reservation/cancelling/63ac89039a27194eec253894
Response:
{
    “reservationId”: “63ac89039a27194eec253894",
    “hotel”: “HOTEL”,
    “guestId”: “63ac89039a27194eec253896",
    “guestName”: “Krishna”,
    “arrivalTime”: “2021-05-05T00:00:00.000Z”,
    “departureTime”: “2021-05-12T00:00:00.000Z”,
    “status”: “ACTIVE”,
    “baseAmount”: 100,
    “taxAmount”: 25
}

4.4 An Endpoint for retrieving guest stay summary
Method:GET
Endpoint:: http://localhost:8080/api/v1/reservation/guest/:guestId
Request:http://localhost:8080/api/v1/reservation/63ac89039a27194eec253896
Response:{
    “upcomingStay”: {
        “numberOfUpcomingStay”: 0,
        “numberOfNightStay”: 0,
        “totalAmount”: 0
    },
    “pastStay”: {
        “numberOfPastStay”: 1,
        “numberOfNightStay”: 7,
        “totalAmount”: 125
    },
    “cancelledStay”: 0,
    “totalAmount”: 125,
    “guestId”: “63ac89039a27194eec253896"
}

4.5 An endpoint to search for stay that span a date range
METHOD:GET
Endpoint:http://localhost:8080/api/v1/reservation?fromDate=2023-05-01&toDate=2023-05-30
Response:[
    {
        “reservationId”: “63ac7082fd1458e97d1a3bde”,
        “hotel”: “HOTEL”,
        “guestId”: “63ac7039fd1458e97d1a3bda”,
        “guestName”: “Krishna”,
        “arrivalTime”: “2023-05-05T00:00:00.000Z”,
        “departureTime”: “2023-05-12T00:00:00.000Z”,
        “status”: “ACTIVE”,
        “baseAmount”: 100,
        “taxAmount”: 25
    }
]

4.6Health API to check application health

Method:GET
Endpoint:http://localhost:8080/api/v1/health
Response:{
    “uptime”: 28.314908958,
    “responseTime”: [
        43697,
        875009000
    ],
    “message”: “OK”,
    “date”: “2022-12-28T16:49:06.280Z”
}


5.To test the application
	-> npm run test
