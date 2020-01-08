//
const mariadb = require('mariadb'); //servidor linux, usamos mariadb
var CronJob = require('cron').CronJob; //para definir intervalos de tiempo de algoritmos de tendencias
var express = require('express'); //servidor web
var pug = require('pug'); //renderizado de html desde pug
var app = express(); //aplicacion interpretada
var listener = app.listen(8080); //puerto de hermes
var path = require('path'); //para usar directorios fuera de views
const pool = mariadb.createPool({ //conexion sql/mariadb
  host: 'localhost',
  user: 'josarthas',
  password: 'ID11135PrisciLiz',
  connectionLimit: 5,
  port: 3306
}); //no requiere seguridad extra al correr directamente sobre el servidor local.
async function asyncFunction() {
  let conn;
  try {
    conn = await pool.getConnection();
    const connec = await conn.query("USE hermes");
    console.log(connec);
    const res = await conn.query("INSERT INTO usuarios VALUES ( 'pruebauser','753951','prueba2','user' )", [1, "mariadb"]);
    console.log(res);
  } catch (err) {
      throw err;
      console.log(err);
  } finally {
    if (conn) return conn.end();
  }
} //entran datos una y otra vez a base de datos

app.use(express.static(path.join(__dirname, "public"))); //se define directorio externo, puede usarse para cualquier otro
app.set('view engine', 'pug'); //
app.get('/', function(soli, resp) {
  resp.render('layout');
}); //


/*new CronJob('* * * * * *', function() {
  console.log('You will see this message every second');
  console.log('Listening on port ' + listener.address().port);
}, null, true, 'America/Los_Angeles');
*/
