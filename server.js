var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var cheerio = require('cheerio');

var app = express();
var port = process.env.PORT || 1338;

var maltfabriken = 'http://atapagotland.nu/exportmenu.asp?restaurantid=46&lunch=1&alacarte=0&showfullmenu=false&acurrency=:-&format=5&adate=2016-10-31';


// body parser middleware
app.use(bodyParser.urlencoded({
  extended: true
}));

// test route
app.use('/', express.static(__dirname + '/public'));


app.post('/lunch', function (req, res, next) {
  var userName = req.body.user_name;
  var botPayload = {};

  switch (req.body.text) {
    case 'maltfabriken':
      request(maltfabriken, function (err, res, body) {
        if (!err && res.statusCode == 200) {
          let $ = cheerio.load(body);
          botPayload.text = $('div.atapagotland_lunchtitle').first().text();
        }
      });

      break;
  }

  // Loop otherwise..
  if (userName !== 'slackbot') {
    return res.status(200).json(botPayload);
  } else {
    return res.status(200).end();
  }
});

app.listen(port, function () {
  console.log('Listening on port ' + port);
});