new CronJob('40 * * * * *', function() {

    var tokens;
    var inicio = new Date(hours, minutes, seconds);

    for (var i = 0; i < array.length; i++) {
      mariaconn.query("SELECT access_token,access_token_secret FROM twitter WHERE usuario=EsmelindaGarVe", function(err, result, fields) {
        if (err) throw err;
        nichos = Object.keys(result).length;
        tokens: result;
        console.log(nichos);
      });

      var T = new Twit({
        consumer_key: APP_CONSUMER_KEY,
        consumer_secret: APP_CONSUMER_SECRET,
        access_token: access_token,
        access_token_secret: access_token_secret,
      }, null, true, 'Mexico/Puebla');
      console.log(T);
    },
  }
}