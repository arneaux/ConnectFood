var express = require('express');
var pg = require('pg');
var app = express();

const path = require('path');
const clientBuildDir = __dirname + '/../../client/dist/';

app.set('port', (process.env.PORT || 5000));

app.use(express.static(clientBuildDir));

//app.use(express.static(__dirname + '/../../public'));

// views is directory for all template files
//app.set('views', __dirname + '/../../views/');
app.set('view engine', 'ejs');

app.get('/times', function(request, response) {
  var result = '';
  var times = process.env.TIMES || 5;
  for (var i = 0; i < times; i++)
    result += i + ' ';
  response.send(result);
});

app.get('/db', function(request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    if (err) {
	console.error(err);
	response.send('Error ' + err);
	return;
    }
    client.query('SELECT * FROM test_table;', function(err, result) {
      done();
      if (err) {
        console.error(err);
	response.send('Error ' + err);
      }
      else {
        response.render('pages/db', {results: result.rows});
      }
    });
  });
});

app.get('*', function (request, response) {
      response.sendFile(path.join(clientBuildDir + '/index.html'));
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


