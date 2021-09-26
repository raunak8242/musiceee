const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const client_id = 'ae5d08f3eec64ec7bf267238a7b0d269';
const client_secret = 'a0694baba7174b7e851c4c19abee6976';

const app = express();

app.use(express.static("public"));


app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/front.html');
})
app.post('/', function(req, res) {
const name = encodeURI(req.body.input);

var options = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
  },
  form: {
    grant_type: 'client_credentials'
  },
  json: true
};

request.post(options, function(error, response, body) {
  if (!error && response.statusCode === 200) {
    // "https://api.spotify.com/v1/search?q=tania%20bowra&type=artist"

    // use the access token to access the Spotify Web API
    var token = body.access_token;
    var options1 = {
      url: 'https://api.spotify.com/v1/search?q='+name+'&type=artist&offset=0&limit=20',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      json: true
    };
    request.get(options1, function(error, response, body) {
       const link = body.artists.items[0].external_urls.spotify;
       res.redirect(link);
      // console.log(body.artists.items[0].external_urls.spotify);

    });
  }
});
});


app.listen(process.env.PORT || 3000, function(){
  console.log("M ready sweetheart");
})