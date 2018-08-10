const db = require('./db.js');

module.exports.getAllRows = () => new Promise((resolve, reject) => {
  db.get().query('SELECT * FROM games WHERE language="EN" ORDER BY games_id ASC LIMIT 500;', (err, rows) => {
    if (err) {
      reject(err);
    }
    resolve(rows);
  });
});
