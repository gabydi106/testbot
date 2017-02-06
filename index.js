var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 1337), function () {
  console.log('app listening on port 1337');
});

// Server default URL
app.get('/', function (req, res) {
    res.send('This is a Bot Server');
});

// Facebook Webhook
app.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === 'mybot_verify_token') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token');
    }
});

// Function to send messages
function sendMessage(recipientId, message) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};

/**
 *  POST handler to send and receive messages
 */ 
app.post('/webhook', function (req, res) {
    var events = req.body.entry[0].messaging;
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.message && event.message.text) {  
			if (!kittenMessage(event.sender.id, event.message.text)) {
				sendMessage(event.sender.id, {text: "Echo: " + event.message.text});
			}
		}
    }
    res.sendStatus(200);
});


// send rich message with kitten
function kittenMessage(recipientId, text) {

    text = text || "";
    var values = text.split(' ');

    if (values.length === 3 && values[0] === 'meow') {
        if (Number(values[1]) > 0 && Number(values[2]) > 0) {

            var imageUrl = "https://placehold.it/" + Number(values[1]) + "x" + Number(values[2]);

            message = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [{
                            "title": "Kitten",
                            "subtitle": "Cute kitten picture",
                            "image_url": "https://s-media-cache-ak0.pinimg.com/736x/27/cf/cd/27cfcd2fefc4db6d3de473e3f7c7f00b.jpg",
                            "buttons": [{
                                "type": "web_url",
                                "url": imageUrl,
                                "title": "Show kitten"
                                }, {
                                "type": "postback",
                                "title": "I like this",
                                "payload": "User " + recipientId + " likes kitten " + imageUrl,
                            }]
                        }]
                    }
                }
            };

            sendMessage(recipientId, message);

            return true;
        }
    }
	
	    else if (values.length === 3 && values[0] === 'woof') {
			if (Number(values[1]) > 0 && Number(values[2]) > 0) {

				var imageUrl = "https://placehold.it/" + Number(values[1]) + "x" + Number(values[2]);

				message = {
					"attachment": {
						"type": "template",
						"payload": {
							"template_type": "generic",
							"elements": [{
								"title": "Kitten",
								"subtitle": "Cute kitten picture",
								"image_url": "https://a.dilcdn.com/bl/wp-content/uploads/sites/8/2013/09/Gibson.jpg",
								"buttons": [{
									"type": "web_url",
									"url": imageUrl,
									"title": "Show kitten"
									}, {
									"type": "postback",
									"title": "I like this",
									"payload": "User " + recipientId + " likes kitten " + imageUrl,
								}]
							}]
						}
					}
				};

				sendMessage(recipientId, message);

				return true;
			}
		}

    return false;

};
