const mariadb = require('mariadb');
const pool = mariadb.createPool({
     host: 'localhost',
     user:'josarthas',
     password: 'ID11135PrisciLiz',
     connectionLimit: 5
});
async function asyncFunction() {
  let conn;
  try {
	conn = await pool.getConnection();
  const connec = await conn.quexry("USE globalhermes");
  console.log(connec); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
	const res = await conn.query("INSERT INTO usuarios VALUES ( 'prueba','prueba','prueba2','user' )", [1, "mariadb"]);
	console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }

  } catch (err) {
	throw err;
  } finally {
	if (conn) return conn.end();
  }
}
