require('dotenv').config();
module.exports = {
    HOST: process.env.DATABASE_URL,
    USER: 'root',
    PASSWORD: '',
    PORT: '3306',
    DB: 'todo_app',
    dialect: 'mysql',

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}