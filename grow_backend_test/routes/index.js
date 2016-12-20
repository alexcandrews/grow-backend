var express = require('express');
var router = express.Router();
var request = require('request');
var async = require('async');

var character_data;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


// GET characters by name
router.get('/characters/:name', function(req, res, next) {
	
	request('http://www.swapi.co/api/people/?search=' + req.params.name, function (error, response, body) {
		// if call is successful
		if (!error && response.statusCode == 200) {
			body = JSON.parse(body);
			// make sure the call returns data, error if it doesn't
			if (body.count == 0) {
				res.render('error', {
					message: "Error: invalid character",
				});
			} else {
				character_data = body.results;
    			res.render('character', {
	 				title: 'Character - ' + character_data[0].name,
	 				data: JSON.stringify(character_data)
				});
    		} 
		}
	});

});

// GET all characters (truncate to just 50)
router.get('/characters', function(req, res, next) {

	// this is the array of our data we will add to
	var character_data = [];
	// use page_counter to paginate
	var get_character_data = function(page_counter) {

		request({
			url: 'http://www.swapi.co/api/people/?page=' + page_counter
		}, function (error, response, body) {

			if(!error && response.statusCode === 200) {
				body = JSON.parse(body);
			
				// push each element in 'results' into our character array
				for (var i = 0; i < body.results.length; i++) {
					character_data.push(body.results[i]);	
				}
				// exit once we reach 50 characters
				if(character_data.length == 50) {

	                res.send(character_data);
	            } else {
					get_character_data(page_counter + 1);
				}

			} else {
				res.render('error', {
					message: "Error: invalid character",
				});
			}
		});
	}
	get_character_data(1);
});

router.get('/planetresidents', function(req, res, next) {

	request('http://www.swapi.co/api/planets', function (error, response, body) {
		if (!error && response.statusCode == 200) {
			body = JSON.parse(body);
			if (body.count == 0) {
				res.render('error', {
					message: "Error: invalid character",
				});
			} else {
				// for (var i = 0; i < body.residents.length; i++) {
					// console.log(i);
				// }
				res.send(body);
				// character_data = body.results;
    			// res.render('character', {
	 				// title: 'Character - ' + character_data[0].name,
	 				// data: JSON.stringify(character_data)
				// });
    		} 
		}
	});
});

module.exports = router;
