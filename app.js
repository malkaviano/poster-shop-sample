'use strict';

require('dotenv').config();

const express = require('express'),
      app = express(),
      path = require('path'),
      bodyParser = require('body-parser'),
      request = require('superagent'),
      port = process.env.PORT
;

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/search/:query', function(req, res) {
  const url = `https://api.gettyimages.com/v3/search/images`;

  request.get(url)
    .query({ phrase: req.params.query })
    .set('Api-Key', process.env.API_KEY)
    .end((err, result) => {
      if(err) {
        console.log(`Error: ${err}`);

        return;
      }

      res.send(result.body.images.map(item => (
          { 
            id: item.id,
            title: item.title, 
            price: 9.99,
            link: item.display_sizes[0].uri
          }
        ))
      );
    });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})