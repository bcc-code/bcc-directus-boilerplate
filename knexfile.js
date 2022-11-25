require('dotenv').config({path: "./.env"});

module.exports = {
    development: {
        client: process.env.DB_CLIENT,
        connection: {
            host: "localhost",
            port: process.env.DB_PORT,
            database: process.env.DB_DATABASE,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            filename: process.env.DB_FILENAME,
        },
        seeds: {
            directory: __dirname + "/database/seeds/dist"
        }
    }
};
