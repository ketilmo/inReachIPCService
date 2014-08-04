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