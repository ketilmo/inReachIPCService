// Force the the test environment
process.env.NODE_ENV = 'test';

var restify = require('restify');
var should = require('should');

// Application dependencies
var app = require('../app.js');

// Generate payload object that can be customized later.
function generateInReachPayload(numberOfEvents)
{
 var inReachPayload = { 
	Version :"1.0",
	Events : []
		};


	if (!numberOfEvents || numberOfEvents < 1) 
	{
		numberOfEvents = 1;
	}

	for (var i=0; i < numberOfEvents; i++)
	{
		inReachPayload.Events.push(

			{ 
				addresses : [],
				imei : 300234010961140,
				messageCode : 14,
				freeText : "Hello world!",
				timeStamp : (new Date).getTime(), // Set a fresh date here in Epoch format.
				point:
					{
						latitude : 60.3729736804962,
						longitude : 5.37759304046631,
						altitude : 310,
						gpsFix : 2,
						course : 180,
						speed : 12
					},
				status :
					{
						autonomous : 0,
						lowBattery : 0,
						intervalChange : 0
					}
				}
		);
	}	

	return inReachPayload;

}


var client = restify.createJsonClient({
    version: '*',
    url: 'http://127.0.0.1:3600'
});

describe('\r\nWhen using the inReach Inbound API,', function()
{

	describe('accessing the POST URI via HTTP GET', function()
	{

		it('should return status code 405 Not Allowed', function(done) {
			client.get('/api/v1/post/inreach', function(err, req, res, data) {
                res.should.have.status(405);
                done();
            });
		});

		it('should return the message {\"error\":\"Not allowed\"}', function(done) {
			client.get('/api/v1/post/inreach', function(err, req, res, data) {
				err.body.error.should.equal('Not allowed');
                done();
            });
		});
	});

	describe('posting a valid payload', function()
	{
		it('should return code 200 if everything went fine', function(done) {
			var validInReachPayload = generateInReachPayload();
			client.post('/api/v1/post/inreach', validInReachPayload, function(err, req, res, obj) {
  				res.should.have.status(200);
  				done();
			});

		});

		it('should return a receipt of the submitted data as valid json', function(done) {
			var validInReachPayload = generateInReachPayload();
			client.post('/api/v1/post/inreach', validInReachPayload, function(err, req, res, obj) {
  				res.should.be.json;
  				done();
			});

		});


		it('should return the processed values, and they should match the posted ones', function(done) {
			var validInReachPayload = generateInReachPayload();
			client.post('/api/v1/post/inreach', validInReachPayload, function(err, req, res, obj) {
  				var apiResponse = JSON.parse(res.body);
  				for (var i=0; i < apiResponse.length; i++){
  					new Date(apiResponse[i].timeStamp).toString().should.equal(new Date(parseInt(validInReachPayload.Events[i].timeStamp)).toString(), 'Returned timeStamp doesn\'t match posted timeStamp.');
  					apiResponse[i].trackerId.should.equal(validInReachPayload.Events[i].imei, 'Returned trackerId doesn\'t match posted imei.');
  					apiResponse[i].messageCode.should.equal(validInReachPayload.Events[i].messageCode, 'Returned messageCode doesn\'t match posted messageCode.');
  					apiResponse[i].message.should.equal(validInReachPayload.Events[i].freeText, 'Returned message doesn\'t match posted freeText');
  					apiResponse[i].location.longitude.should.equal(validInReachPayload.Events[i].point.longitude, 'Returned longitude doesn\'t match posted longitude.');
  					apiResponse[i].location.latitude.should.equal(validInReachPayload.Events[i].point.latitude, 'Returned latitude doesn\'t match posted latitude.');
  					apiResponse[i].altitude.should.equal(validInReachPayload.Events[i].point.altitude, 'Returned altitude doesn\'t match posted altitude.');
  					apiResponse[i].course.should.equal(validInReachPayload.Events[i].point.course, 'Returned course doesn\'t match posted course.');
  					apiResponse[i].speed.should.equal(validInReachPayload.Events[i].point.speed, 'Returned speed doesn\'t match posted speed.');
  				}
  				done();
			});

		});


		it('should accept payloads with a single Event', function(done) {
			var validInReachPayload = generateInReachPayload();
			client.post('/api/v1/post/inreach', validInReachPayload, function(err, req, res, obj) {
				res.should.be.json;
  				done();
			});

		});

		it('should accept payloads with a multiple Events', function(done) {
			var validInReachPayload = generateInReachPayload(3);
			client.post('/api/v1/post/inreach', validInReachPayload, function(err, req, res, obj) {
				res.should.be.json;
  				done();
			});

		});
	});

	describe('posting an invalid payload', function()
	{
		it('should return response code 400 if the imei number is not numeric', function(done) {
			var validInReachPayload = generateInReachPayload();
			validInReachPayload.Events[0].imei = "abcdefghijklmno";
			client.post('/api/v1/post/inreach', validInReachPayload, function(err, req, res, obj) {
				res.should.have.status(400);
  				done();
			});

		});

		it('should return response code 400 if the imei number is not exactly 15 characters long', function(done) {
			var validInReachPayload = generateInReachPayload();
			validInReachPayload.Events[0].imei = "123456789";
			client.post('/api/v1/post/inreach', validInReachPayload, function(err, req, res, obj) {
				res.should.have.status(400);
  				done();
			});
		});

		it('should return response code 400 if the latitude is not numeric', function(done) {
			var validInReachPayload = generateInReachPayload();
			validInReachPayload.Events[0].point.latitude = "abc";
			client.post('/api/v1/post/inreach', validInReachPayload, function(err, req, res, obj) {
				res.should.have.status(400);
  				done();
			});
		});

		it('should return response code 400 if the longitude is not numeric', function(done) {
			var validInReachPayload = generateInReachPayload();
			validInReachPayload.Events[0].point.longitude = "def";
			client.post('/api/v1/post/inreach', validInReachPayload, function(err, req, res, obj) {
				res.should.have.status(400);
  				done();
			});
		});

		it('should return response code 400 if the longitude is not numeric', function(done) {
			var validInReachPayload = generateInReachPayload();
			validInReachPayload.Events[0].point.longitude = "def";
			client.post('/api/v1/post/inreach', validInReachPayload, function(err, req, res, obj) {
				res.should.have.status(400);
  				done();
			});
		});

		it('should return response code 400 if the altitude is not numeric', function(done) {
			var validInReachPayload = generateInReachPayload();
			validInReachPayload.Events[0].point.altitude = "ghi";
			client.post('/api/v1/post/inreach', validInReachPayload, function(err, req, res, obj) {
				res.should.have.status(400);
  				done();
			});
		});

		it('should return response code 400 if the course is not numeric', function(done) {
			var validInReachPayload = generateInReachPayload();
			validInReachPayload.Events[0].point.course = "jkl";
			client.post('/api/v1/post/inreach', validInReachPayload, function(err, req, res, obj) {
				res.should.have.status(400);
  				done();
			});
		});

		it('should return response code 400 if the speed is not numeric', function(done) {
			var validInReachPayload = generateInReachPayload();
			validInReachPayload.Events[0].point.speed = "mno";
			client.post('/api/v1/post/inreach', validInReachPayload, function(err, req, res, obj) {
				res.should.have.status(400);
  				done();
			});
		});

		it('should return response code 400 if the messageCode is not numeric', function(done) {
			var validInReachPayload = generateInReachPayload();
			validInReachPayload.Events[0].messageCode = "pqr";
			client.post('/api/v1/post/inreach', validInReachPayload, function(err, req, res, obj) {
				res.should.have.status(400);
  				done();
			});
		});

		it('should return response code 400 if the timeStamp is not a valid date', function(done) {
			var validInReachPayload = generateInReachPayload();
			validInReachPayload.Events[0].timeStamp = "17/18/";
			client.post('/api/v1/post/inreach', validInReachPayload, function(err, req, res, obj) {
				res.should.have.status(400);
  				done();
			});
		});

		it('should return response code 400 if the payload does not contain any Events', function(done) {
			var validInReachPayload = { empty: 0 };
			client.post('/api/v1/post/inreach', validInReachPayload, function(err, req, res, obj) {
				res.should.have.status(400);
  				done();
			});
		});

	});
});