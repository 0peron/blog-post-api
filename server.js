const express = require('express');
const morgan = require('morgan');

const app = express();

const blogPostRouter = require('./blogPostRouter');


app.use(morgan('common'));

// when requests come into `/blogpost`, we'll route them to the express
// router instances we've imported. Remember,
// these router instances act as modular, mini-express apps.
app.use('/blogPostRouter', blogPostRouter);


let server;

function runServer() {
    const port = process.env.PORT || 8080;
    return new Promise((resolve, reject) => {
        server = app.listen(port, () => {
            console.log(`Your app is listening on port ${port}`);
            resolve(server);
        }).on('error', err => {
            reject(err)
        });
    });
}
//
//// like `runServer`, this function also needs to return a promise.
//// `server.close` does not return a promise on its own, so we manually
//// create one.
function closeServer() {
    return new Promise((resolve, reject) => {
        console.log('Closing server');
        server.close(err => {
            if (err) {
                reject(err);
                // so we don't also call `resolve()`
                return;
            }
            resolve();
        });
    });
}
//
//// if server.js is called directly (aka, with `node server.js`), this block
//// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
//if (require.main === module) {
//    runServer().catch(err => console.error(err));
//};
//



if (!module.parent) {
    app.listen(process.env.PORT || 8080, () => {
        console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
    });
}

module.exports = {
    app, runServer, closeServer
};
