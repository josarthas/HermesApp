//Requerimientos de los Frameworks de Node, usamos varios para la renderización y correcta visualización de nuestra APP
// const mariadb = require('mariadb'); //servidor DEBIAN, usamos mariadb
var mysql = require('mysql'); // Servidor CentOS, usamos mysql innodb
const bodyParser = require('body-parser'); //sacamos data de los forms
var CronJob = require('cron').CronJob; //para definir intervalos de tiempo de algoritmos de tendencias
var express = require('express'); //servidor web
const fileUpload = require('express-fileupload'); //subida de archivos
var app = express(); //Entorno de servidor
var pug = require('pug'); //renderizado de html desde pug
var app = express(); //aplicacion interpretada
var path = require('path'); //para usar directorios fuera de views
var fs = require('fs'); //filesystem
var glob = require('glob');
var Twit = require('twit'); //Conexión a la API de Twitter, necesitamos crear esta conexión con los tokens creados automáticamente
var tracery = require('tracery-grammar'); //Herramienta de expansión de nichos
var stringify = require('stringify'); // para hacer string nuestros JSON
var listener = app.listen(8080); //puerto de hermes
var formidable = require('formidable'); //Archivos de nicho
var multer = require('multer'); //
//Configuramos para el uso de express, .env y directorios publicos
require('dotenv').config(); //Para leer el archivo ".env" donde guardamos los datos de configuracion y accesos de base de datos y APP
app.use(bodyParser.urlencoded({
  extended: true
})); //scar datos de los cuerpos de forms en pug
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public"))); //se define directorio externo, puede usarse para cualquier otro
app.set('view engine', 'pug');
app.locals.moment = require('moment');
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
  safeFileNames: true,
  preserveExtension: 4
}));
// variables globales que vamos a usar
var sqluserconsult = "SELECT usuario, password FROM usuarios WHERE ";
var selectquerytoken = "SELECT access_token,access_token_secret FROM twitter WHERE usuario='";
var selectnicho = "SELECT json FROM nichos WHERE nicho='";
var sqlinsert = "INSERT INTO ";
var datediffs = "SELECT DATEDIFF ('";
var selprop = "SELECT propag FROM campaign WHERE nicho='";
var insertcamp;
var twitterx;
var nichox;
var telefonox;
var campaignx;
var twitters;
var nichos;
var telefonos;
var userdb;
var passworddb;
var tokens;
var counts;
var nichodb;
var nichoinfo;
var nichopath;
var newpath;
var nichos;
var T;
var timerange;
var nicholeido;
var rawGrammar;
var processedGrammar;
var tweet;
var diffs;
var nichotracery;
var inidate;
var findate;
var ACCESS_TOKEN;
var ACCESS_TOKEN_SECRET;
//datos que se leen desde el archivo .env
var APP_CONSUMER_SECRET = process.env.APP_CONSUMER_SECRET;
var APP_CONSUMER_KEY = process.env.APP_CONSUMER_KEY;
var NICHOS_PATH = process.env.NICHOS_PATH;
//Conexion de base de datos, puede servir para cualquier base de datos relacional Tipo SQL, MongoDB no es recomendable en lo absoluto
//Se llama maria por que originalmente estaba planeada a ser ejecutada desde el servidor en Global, no un VPS
//Debian trae por Default MariaDB, base de datos tipo sql but it's free
//En este caso usamos un Pool de conexiones, para evitarnos cerrar cada conexion en cada funcion.
var mariaconn = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  connectionLimit: process.env.DB_CONNLMT,
  port: process.env.DB_PORT,
  database: process.env.DB_DB,
  connectionLimit: 50
});
//Funcioncilla para poder pasar fechas JS a MySQL
function twoDigits(d) {
  if (0 < d && d < 10) return "0" + d.toString();
  if (-10 < d && d < 0) return "-0" + (-1 * d).toString();
  return d.toString();
}
Date.prototype.toMysqlFormat = function() {
  return this.getFullYear() + "-" + twoDigits(1 + this.getMonth()) + "-" + twoDigits(this.getDate()) + " " + twoDigits(this.getHours()) + ":" + twoDigits(this.getMinutes()) + ":" + twoDigits(this.getSeconds());
};
console.log(mariaconn);
/*/función de conexion básica a twitter, también es el prototipo básico de llamada a la base, le mandamos un query en sqly nos regresa error, resultado y campos*/

