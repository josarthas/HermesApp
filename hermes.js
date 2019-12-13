const mariadb = require('mariadb');
const pool = mariadb.createPool({
     host: 'localhost',
     user:'root',
     password: 'ID11135PrisciLiz',
     connectionLimit: 5
});
async function asyncFunction() {
  let conn;
  try {
	conn = await pool.getConnection();
  const res = await conn.query("USE hermes");
  console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
	const rows = await conn.query("SELECT 1 as val");
	console.log(rows); //[ {val: 1}, meta: ... ]
	const res = await conn.query("INSERT INTO usuarios VALUES ( 'prueba','prueba','prueba2','user' )", [1, "mariadb"]);
	console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }

  } catch (err) {
	throw err;
  } finally {
	if (conn) return conn.end();
  }
}
