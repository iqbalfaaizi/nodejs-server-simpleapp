const Boom = require('@hapi/boom')

module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define('roles', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        }
    })

    Sequelize.Model.find = async function (...args) {
        const obj = await this.findById(...args)
        if (obj === null) throw Boom.notFound()

        return obj
    }

    return Role
}