// 3 direcciones accesibles para Hermes, debe configurarse cada una de las direcciones expresadas en el reenvio de puertos del VPS
app.get('/login', function(soli, resp) {
  resp.render('login');
});
app.get('/', function(soli, resp) {
  resp.render('login');
});
app.get('/hermes', function(soli, resp) {
  resp.render('login');
});
//A partir de aquí todo llamado desde app debe ser metido dentro de post, que es nuestro inicio de sesión.
//sin inicio de sesión previo, no es posible entrar a ninguna función del programa y nos debe enviar un error "Can't GET /"
//Dicho error nos es enviado por express diciendonos que no es posible obtener una página, pues no hemos hecho el método POST de Login.
app.post('/login', function(soli, resp) {
  userdb = soli.body.usuario;
  passworddb = soli.body.password;
  var logdata = sqluserconsult.concat("usuario='", userdb, "' AND password='", passworddb, "';");
  mariaconn.query(logdata, function(err, result) {
    //errores, regresan en loop infinito al login hasta que haya match de contraseña y usuario
    if (err) {
      throw err;
      console.log(result);
      resp.render('/login');
      if (result.length = 0) {
        if (result) {
          resp.render('/login');
        }
      }
    } else if (result.length > 0) {
      console.log('Conexxion API Twitter');
      console.log(APP_CONSUMER_KEY);
      console.log(APP_CONSUMER_KEY);
      console.log(ACCESS_TOKEN);
      console.log(ACCESS_TOKEN_SECRET);

      //si no hay errores, hacemos consulta básica para la pestaña resumen y las tarjetas de control.
      //las consultas se realizan desde el inicio de la aplicacion
      console.log(result);
      mariaconn.query("SELECT nicho FROM nichos", function(err, result, fields) {
        if (err) throw err;
        nichos = Object.keys(result).length;
        console.log('Nichos guardados:');
        console.log(nichos);
      });
      //Cosulta Twitter
      mariaconn.query("SELECT usuario, password, telefonos_numero FROM twitter", function(err, result, fields) {
        if (err) throw err;
        console.log("Consulta twitter:");
        console.log(result);
        twitterx = result;
      });

      mariaconn.query("SELECT serie_sim,company,numero FROM telefonos", function(err, result, fields) {
        if (err) throw err;
        console.log("Consulta: numeros");
        console.log(result);
        telefonox = result;
      });

      mariaconn.query("SELECT usuario FROM twitter", function(err, result, fields) {
        if (err) throw err;
        counts = Object.keys(result).length;
        console.log('Usuarios verificados:');
        console.log(counts);
      });

      mariaconn.query("SELECT nicho, resumen FROM nichos", function(err, result, fields) {
        if (err) throw err;
        console.log("Consulta nichos:");
        console.log(result);
        nichox = result;
      });

      mariaconn.query("SELECT nombre, nicho, propag, tipo, inicio, cuentas, fin FROM campaign", function(err, result, fields) {
        if (err) throw err;
        console.log("Consulta campañas:");
        console.log(result);
        campaignx = result;
      });
      //y luego hacemos el render del layout principal
      resp.render('./layout');
      //dentro del layout definimos toda función de posteo, consulta y
      app.get('/resumen', function(soli, resp) {
        fcounts = JSON.stringify({
          countss: counts,
          nichoss: nichos
        });
        console.log('cuenta para resumen:');
        console.log(fcounts);
        resp.render('./resumen', {
          countsx: fcounts
        });
      });
      //MAndar rnder de campaña nueva
      app.get('/newcamp', function(soli, resp) {
        console.log('campaña pedida');
        resp.render('./newcamp', {
          nichos: nichox
        });
      });
      //mandar rndr d campaña unitaria
      app.get('/unita', function(soli, resp) {
        console.log('cUnitaria pedida');
        resp.render('./unita', {
          nichos: nichox,
          twitters: twitterx

        });
      });
      //rndrs de cnslta
      app.get('/viewcamp', function(soli, resp) {
        mariaconn.query("SELECT nombre, nicho, propag, tipo, inicio, cuentas, fin FROM campaign", function(err, result, fields) {
          if (err) throw err;
          console.log("Consulta campañas:");
          console.log(result);
          campaignx = result;
        });
        console.log('Cons cmpaña pedida');
        resp.render('./viewcamp', {
          campaigns: campaignx
        });
      });
      /*switch () {
        case x:
          // code block
          break;
        case y:
          // code block
          break;
        default:
          // code block
      }*/
      app.get('/twitter', function(soli, resp) {
        console.log('TWitter seleccionado');
        console.log(twitterx);
        resp.render('./consultatw', {
          twitters: twitterx
        });
      });
      app.get('/nichos', function(soli, resp) {
        console.log('nichos seleccionado');
        mariaconn.query("SELECT nicho, resumen FROM nichos", function(err, result, fields) {
          if (err) throw err;
          console.log("Consulta nichos:");
          console.log(result);
          nichox = result;
        });
        console.log(nichox);
        resp.render('./consultani', {
          nichos: nichox
        });
      });
      app.get('/telefonos', function(soli, resp) {
        console.log('Telefonos seleccionado');
        console.log(telefonox);
        resp.render('./consultatel', {
          telefonos: telefonox
        });
      });
      app.post('/unitact', function(solis, resp) {

        var usuariocam = solis.body.cuenta;
        console.log(usuariocam);
        selectquerytoken = selectquerytoken.concat(usuariocam, "'");
        console.log(selectquerytoken);
        var nichocam = solis.body.nicho;
        console.log(nichocam);
        var propag = solis.body.propag;
        console.log(propag);
        var porcentcam = solis.body.cuenta;
        console.log(porcentcam);
        inidate = new Date().toMysqlFormat();
        console.log(inidate);
        findate = new Date();
        propag = parseInt(propag, 10);
        console.log(propag);
        findate.setHours(findate.getUTCHours() + 3);
        findate = findate.toMysqlFormat();
        console.log(findate);
        mariaconn.query(selectquerytoken, function(err, result, fields) {
          if (err) throw err;
          nichos = Object.keys(result).length;
          console.log(nichos);
          tokens = JSON.stringify(result);
          console.log(tokens);
          tokenss = JSON.parse(tokens);
          console.log(tokenss);
          ACCESS_TOKEN = tokenss[0].access_token;
          console.log(ACCESS_TOKEN);
          ACCESS_TOKEN_SECRET = tokenss[0].access_token_secret;
          console.log(ACCESS_TOKEN_SECRET);

        });

        var nichoseek = selectnicho.concat(nichocam, "';");
        console.log(nichoseek);
        mariaconn.query(nichoseek, function(err, result, fields) {
          if (err) throw err;
          console.log(err);
          console.log(result);
          nichotracery = result[0].json;
          console.log(nichotracery);
          console.log('Nicho Tracery path:');
          console.log(nichotracery);
          nicholeido = JSON.parse(fs.readFileSync(String(nichotracery), 'utf8'));
          rawGrammar = nicholeido;
          processedGrammar = tracery.createGrammar(rawGrammar);
        });
        insertcamp = sqlinsert.concat("campaign (nombre, nicho, descrip, propag, tipo, inicio, cuentas, fin) VALUES ('", nichocam, porcentcam, "', '", nichocam, "', 'Propagación unitaria de nicho', '", propag, "', '", "Uni', '", inidate, "', '", porcentcam, "', '", findate, "');");
        console.log(insertcamp);
        mariaconn.query(insertcamp, function(err, result, fields) {
          if (err & err != "ER_DUP_ENTRY") {
            throw err;
            console.log(result);
            resp.render('./unita', {
              nichos: nichox,
              twitters: twitterx
            });
          } else {
            console.log(err);
            console.log(result);
            console.log('campaña insertada');
            resp.render('./unita', {
              nichos: nichox,
              twitters: twitterx
            });
          }
        });

        var selecpropag = selprop.concat(nichocam, "'");
        mariaconn.query(selecpropag, function(err, result, fields) {
          if (err) throw err;
          console.log("Error SQL:");
          console.log(err);
          console.log("Resultado SQL:");
          console.log(result[0]);
          console.log("Nicho Tracery:");
          nichotracery = result[0].propag;
          console.log(nichotracery);
          switch (propag) {
            case 10:
              var T = new Twit({
                consumer_key: APP_CONSUMER_KEY,
                consumer_secret: APP_CONSUMER_SECRET,
                access_token: ACCESS_TOKEN,
                access_token_secret: ACCESS_TOKEN_SECRET
              });
              console.log(T);
              timerange = "* */10 * * * *";
              console.log('timerange');
              console.log(timerange);
              var job = new CronJob('* */10 * * * *', function() {
                var dtdfs = datediffs.concat(findate, "','", new Date().toMysqlFormat(), "') as date_diff");
                mariaconn.query(dtdfs, function(err, result, fields) {
                  if (err) throw err;
                  console.log(result);
                  diffs = result[0].date_diff;
                  console.log(diffs);
                  tweet = processedGrammar.flatten("#origin#");
                  T.post('statuses/update', {
                      status: tweet
                    },
                    function(err, data, response) {
                      console.log(data);
                    });
                  console.log('Nicho expandido:');
                  console.log(tweet);
                  if (diffs < 0) {
                    console.log("Trabajo detenido");
                    job.stop();
                  }
                });
              }, null, true, 'America/Mexico_City');
              job.stop();
              job.start();
              break;
            case 20:
              var T = new Twit({
                consumer_key: APP_CONSUMER_KEY,
                consumer_secret: APP_CONSUMER_SECRET,
                access_token: ACCESS_TOKEN,
                access_token_secret: ACCESS_TOKEN_SECRET
              });
              console.log(T);
              timerange = "* */20 * * * *";
              console.log('timerange');
              console.log(timerange);
              var job = new CronJob('* */20 * * * *', function() {
                var dtdfs = datediffs.concat(findate, "','", new Date().toMysqlFormat(), "') as date_diff");
                mariaconn.query(dtdfs, function(err, result, fields) {
                  if (err) throw err;
                  console.log(result);
                  diffs = result[0].date_diff;
                  console.log(diffs);
                  tweet = processedGrammar.flatten("#origin#");
                  T.post('statuses/update', {
                    status: tweet
                  }, function(err, data, response) {
                    console.log(data);
                  });
                  console.log('Nicho expandido:');
                  console.log(tweet);
                  if (diffs < 0) {
                    console.log("Trabajo detenido");
                    job.stop();
                  }
                });
              }, null, true, 'America/Mexico_City');
              job.stop();
              job.start();
              break;
            case 30:
              var T = new Twit({
                consumer_key: APP_CONSUMER_KEY,
                consumer_secret: APP_CONSUMER_SECRET,
                access_token: ACCESS_TOKEN,
                access_token_secret: ACCESS_TOKEN_SECRET
              });
              console.log(T);
              timerange = "* */30 * * * *";
              console.log('timerange');
              console.log(timerange);
              var job = new CronJob('* */30 * * * *', function() {

                var dtdfs = datediffs.concat(findate, "','", new Date().toMysqlFormat(), "') as date_diff");
                mariaconn.query(dtdfs, function(err, result, fields) {
                  if (err) throw err;
                  console.log(result);
                  diffs = result[0].date_diff;
                  console.log(diffs);
                  tweet = processedGrammar.flatten("#origin#");
                  T.post('statuses/update', {
                    status: tweet
                  }, function(err, data, response) {
                    console.log(data);
                  });
                  console.log('Nicho expandido:');
                  console.log(tweet);
                  if (diffs < 0) {
                    console.log("Trabajo detenido");
                    job.stop();
                  }
                });
              }, null, true, 'America/Mexico_City');
              job.stop();
              job.start();
              break;
            case 60:
              var T = new Twit({
                consumer_key: APP_CONSUMER_KEY,
                consumer_secret: APP_CONSUMER_SECRET,
                access_token: ACCESS_TOKEN,
                access_token_secret: ACCESS_TOKEN_SECRET
              });
              console.log(T);
              timerange = "* */60 * * * *";
              console.log('timerange');
              console.log(timerange);
              var job = new CronJob('* */60 * * * *', function() {
                var dtdfs = datediffs.concat(findate, "','", new Date().toMysqlFormat(), "') as date_diff");
                mariaconn.query(dtdfs, function(err, result, fields) {
                  if (err) throw err;
                  console.log(result);
                  diffs = result[0].date_diff;
                  console.log(diffs);
                  tweet = processedGrammar.flatten("#origin#");
                  T.post('statuses/update', {
                    status: tweet
                  }, function(err, data, response) {
                    console.log(data);
                  });
                  console.log('Nicho expandido:');
                  console.log(tweet);
                  if (diffs < 0) {
                    console.log("Trabajo detenido");
                    job.stop();
                  }
                });
              }, null, true, 'America/Mexico_City');
              job.stop();
              job.start();
              break;
            case 120:
              var T = new Twit({
                consumer_key: APP_CONSUMER_KEY,
                consumer_secret: APP_CONSUMER_SECRET,
                access_token: ACCESS_TOKEN,
                access_token_secret: ACCESS_TOKEN_SECRET
              });
              console.log(T);
              timerange = "* */60 */2 * * *";
              console.log('timerange');
              console.log(timerange);
              var job = new CronJob('* */60 */2 * * *', function() {

                var dtdfs = datediffs.concat(findate, "','", new Date().toMysqlFormat(), "') as date_diff");
                mariaconn.query(dtdfs, function(err, result, fields) {
                  if (err) throw err;
                  console.log(result);
                  diffs = result[0].date_diff;
                  console.log(diffs);
                  tweet = processedGrammar.flatten("#origin#");
                  T.post('statuses/update', {
                    status: tweet
                  }, function(err, data, response) {
                    console.log(data);
                  });
                  console.log('Nicho expandido:');
                  console.log(tweet);
                  if (diffs < 0) {
                    console.log("Trabajo detenido");
                    job.stop();
                  }
                });
              }, null, true, 'America/Mexico_City');
              job.stop();
              job.start();
              break;
          }
        });


      });
      app.post('/newcamp3', function(solis, resp) {
        var nombrecam = solis.body.nombre;
        console.log(nombrecam);
        var descripcam = solis.body.descrip;
        console.log(descripcam);
        var nichocam = solis.body.nicho;
        console.log(nichocam);
        var algoritmocam = solis.body.algoritmo;
        console.log(algoritmocam);
        var porcentcam = solis.body.porcent;
        console.log(porcentcam);
        inidate = new Date().toMysqlFormat();
        console.log(inidate);
        findate = new Date()
        findate.setHours(findate.getHours() + 3);
        findate = findate.toMysqlFormat();
        console.log(findate);

        insertcamp = sqlinsert.concat("campaign (nombre, nicho, descrip, propag, tipo, inicio, cuentas, fin) VALUES ('", nombrecam, "', '", nichocam, "', '", descripcam, "', '", algoritmocam, "', '", "Mass', '", inidate, "', '", porcentcam, "', '", findate, "');");
        console.log(insertcamp);
        mariaconn.query(insertcamp, function(err, result, fields) {
          if (err & err != "ER_DUP_ENTRY") {
            throw err;
            console.log(result);
            resp.render('./newcamp', {
              nichos: nichox,
              twitters: twitterx
            });
          } else {
            console.log(err);
            console.log(result);
            console.log('campaña insertada');

            resp.render('./newcamp', {
              nichos: nichox,
              twitters: twitterx
            });
          }
          console.log(result);
        });
      });
      app.post('/nichosub', function(solis, resp) {
        nichodb = solis.body.nicho;
        nichoinfo = solis.body.description;
        let archinicho = solis.files.archinicho;
        // Use the mv() method to place the file somewhere on your server
        newpath = NICHOS_PATH.concat(solis.files.archinicho.name);
        archinicho.mv(newpath, function(err) {
          nichopath = newpath;
          if (err)
            return resp.status(500).send(err);
        });
        var insertnicho = sqlinsert.concat("nichos (json,nicho, resumen) VALUES ('", newpath, "', '", nichodb, "', '", nichoinfo, "')");
        mariaconn.query(insertnicho, function(err, result, fields) {
          if (err & err != "ER_DUP_ENTRY") {
            throw err;
            console.log(result);
            mariaconn.query("SELECT nicho, resumen FROM nichos", function(err, result, fields) {
              if (err) throw err;
              console.log("Consulta nichos:");
              console.log(result);
              nichox = result;
            });
            resp.render('./consultani', {
              nichos: nichox
            });
          } else {
            console.log('nicho insertado');
            mariaconn.query("SELECT nicho, resumen FROM nichos", function(err, result, fields) {
              if (err) throw err;
              console.log("Consulta nichos:");
              console.log(result);
              nichox = result;
            });
            resp.render('./consultani', {
              nichos: nichox
            });
          }
          console.log(result);
          mariaconn.query("SELECT nicho, resumen FROM nichos", function(err, result, fields) {
            if (err) throw err;
            console.log("Consulta nichos:");
            console.log(result);
            nichox = result;
          });
          resp.render('./consultani', {
            nichos: nichox
          });
        });
      });
    }
  });
});