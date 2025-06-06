const dbConfig = require('../config/dbConfig.js');

const {Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        operatorsAliases: false,

        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        },
        port: dbConfig.PORT,
    }
)

sequelize.authenticate()
.then(() => {
    console.log('connected..')
})
.catch(err => {
    console.log('Error'+ err)
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

// db.actu = require ('./actu.model.js')(sequelize, DataTypes)
db.user = require ('./user.model.js')(sequelize, DataTypes)
db.todo = require ('./todo.model.js')(sequelize, DataTypes)

db.sequelize.sync({ force: false })
.then(() => {
    console.log('yes re-sync done!')
})


// 1 to Many Relation


// todo - user
db.user.hasMany(db.todo, {
    foreignKey: 'user_id',
    as: 'todo'
})

db.todo.belongsTo(db.user, {
    foreignKey: 'user_id',
    as: 'user'
})


module.exports = db