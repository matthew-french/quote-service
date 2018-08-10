const mysql = require('mysql');

const state = {
    pool: null,
    mode: null,
};

module.exports.connect = () => {
    state.pool = mysql.createPool({
        host: "fillthegapbot-db.test.palringo.aws",
        database: "fillTheGapBot",
        user: "ftgBot",
        password: "W6o3@hw&tRi4",
        port: 3306,
        charset: 'utf8mb4',
    });

    state.mode = "fillTheGapBot";

    return state;
};

module.exports.terminateConnect = (connection) => connection.end();

module.exports.get = () => state.pool;

