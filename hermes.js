const mariadb = require('mariadb'); //servidor DEBIAN, usamos mariadb
const bodyParser = require('body-parser'); //zxczxc
var mysql = require('mysql'); // Servidor CentOS, usamos mysql innodb
var CronJob = require('cron').CronJob; //para definir intervalos de tiempo de algoritmos de tendencias
var express = require('express'); //servidor web
var pug = require('pug'); //renderizado de html desde pug
var app = express(); //aplicacion interpretada
var path = require('path'); //para usar directorios fuera de views
var fs = require('fs');
var Twit = require('twit');
var tracery = require('tracery-grammar');
var stringify = require('stringify');
var listener = app.listen(8080); //puerto de hermes
var sqluserconsult = "SELECT usuario, password FROM usuarios WHERE ";
var sqlinsert = "INSERT INTO ";
require('dotenv').config();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public"))); //se define directorio externo, puede usarse para cualquier otro
app.set('view engine', 'pug');

var mariaconn = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  connectionLimit: process.env.DB_CONNLMT,
  port: process.env.DB_PORT,
  database: process.env.DB_DB,
  connectionLimit: 50
});

var loginconn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  connectionLimit: process.env.DB_CONNLMT,
  port: process.env.DB_PORT,
  database: process.env.DB_DB,
});
var APP_CONSUMER_SECRET = process.env.APP_CONSUMER_SECRET;
var APP_CONSUMER_KEY = process.env.APP_CONSUMER_KEY;

console.log(mariaconn);
/*const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  connectionLimit: process.env.DB_CONNLMT,
  port: process.env.DB_PORT,
  database: process.env.DB_DB
}); //no requiere seguridad extra al correr directamente sobre el servidor local. solo se usa con MariaDB en Debian
console.log(pool);
*/
app.get('/', function(soli, resp) {
  console.log(app);
  resp.render('login');
});
app.get('/login', function(soli, resp) {
  console.log(app);
  resp.render('login');
});
app.get('/hermes', function(soli, resp) {
  console.log(app);
  resp.render('login');
});


app.post('/login', function(soli, resp) {
  var userdb = soli.body.usuario;
  var passworddb = soli.body.password;

  console.log(app);
  var logdata = sqluserconsult.concat("usuario='", userdb, "' AND password='", passworddb, "';");
  mariaconn.query(logdata, function(err, result) {
    if (err) {
      throw err;
      console.log(result);
      if (result.length = 0) {
        if (result) {
          resp.render('/login');
        }
      }
    } else if (result.length > 0) {
      if (result)
        console.log(result);
      resp.render('./resumen');

      app.get('/resumen', function(soli, resp) {
        var counts;
        var nichos;
        mariaconn.query("SELECT usuario FROM twitter", function(err, result, fields) {
          if (err) throw err;
          counts = Object.keys(result).length;
          console.log(counts);
        });
        mariaconn.query("SELECT nicho FROM nichos", function(err, result, fields) {
          if (err) throw err;
          nichos = Object.keys(result).length;
          console.log(nichos);
        });
        resp.render('./resumen',
          counts,
          nichos
        );
      });
      app.get('/camp', function(soli, resp) {
        resp.render('./camp');
        app.post('/nicho', function(soli, resp) {
          var nichodb = soli.body.jsonnicho;
          var nichoinfo = soli.body.description;
          var insertnicho = sqlinsert.concat("nichos (nicho, resumen) VALUES ('", nichodb, "', '", nichoinfo, "');");
          mariaconn.query(insertnicho, function(err, result, fields) {
            if (error & error != "ER_DUP_ENTRY") {
              resp.render('./camp');
            }
          });
          resp.render('./camp');
        });
        console.log(app);
      });



      app.get('/consulta', function(soli, resp) {
        mariaconn.query("SELECT usuario, password, telefonos_numero FROM twitter", function(err, result, fields) {
          if (err) throw err;
          console.log(result);
          resp.render('./consulta', {
            twitters: result
          });
        });
      });

    }
  });
});
/*new CronJob('* * * * * *', function() {
  console.log('You will see this message every second');
  console.log('Listening on port ' + listener.address().port);
}, null, true, 'America/Los_Angeles');
*/