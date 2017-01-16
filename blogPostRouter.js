const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {
    blogPost
} = require('./models');


//blogPost.create('The best blog post', 'Here is where the best blog post should go', 'Patrick hubbard', '1/15/17');
//blogPost.create('tomatoes', 'this is a blog post all about tomatoes', 'Tomatoe Farmer', '1/20/16');
//blogPost.create('peppers', 'this is a blog post about them spicy peppers!', 'hot chillie lover', '6/20/15');


router.get('/', (req, res) => {
    res.json(blogPost.get());
});


router.post('/', jsonParser, (req, res) => {
    const requiredFields = ['title', 'content', 'author', 'publishDate'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    const item = blogPost.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
    res.status(201).json(item);
});


router.delete('/:id', (req, res) => {
    blogPost.delete(req.params.id);
    console.log(`Deleted blog item \`${req.params.ID}\``);
    res.status(204).end();
});


router.put('/:id', jsonParser, (req, res) => {
    const requiredFields = ['title', 'content', 'author', 'publishDate', 'id'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    if (req.params.id !== req.body.id) {
        const message = (
            `Request path id (${req.params.id}) and request body id `
            `(${req.body.id}) must match`);
        console.error(message);
        return res.status(400).send(message);
    }
    console.log(`Updating blog item \`${req.params.id}\``);
    const updatedItem = blogPost.update({
        id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        publishDate: req.body.publishDate
    });
    res.status(204).json(updatedItem);
})


module.exports = router;
