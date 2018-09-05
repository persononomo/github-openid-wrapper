const express = require('express');

const router = express.Router();
const respond = require('./respond');
const auth = require('./auth');
const openid = require('../openid');

function authorize(req, res) {
    res.redirect(
        `https://github.com/login/oauth/authorize?client_id=${
            req.query.client_id
            }&scope=${req.query.scope}&state=${req.query.state}&response_type=${
            req.query.response_type
            }`
    )
}

function token(req, res) {
    const code = req.body.code || req.query.code;
    const state = req.body.state || req.query.state;
    if (code) {
        openid
            .getTokens(code, state, req.get('host'))
            .then(tokens => {
                respond.success(res, tokens);
            })
            .catch(error => {
                respond.error(res, error);
            });
    } else {
        respond.error(res, new Error('No code supplied'));
    }
}

function userinfo(req, res) {
    auth
        .getBearerToken(req)
        .then(authToken => openid.getUserInfo(authToken))
        .then(userInfo => {
            respond.success(res, userInfo);
        })
        .catch(error => {
            respond.error(res, error);
        });
}

function jwks(req, res) {
    respond.success(res, openid.getJwks())
}

function openIdConfiguration(req, res) {
    const host = req.get('host');
    const config = openid.getConfigFor(host);

    respond.success(res, config);
}

router.post('/authorize', authorize);
router.get('/authorize', authorize);
router.post('/token', token);
router.get('/token', token);
router.post('/userinfo', userinfo);
router.get('/userinfo', userinfo);
router.get('/jwks.json', jwks);
router.get('/configuration', openIdConfiguration);

module.exports = router;

// https://rprec7sm60.execute-api.us-east-1.amazonaws.com/dev/authorize
// https://rprec7sm60.execute-api.us-east-1.amazonaws.com/dev/token
// https://rprec7sm60.execute-api.us-east-1.amazonaws.com/dev/userinfo
// https://rprec7sm60.execute-api.us-east-1.amazonaws.com/dev/jwks.json
