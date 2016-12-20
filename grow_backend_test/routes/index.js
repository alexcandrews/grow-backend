var express = require('express');
var router = express.Router();
var request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/characters', function(req, res, next) {
  var test_res = res;
  for (var i = 0; i < 3; i++) {
  	request({
    	uri: 'http://www.swapi.co/api/people/'+i,
    	qs: {
      	// api_key: '123456',
      	// query: 'World of Warcraft: Legion'
    	}
  	}).pipe(test_res);
  }
  res = test_res;
});


// GET about page
router.get('/about', function(req, res){
  res.render('about', {
    title: 'About'
  });
});

module.exports = router;
