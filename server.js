var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var cheerio = require('cheerio');

var app = express();
var port = process.env.PORT || 1338;

var maltfabriken = 'http://atapagotland.nu/exportmenu.asp?restaurantid=46&lunch=1&alacarte=0&showfullmenu=false&acurrency=:-&format=5&adate=2016-10-31&charset=ISO-8859-1';

function maltis(callback, rs) {
  request.get(maltfabriken, function (err, res, body) {
    if (!err && res.statusCode == 200) {
      var dom = cheerio.load(body);
      callback(dom('div#atapagotland_box').first().text(), rs);
    }
  });
}

// body parser middleware
app.use(bodyParser.urlencoded({
  extended: true
}));

// test route
app.use('/', express.static(__dirname + '/public'));


app.post('/lunch', function (req, res, next) {
  var userName = req.body.user_name;
  console.log(req.body);
  var botPayload = {};



  if (userName !== 'slackbot') {
    switch (req.body.text) {
      case 'lunch maltfabriken':
        maltis(function (food, rs) {
          return rs.status(200).json({
            "text": food + ' ' + ':poultry_leg:' 
          });
        }, res)

    }

  } else {
    return res.status(200).end();
  }



});

app.listen(port, function () {
  console.log('Listening on port ' + port);
});