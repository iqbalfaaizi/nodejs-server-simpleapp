// const { auth } = require('../controller/authController')
const Boom = require('@hapi/boom')
const db = require('../config/db.js');
const config = require('../config/config.js');
const User = db.user;

// const Role = db.role;
// const Op = db.Sequelize.Op;

var jwt = require('jsonwebtoken');

module.exports = [{
    method: 'GET',
    path: '/users',
    handler: async (request, h) => {
        let token = request.headers['x-access-token'] || request.headers['authorization'];

        if (!token) {
            return Boom.forbidden('Token not provided')
        }

        if (token.startsWith('Bearer ')) {
            // Remove Bearer from string
            token = token.slice(7, token.length);
        }

        try {
            jwt.verify(token, config.secret, (err, decoded) => {
            request.userId = decoded.id;
        });
        } catch (error) {
            return Boom.forbidden('Token mismatch')
        }
        if (request.userId !== null) {
            const user = await User.findByPk(request.userId).catch(err => {
                return Boom.badImplementation(err)
            })

            const role = await user.getRoles().catch(err => {
                return Boom.badImplementation(err)
            })

            if (role[0].name.toUpperCase() === 'ADMIN') {
                let users = await User.findAll({
                    attributes: ['id','name', 'username', 'email'],
                }).catch(err => {
                    return Boom.badImplementation(err)
                })
                return h.response({ auth: true, users: users }).code(200)
            } else {
                return h.response({ auth: false, users: 'You\'re not allowed to see this' }).code(200)
                //return Boom.forbidden('You\'re not allowed to see this')
            }
        } else {
            return Boom.forbidden('Token mismatch')
        }
    }
},{
    method: 'GET',
    path: '/test',
    handler: async (req, h) => {
        return h.response({status: 'success', test: 'Awembawe'}).code(201)
    }
}]