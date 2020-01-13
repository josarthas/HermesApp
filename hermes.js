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
const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  connectionLimit: process.env.DB_CONNLMT,
  port: process.env.DB_PORT,
  database: process.env.DB_DB
}); //no requiere seguridad extra al correr directamente sobre el servidor local.
console.log(pool);
async function asyncFunction() {
  let conn;
  console.log(conn);
  try {
    conn = await pool.getConnection();
    const res = await conn.query("INSERT INTO usuarios VALUES ( 'pruebauser','753951','prueba2','user' )", [1, "mariadb"]);
    console.log(res);
  } catch (err) {
    throw err;
    console.log(err);
  } finally {
    if (conn) return conn.end();
  }
} //entran datos una y otra vez a base de datos
app.get('/', function(soli, resp) {
  resp.render('login');
});
app.post('/login', function(soli, resp) {
      var data = {
        usuario: soli.body.usuario,
        password: soli.body.password
      }
      console.log(data);
      let conn;
      try {
        conn = pool.getConnection();
        const resp = conn.query("SELECT FROM usuarios ",



          data, [1, "mariadb"]);
      } catch (err) {
        throw (err);
        console.log(err);
      } finally {
        if (conn) return conn.end();
      }
    }
    /*new CronJob('* * * * * *', function() {
      console.log('You will see this message every second');
      console.log('Listening on port ' + listener.address().port);
    }, null, true, 'America/Los_Angeles');
    */