//importing node framework
var express = require('express');

const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: '192.168.0.23',
    port: '3306', 
    user:'api', 
    password: 'mongotenner',
    connectionLimit: 5,
    database: 'tracker',
});

var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, cache-control");
  next();
});

app.get('/test/', function (req, res) {
 
  console.log('test API call');

  res.send('test ok');

});


app.get('/tick/:stationid/:tagid', function (req, res) {
 
  let conn;

  conn = pool.getConnection()
    .then(conn => {
        conn.query("INSERT INTO tick (stationId,tagId) values (" + req.params.stationid + ",'" + req.params.tagid + "')")
          .then(sql => {
            conn.end();
            res.send('1');
          })
          .catch(err =>{
            console.log('Insert sql error', err);
            conn.end();
            res.send('0');
        });
        
    })
    .catch(err =>{
        console.log('unhandledRejection', err);
        conn.end();
        res.send('0');
    })

});

app.get('/get/ticks/:limit',async function(req,res){
  
  conn = await pool.getConnection();
	const rows = await conn.query({ rowsAsArray: true, sql: 'select * from tick order by id desc limit ' + req.params.limit  });
  console.log(rows); //[ {val: 1}, meta: ... ]
  conn.end();

  var ticks= new Array();

  rows.forEach(element => {
    ticks.push({
      id: element[0],
      location: element[1],
      tag: element[2],
      datetime: element[3]
    })
  });

  res.contentType('application/json');
  res.send(JSON.stringify(ticks));


});

//listen to port 3000 by default
app.listen(process.env.PORT || 3011);

console.log('listening on port 3011')

module.exports = app;