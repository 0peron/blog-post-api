const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const mongoose = require('mongoose');
mongoos.Promise = global.Promise;
const {
    PORT, DATABASE_URL
} = require('./config');

const {
    BlogPosts
} = require('./models');


BlogPosts.create('The best blog post', 'Here is where the best blog post should go', 'Patrick hubbard');
BlogPosts.create('tomatoes', 'this is a blog post all about tomatoes', 'Tomatoe Farmer');
BlogPosts.create('peppers', 'this is a blog post about them spicy peppers!', 'hot chillie lover');


router.get('/', (req, res) => {
    //    res.json(BlogPosts.get());
    BlogPosts
        .find()
        .limit(10)
        .exe()
        .then(BlogPosts => {
            res.json({
                BlogPosts: BlogPosts.map(
                    (BlogPosts) => BlogPosts.apiRepr())
            });
        })
        .catch(
            err => {
                console.error(err);
                res.status(500).json({
                    message: 'Internal server Error'
                });
            });
});

router.get('/BlogPosts/:id', (req, res) => {
    BlogPosts
        .findById(req.params.id)
        .exec()
        .then(BlogPosts => res.json(BlogPosts.apiRepr()))
        .catch(err => {
            console.error(err);
            res.status(500).json({
                message: 'Internal server error'
            })
        });
});

router.post('/BlogPosts', jsonParser, (req, res) => {
    //    const requiredFields = ['title', 'content', 'author'];
    //    for (let i = 0; i < requiredFields.length; i++) {
    //        const field = requiredFields[i];
    //        if (!(field in req.body)) {
    //            const message = `Missing \`${field}\` in request body`
    //            console.error(message);
    //            return res.status(400).send(message);
    //        }
    //    }
    //    const item = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
    //    res.status(201).json(item);
    const requiredFields = ['title', 'content', 'author'];
    requiredFields.forEach(field => {
        if (!(field in req.body && req.body[field])) {
            return res.status(400).json({
                message: `Must specify value for ${field}`
            });
        }
    });
    BlogPosts
        .create({
            title: req.body.title,
            content: req.body.content,
            author: req.body.author,
            publishDate: req.body.publishDate
        })
        .then(
            BlogPosts => res.status(201).json(BlogPosts.apiRepr()))
        .catch(err => {
            res.status(500).json({
                message: 'Internal server Error'
            });
        });
});


router.delete('/:id', (req, res) => {
    //    BlogPostss.delete(req.params.id);
    //    console.log(`Deleted blog item \`${req.params.ID}\``);
    //    res.status(204).end();
    BlogPosts
        .findByIdAndRemove(req.params.id)
        .exe()
        .then(BlogPosts => res.status(204).end())
        .catch(err => res.status(500).json({
            message: 'internal server error'
        }));
});


router.put('/:id', jsonParser, (req, res) => {
    //    const requiredFields = ['title', 'content', 'author', 'publishDate', 'id'];
    //    for (let i = 0; i < requiredFields.length; i++) {
    //        const field = requiredFields[i];
    //        if (!(field in req.body)) {
    //            const message = `Missing \`${field}\` in request body`
    //            console.error(message);
    //            return res.status(400).send(message);
    //        }
    //    }
    //    if (req.params.id !== req.body.id) {
    //        const message = (
    //            `Request path id (${req.params.id}) and request body id `
    //            `(${req.body.id}) must match`);
    //        console.error(message);
    //        return res.status(400).send(message);
    //    }
    //    console.log(`Updating blog item \`${req.params.id}\``);
    //    const updatedItem = BlogPostss.update({
    //        id: req.params.id,
    //        title: req.body.title,
    //        content: req.body.content,
    //        author: req.body.author,
    //        publishDate: req.body.publishDate
    //    });
    //    res.status(204).json(updatedItem);
    //})
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        res.status(400).json({
            error: 'Request path id and request body id values must match'
        });
    }

    const updated = {};
    const updateableFields = ['title', 'content', 'author'];
    updateableFields.forEach(field => {
        if (field in req.body) {
            updated[field] = req.body[field];
        }
    });

    BlogPosts
        .findByIdAndUpdate(req.params.id, {
            $set: updated
        }, {
            new: true
        })
        .exec()
        .then(updatedPost => res.status(201).json(updatedPost.apiRepr()))
        .catch(err => res.status(500).json({
            message: 'Internal server errir'
        }));
});

module.exports = router;
