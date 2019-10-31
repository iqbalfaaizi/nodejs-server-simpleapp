// const { auth } = require('../controllers/authController')
const Boom = require('@hapi/boom')
const db = require('../config/db.js');
const config = require('../config/config.js');
const User = db.user;
const Joi = require('@hapi/joi')

/* const Role = db.role;
const Op = db.Sequelize.Op; */

var jwt = require('jsonwebtoken')
var bcrypt = require('bcryptjs');

module.exports = [{
    method: 'POST',
    path: '/auth/login',
    options: {
        validate: {
            payload: {
                email: Joi.string().required(),
                password: Joi.string().required()
            },
            failAction: (request, h, err) => {
                return err.isJoi ? h.response(err.details[0]).takeover() : h.response(err).takeover();
            }
        }
    },
    handler: async (request, h) => {
        const user = await User.findOne({
            where: {
                email: request.payload.email
            }
        }).catch(err => {
            return Boom.badRequest(err)
        });
        
        if (user !== null) {
            var passwordIsValid = bcrypt.compareSync(request.payload.password, user.password);
            
            if (!passwordIsValid) {
                return Boom.badRequest('Login failed')
            }

            var token = jwt.sign({ id: user.id }, config.secret, { expiresIn: 10800 // expires in 3 hours 
            });
            return h.response({ auth: true, type: "Bearer", accessToken: token }).code(200)
        } else {
            // return Boom.badRequest('Login failed')
            return h.response({auth: false})
        }
    }
},{
    method: 'POST',
    path: '/auth/register-user',
    options: {
        validate: {
            payload: {
                name: Joi.string().required(),
                username: Joi.string().required(),
                email: Joi.string().required(),
                password: Joi.string().required()
            },
            failAction: (request, h, err) => {
                return err.isJoi ? h.response(err.details[0]).takeover() : h.response(err).takeover();
            }
        }
    },
    handler: async (request, h) => {
        const checkEmail = await User.findOne({
            where: { email: request.payload.email }
        }).catch(err => {
            return Boom.badRequest(err)
        })

        if (checkEmail === null) {
            const user = await User.create({
                name: request.payload.name,
                username: request.payload.username,
                email: request.payload.email,
                password: bcrypt.hashSync(request.payload.password, 8)
            }).catch(err => {
                return Boom.badRequest(err)
            })
            user.setRoles(1)
            return h.response({ status: 'success' }).code(201)
        } else {
            return Boom.badRequest('Email already taken')
            //return h.response({ status: 'failed' }).code(201)
        }

    }
},{
    method: 'POST',
    path: '/auth/register-admin',
    handler: async (request, h) => {
        const checkEmail = await User.findOne({
            where: { email: request.payload.email }
        }).catch(err => {
            return Boom.badRequest(err)
        })

        if (checkEmail === null) {
            const user = await User.create({
                name: request.payload.name,
                username: request.payload.username,
                email: request.payload.email,
                password: bcrypt.hashSync(request.payload.password, 8)
            }).catch(err => {
                return Boom.badRequest(err)
            })
            user.setRoles(2)
            return h.response({ status: 'success' }).code(201)
        } else {
            return Boom.badRequest('Email already taken')
        }

    }
},{
    method: 'GET',
    path: '/test-auth',
    handler: async (req, h) => {
        return h.response({status: 'success', test: 'Awembawe'}).code(201)
    }
}]