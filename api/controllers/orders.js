const Order = require('../models/order');
const mongoose = require('mongoose');
const port = process.env.port || 4000; //dynamic port declaration

exports.findAllOrders = (req, res, next) => {
    Order.find()
        .select("productId quantity _id")
        .populate('productId', 'name price ')
        .exec()
        .then(orders => {
            const response = {
                count: orders.length,
                orders: orders.map(order => {
                    return {
                        orderId: order._id,
                        quantity: order.quantity,
                        product: order.productId,
                        request: {
                            type: "GET",
                            url: `http://localhost:${port}/api/orders/${order._id}`
                        }
                    }
                })
            }
            res.status(200).send(response)
        })
        .catch(e => {
            res.status(500).send({ error: e })
        })
}

exports.findOrder = (req, res, next) => {
    Order.findById(req.params.id)
        .select('-__v')
        .then(order => {
            res.status(200).send({
                order: order,
                request: {
                    type: 'GET',
                    url: `http://localhost:${port}/orders/${req.params.id}`
                }
            })
        })
        .catch(error => {
            res.status(500).send({ messsage: 'Error in finding the order' });
        })
}

exports.createOrder = (req, res, next) => {
    Product.findById(req.body.productId)
        .exec()
        .then(product => {
            if (!product) {
                return res.status(404).send({ messsage: 'product not found' });
            }
            const order = new Order({
                productId: req.body.productId,
                quantity: req.body.quantity
            });
            order.save()
                .then(order => {
                    res.status(201).send({
                        message: 'Order submitted successfully',
                        productData: {
                            name: order.name,
                            price: order.price,
                            id: order._id
                        },
                        request: {
                            type: 'POST',
                            url: `http://localhost:${port}/api/orders/${order._id}`
                        }
                    });
                })
                .catch(err => {
                    console.log("ERORRR");
                    res.status(500).send({ error: err });
                });
        })
        .catch(e => { res.status(500).send({ message: 'invalid productId' }) }); // end of outer then   
}

exports.deleteOrder = (req, res, next) => {
    Order.remove({ _id: req.params.id })
        .exec()
        .then(order => {
            res.status(200).send({ message: 'Order removed' });
        })
        .catch(error => {
            res.status(500).send({ message: 'Server Error' });
        })

}

