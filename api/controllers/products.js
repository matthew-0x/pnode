
const mongoose = require('mongoose');
const Product = require('../models/product');
const port = process.env.port || 4000; //dynamic port declaration

exports.findAllProducts = (req, res) => {
    Product.find()
        .select('-__v')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        id: doc._id,
                        request: {
                            type: "GET",
                            url: `http://localhost:${port}/api/products/${doc._id}`
                        }
                    }
                })
            }
            res.status(200).send(response)
        })
        .catch(err => {
            res.status(500).send({ error: err })
        });

}

exports.createProduct = (req, res, next) => {
    const product = new Product({
        name: req.body.name,
        price: req.body.price
    });
    product.save()
        .then(result => {
            res.status(201).send({
                message: "Product created successfully",
                productData: {
                    name: result.name,
                    price: result.price,
                    id: result._id,
                    request: {
                        type: "POST",
                        url: `http://localhost:${port}/api/products/${result._id}`
                    }
                }
            });
        })
        .catch(err => {
            res.status(500).send({ error: err });
        });
}

exports.findProduct = (req, res, next) => {
    const id = req.params.id;
    Product.findById(id)
        .select('-__v')
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).send({
                    product: doc,
                    request: {
                        type: "GET",
                        url: `http://localhost:${port}/api/products/${doc.id}`
                    }
                });
            } else {
                res.status(404).send("Record not found");
            }
        })
        .catch(err => {
            res.status(500).send({ error: "Invalid Object ID" })
        });
}

exports.modifyProduct = (req, res, next) => {
    const id = req.params.id;
    let updateOps = {};
    for (let ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).send({
                message: "Product Updated",
                request: {
                    type: "PUT",
                    url: `http://localhost:${port}/api/products/${id}`
                }
            });
        })
        .catch(error => {
            res.status(500).send({ error: "Update failed" })
        })
}

exports.deleteProduct = (req, res, next) => {
    const id = req.params.id;
    Product.findByIdAndRemove({ _id: id }, (err, doc) => {
        if (doc != null)
            res.status(200).send(doc);
        else
            res.status(500).send("record not found");
    });
}