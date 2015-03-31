var express = require('express');
var router = express.Router();
var finder = require('../finder/finder');

/* GET home page. */
router.get('/', function(req, res) {
	var results = null;
	if (req.query["search"]) {
		results = finder(req.body["search"]);
	}
	res.render('index', {title: 'Bars finder', results: results, query: req.query["search"]});
});

module.exports = router;
