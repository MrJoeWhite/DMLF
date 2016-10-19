var express = require('express');
var router = express.Router();

/* GET GHR listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
