const env = require('./env.js')

const Sequelize = require('sequelize')
const sequelize = new Sequelize(env.database, env.username, env.password, {
    host: env.host,
    logging: false,
    dialect: env.dialect,

    pool: {
        max: env.max,
        min: env.pool.min,
        acquire: env.pool.acquire,
        idle: env.pool.idle
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require('../model/user.js')(sequelize, Sequelize);
db.role = require('../model/role.js')(sequelize, Sequelize);

db.user.belongsToMany(db.role, { through: 'user_roles', foreignKey: 'userId', otherKey: 'roleId' });
db.role.belongsToMany(db.user, { through: 'user_roles', foreignKey: 'roleId', otherKey: 'userId' });

// role initialization, comment after the first application run
db.user.sync()
db.role.sync()

function initial() {
    db.role.create({
        id: 1,
        name: "USER"
    });

    db.role.create({
        id: 2,
        name: "ADMIN"
    });

    db.role.create({
        id: 3,
        name: "PM"
    });
}

module.exports = db;
