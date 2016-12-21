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


var sort_characters = function(sort_by, character_data) {
	// sort by specified parameter
	if (sort_by == 'height') {
		character_data.sort(function(a, b) {
			return a.height - b.height;
		});
	} else if (sort_by == 'mass') {
		character_data.sort(function(a, b) {
			return a.mass - b.mass;
		});
	} else if (sort_by == 'name') {
		character_data.sort(function(a, b) {
			var nameA = a.name.toUpperCase(); // ignore upper and lowercase
			var nameB = b.name.toUpperCase(); // ignore upper and lowercase
			if (nameA <= nameB) {
				return -1;
			}
			if (nameA > nameB) {
			    return 1;
			}
		});
	}
	// default return the same list
	return character_data;
};

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
					// get sorted list
					character_data = sort_characters(req.query.sort, character_data);
	                res.send(character_data);
	            } else {
					get_character_data(page_counter + 1);
				}

			} else {
				res.render('error', {
					message: "Error:",
				});
			}
		});
	}
	get_character_data(1);
});

var create_planet_resident_obj = function(res, planet_data, resident_data) {

	var planet_resident_data = {};

	// for each planet in planet_data
	for (var i = 0; i < planet_data.length; i++) {
		var residents = [];
		// for each resident in planet
		for (var j = 0; j < planet_data[i]['residents'].length; j++) {
			// get each residents url
			var url = planet_data[i]['residents'][j];
			// find the matching resident url
			var resident_url = resident_data.filter(function( obj ) {
				return obj['url'] == url;
			});
			residents.push(resident_url[0]['name']);
		}
		planet_resident_data[planet_data[i]['name']] = residents;
	}
	// display the data
	res.send(planet_resident_data);
}

// GET all planets, and each resident for each planet
router.get('/planetresidents', function(req, res, next) {

	// this is the array of our data we will add to
	var planet_data = [];
	var resident_data = [];

	var get_resident_data = function(page_counter, planet_data) {
		request({
			url: 'http://www.swapi.co/api/people/?page=' + page_counter
		}, function (error, response, body) {

			if(!error && response.statusCode === 200) {
				body = JSON.parse(body);
			
				// push each element in 'results' into our character array
				for (var i = 0; i < body.results.length; i++) {
					resident_data.push(body.results[i]);	
				}
				// exit once we reach 50 characters
				if(resident_data.length == 87) {
					create_planet_resident_obj(res, planet_data, resident_data);	                
	                // res.send(planet_data);
	            } else {
					get_resident_data(page_counter + 1, planet_data);
				}

			} else {
				res.render('error', {
					message: "Error:",
				});
			}
		});
	}

	// use page_counter to paginate
	var get_planet_data = function(page_counter) {

		request({
			url: 'http://www.swapi.co/api/planets/?page=' + page_counter
		}, function (error, response, body) {

			if(!error && response.statusCode === 200) {
				body = JSON.parse(body);

				for (var i = 0; i < body.results.length; i++) {
					planet_data.push(body.results[i]);
				}

				if(body.results.length < 10) {
	                get_resident_data(1, planet_data);
	                // res.send(planet_data);
	            } else {
					get_planet_data(page_counter + 1);
				}
			} else {
				res.render('error', {
					message: "Error: invalid character",
				});
			}
		});
	}
	get_planet_data(1);	

});

module.exports = router;
