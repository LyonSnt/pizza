const pgPromise = require('pg-promise');
const pgp = pgPromise({});
const config = {
    host: 'localhost',
    port: '7474',
    database: 'bdd_pizza',
    user: 'postgres',
    password: 'snayder'

}

const db = pgp(config);

//db.any('select * from ingredient').then(res => { console.log(res);});

exports.db = db;