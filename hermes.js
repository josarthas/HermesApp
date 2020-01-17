const mariadb = require('mariadb'); //servidor linux, usamos mariadb
const bodyParser = require("body-parser"); //zxczxc
var CronJob = require('cron').CronJob; //para definir intervalos de tiempo de algoritmos de tendencias
var express = require('express'); //servidor web
var pug = require('pug'); //renderizado de html desde pug
var app = express(); //aplicacion interpretada
var path = require('path'); //para usar directorios fuera de views
var fs = require('fs');
var listener = app.listen(8080); //puerto de hermes
require('dotenv').config();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public"))); //se define directorio externo, puede usarse para cualquier otro
app.set('view engine', 'pug');



var mariaconn = mariadb.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  connectionLimit: process.env.DB_CONNLMT,
  port: process.env.DB_PORT,
  database: process.env.DB_DB
});

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  connectionLimit: process.env.DB_CONNLMT,
  port: process.env.DB_PORT,
  database: process.env.DB_DB
}); //no requiere seguridad extra al correr directamente sobre el servidor local.
console.log(pool);

app.get('/', function(soli, resp) {
  resp.render('login');
});

app.post('/login', function(soli, resp) {
  var data = {
    usuario: soli.body.usuario,
    password: soli.body.password
  }
  resp.render('layout');
});
/*new CronJob('* * * * * *', function() {
  console.log('You will see this message every second');
  console.log('Listening on port ' + listener.address().port);
}, null, true, 'America/Los_Angeles');
*/



mariaconn.connect(function(err)) {
    mariaconn => {
      mariaconn.query("SELECT * FROM usuarios WHERE usuario = ", +Park Lane 38, function(err, result) {
        if (err) throw err;
        console.log(result);
      });
    }
  }
  .catch(err => {
    //handle connection error
  });
}