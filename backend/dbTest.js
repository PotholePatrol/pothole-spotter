const mysql = require('mysql2/promise');

async function testDB() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',        // change if you use a different username
      password: '',        // put your DB password here
      database: 'smartroads' // or whatever DB you're using
    });

    console.log('✅ Connected to DB successfully!');
    const [rows] = await connection.execute('SELECT 1');
    console.log('✅ Test query result:', rows);
    await connection.end();
  } catch (err) {
    console.error('❌ DB Connection FAILED:', err.message);
  }
}

testDB();
