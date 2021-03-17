/*
Imports
*/
    // Node
    const express = require('express');

    // Inner
    const Controllers = require('../controllers/index')
    const { checkFields } = require('../services/request.service');
    const Mandatory = require('../services/mandatory.service');
    const { renderSuccessVue, renderErrorVue } = require('../services/response.service');
//

/*
Routes definition
*/
    class BackendRouter {
        constructor( { passport } ){
            this.passport = passport
            this.router = express.Router(); 
        } 

        routes(){
            // [BACKOFFICE] Render index vue
            this.router.get('/', this.passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), (req, res) => {
                Controllers.post.readAll()
                .then( apiResponse => renderSuccessVue('index', req, res, apiResponse,  'Request succeed', false))
                .catch( apiError => renderErrorVue('index', req, res, apiError,  'Request failed') )
            })

            // [BACKOFFICE] Render login vue
            this.router.get('/login', (req, res) => {
                renderSuccessVue('login', req, res, null, 'Request succeed', false)
            })

            // [BACKOFFICE] get data from client to log user and render index vue
            this.router.post('/login', (req, res) => {
                
                // Check body data
                if( typeof req.body === 'undefined' || req.body === null || Object.keys(req.body).length === 0 ){ 
                    return renderErrorVue('index', req, res, 'No data provided',  'Request failed')
                }
                else{
                    
                    // Check body data
                    const { ok, extra, miss } = checkFields( Mandatory.login, req.body );

                    // Error: bad fields provided
                    if( !ok ){ return renderErrorVue('index', '/Login', 'POST', res, 'Bad fields provided', { extra, miss }) }
                    else{
                        Controllers.auth.login(req, res)
                        .then( apiResponse => renderSuccessVue( '/', req, res, 'User logged', apiResponse, true ) )
                        .catch( apiError => renderErrorVue('login', req, res, apiError,  'Request failed') );
                    }
                }
            })

            // [BACKOFFICE] get data from client to create object, protected by Passport MiddleWare
            this.router.post('/:endpoint', this.passport.authenticate('jwt', { session: false, failureRedirect: '/' }), (req, res) => {
                // Check body data
                if( typeof req.body === 'undefined' || req.body === null || Object.keys(req.body).length === 0 ){ 
                    return renderErrorVue('index', req, res, 'No data provided',  'Request failed')
                }
                else{
                    // Check body data
                    const { ok, extra, miss } = checkFields( Mandatory[req.params.endpoint], req.body );

                    // Error: bad fields provided
                    if( !ok ){ return renderErrorVue('index', `/${req.params.endpoint}`, 'POST', res, 'Bad fields provided', { extra, miss }) }
                    else{
                        // Add author _id
                        req.body.author = req.user._id;

                        // Use the controller to create nex object
                        Controllers[req.params.endpoint].createOne(req)
                        .then( apiResponse =>  res.redirect('/', req, res, 'Request succeed', apiResponse, true) )
                        .catch( apiError => renderErrorVue('index', req, res, apiError,  'Request failed') )
                    }
                }
            })
        }

        init(){
            // Get route fonctions
            this.routes();

            // Sendback router
            return this.router;
        };
    }
//

/*
Export
*/
    module.exports = BackendRouter;
//