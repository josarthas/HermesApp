//Requerimientos de los Frameworks de Node, usamos varios para la renderización y correcta visualización de nuestra APP
// const mariadb = require('mariadb'); //servidor DEBIAN, usamos mariadb

var mysql = require('mysql'); // Servidor CentOS, usamos mysql innodb
var CronJob = require('cron').CronJob; //para definir intervalos de tiempo de algoritmos de tendencias
var express = require('express'); //servidor web
const fileUpload = require('express-fileupload');
var Twit = require('twit'); //Conexión a la API de Twitter, necesitamos crear esta conexión con los tokens creados automáticamente
var tokenss = [];
var token;
var nichos;
//Configuramos para el uso de express, .env y directorios publicos
require('dotenv').config(); //Para leer el archivo ".env" donde guardamos los datos de configuracion y accesos de base de datos y APP

// default options

// variables globales que vamos a usar
var ACCESS_TOKEN;
var ACCESS_TOKEN_SECRET;
//datos que se leen desde el archivo .env
var APP_CONSUMER_SECRET = process.env.APP_CONSUMER_SECRET;
var APP_CONSUMER_KEY = process.env.APP_CONSUMER_KEY;
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
mariaconn.query("SELECT access_token,access_token_secret FROM twitter WHERE usuario='EsmelindaGarVe';", function(err, result, fields) {
  if (err) throw err;
  nichos = Object.keys(result).length;
  console.log(nichos);
  tokens = JSON.stringify(result);
  console.log(tokens);
  tokenss = JSON.parse(tokens);
  console.log(tokenss);

});

ACCESS_TOKEN = tokenss[0].access_token;
console.log(ACCESS_TOKEN);
ACCESS_TOKEN_SECRET = tokenss[0].access_token_secret;
console.log(ACCESS_TOKEN_SECRET);

var T = new Twit({
  consumer_key: APP_CONSUMER_KEY,
  consumer_secret: APP_CONSUMER_SECRET,
  access_token: ACCESS_TOKEN,
  access_token_secret: ACCESS_TOKEN_SECRET,
}, null, true, 'Mexico/Puebla');
console.log(T);


new CronJob('* * * * * *', function() {


});