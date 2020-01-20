const mariadb = require('mariadb'); //servidor linux, usamos mariadb
const bodyParser = require('body-parser'); //zxczxc
var mysql = require('mysql');
var CronJob = require('cron').CronJob; //para definir intervalos de tiempo de algoritmos de tendencias
var express = require('express'); //servidor web
var pug = require('pug'); //renderizado de html desde pug
var app = express(); //aplicacion interpretada
var path = require('path'); //para usar directorios fuera de views
var fs = require('fs');
var Twit = require('twit');
var tracery = require('tracery-grammar');
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
var sqluserconsult = "SELECT usuario, password FROM usuarios WHERE ";

console.log(mariaconn);

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
  console.log(app);
  resp.render('login');
});
app.get('/consulta', function(soli, resp) {
  console.log(app);
  resp.render('consulta');
});
app.get('/resumen', function(soli, resp) {
  console.log(app);
  resp.render('resumen');
});
app.get('/login', function(soli, resp) {
  console.log(app);
  resp.render('login');
});


app.post('/login', function(soli, resp) {
  var userdb = soli.body.usuario;
  var passworddb = soli.body.password;
  console.log(app);

  mariaconn.connect(function(err) {
    if (err) throw err;
    con.query(sqluserconsult, "usuario=", userdb, "AND password=", passworddb, function(err, result) {
      if (err) {
        throw err;
        console.log(result);
        resp.render('/login');
      } else
        resp.render('/layout');
    })
  });
});

/*new CronJob('* * * * * *', function() {
  console.log('You will see this message every second');
  console.log('Listening on port ' + listener.address().port);
}, null, true, 'America/Los_Angeles');
*/



/*mariaconn.connect(function(err));
mariaconn => {
  mariaconn.query("SELECT * FROM usuarios WHERE usuario = ", +Park Lane 38, function(err, result) {
    if (err) throw err;
    console.log(result);
  });
}
}
.catch(err => {
  //handle connection error
});*/