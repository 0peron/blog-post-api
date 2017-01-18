const chai = require('chai');
const chaiHttp = require('chai-http');

//const {
//    app, runServer, closeServer
//} = require('../server');
var server = require('../server'),
    app = server.app,
    runServer = server.runServer,
    closeServer = server.closeServer;

const should = chai.should();
chai.use(chaiHttp);


describe('BlogPosts', function () {
    //    before(function () {
    //        return runServer();
    //    });
    it('should list items on GET', function () {
        return chai.request(app)
            .get('/blogPostRouter')
            .then(function (res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.length.should.be.at.least(1);
                const expectedKeys = ['id', 'title', 'content', 'author'];
                res.body.forEach(function (item) {
                    item.should.be.a('object');
                    item.should.include.keys(expectedKeys);
                });
            });
    });

    it('should add an item on POST', function () {
        const newItem = {
            title: 'The life of dogs',
            content: 'here is some awesome blog posts',
            author: 'Pat H'

        };
        return chai.request(app)
            .post('/blogPostRouter')
            .send(newItem)
            .then(function (res) {
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                //                res.body.should.include.keys('id', 'author', 'content', 'title');
                res.body.id.should.not.be.null;
                //                res.body.should.deep.equal(Object.assign(newItem, {
                //                    id: res.body.id
                //                }));
            });
    });

    it('should update items on PUT', function () {
        const updateData = {
            author: 'foo',
            title: 'fast as lightning',
            content: 'Bruce lee was the man',
            id: 1;
        };

        return chai.request(app)
            .get('/blogPostRouter')
            .then(function (res) {
                updateData.id = res.body[0].id;
                return chai.request(app)
                    .put(`/blogPostRouter/${updateData.id}`)
                    .send(updateData);
            })
            .then(function (res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.deep.equal(updateData);
            });
    });

    it('should delete items on DELETE', function () {
        return chai.request(app)
            .get('/blogPostRouter')
            .then(function (res) {
                return chai.request(app)
                    .delete(`/rblogPostRouter/${res.body[0].id}`);
            })
            .then(function (res) {
                res.should.have.status(204);
            });
    });
    //    after(function () {
    //        return closeServer();
    //    });
});
