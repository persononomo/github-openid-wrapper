const controllers = require('./controllers');

module.exports = app => {
    app.post('/github/openid/authorize', controllers.authorize);
    app.get('/github/openid/authorize', controllers.authorize);
    app.post('/github/openid/token', controllers.token);
    app.get('/github/openid/token', controllers.token);
    app.post('/github/openid/userinfo', controllers.userInfo);
    app.get('/github/openid/userinfo', controllers.userInfo);
    app.get('/github/openid/jwks.json', controllers.jwks);
    app.get('/github/openid/configuration', controllers.openIdConfiguration);
};