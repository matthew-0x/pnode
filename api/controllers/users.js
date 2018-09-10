const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../models/user');


exports.signupUser = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(email => {
            if (email.length >= 1) {
                res.status(409).send({
                    message: 'User Already Exist'
                })
            } else {
                bcrypt.hash(req.body.password, 4, (error, hash) => {
                    if (error) {
                        res.status(500).send({
                            worked: 'false',
                            message: 'password not generated'
                        });
                    } else {
                        const user = new User({
                            email: req.body.email,
                            password: hash
                        });
                        user
                            .save()
                            .then(result => {
                                res.status(200).send({
                                    message: 'User registered',
                                    user: user
                                })
                            })
                            .catch(error => {
                                res.status(500).send({
                                    worked: 'false',
                                    message: 'User not registered',
                                    error: error
                                });
                            });
                    }
                })
            }
        })
}

exports.loginUser = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).send({
                    message: 'Authentication failed'
                });
            }
            bcrypt.compare(req.body.password, user[0].password)
                .then(result => {
                    if (result){
                        const jwtToken = jwt.sign({
                            sub: user[0].email,
                            username: user[0]._id, 
                            role: 'admin'
                        },
                        process.env.tokenSecret,
                        {
                            expiresIn: "1h",
                        });
                        return res.status(200).send({ 
                            messsage: 'Login Successful',
                            token: jwtToken
                        });
                    } else
                        return res.status(500).send({ worked: 'false', message: 'Login failed' });
                })
                .catch(error => {
                    return res.status(500).send({ worked: 'false', message: 'Method Error' });
                });

        })
        .catch(error => {
            res.status(401).send({ worked: 'false', message: 'Error' });
        });

}

exports.deleteUser = (req, res, next) => {
    User.remove({ _id: req.params.id })
        .exec()
        .then(result => {
            res.status(200).send({ message: 'User Removed' });
        })
        .catch(error => {
            res.status(500).send({ worked: false, message: 'Error' });
        })
}