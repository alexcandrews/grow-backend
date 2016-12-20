var express = require('express');
var router = express.Router();
var request = require('request');
var async = require('async');

var character_data;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/characters/:name', function(req, res, next) {
	
	request('http://www.swapi.co/api/people/?search=' + req.params.name, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			body = JSON.parse(body);
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



router.get('/characters', function(req, res, next) {
	
	request('http://www.swapi.co/api/people', function (error, response, body) {
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

router.get('/planetresidents', function(req, res, next) {

	
});

module.exports = router;
