const Boom = require('@hapi/boom')

module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('user', {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        username: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        }
    })

    Sequelize.Model.find = async function (...args) {
        const obj = await this.findById(...args)
        if (obj === null) throw Boom.notFound()

        return obj
    }

    return User
}