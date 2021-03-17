/* 
Imports
*/
    const Models = require('../models/index');
//

/*  
CRUD methods
*/
    const createOne = req => {
        return new Promise( (resolve, reject) => {
            Models.post.create( req.body )
            .then( data => resolve(data) )
            .catch( err => reject(err) )
        })
    }
 
    const readAll = () => {
        return new Promise( (resolve, reject) => {
            Models.post.find()
            .then( async data => {
                let collection = [];
                for( let item of data ){
                    collection.push( await readOne(item._id) )
                }
                // Return populated data
                return resolve(collection);
            })
            .catch( err => reject(err) )
        })
    }

    const readOne = id => {
        return new Promise( (resolve, reject) => {
            // Mongoose population to get associated data
            Models.post.findById( id )
            .populate('author', [ '-password' ])
            .populate('comment')
            // TODO: populate post comment
            .exec( (err, data) => {
                if( err ){ return reject(err) }
                else{ return resolve(data) }
            })
        })
    }

    const updateOne = req => {
        return new Promise( (resolve, reject) => {
            // Get post by ID
            Models.post.findById( req.params.id )
            .then( post => {
                // Update object
                post.headline = req.body.headline;
                post.body = req.body.body;
                post.dateModified = new Date();

                // TODO: Check author
                /* if( post.author !== req.user._id ){ return reject('User not authorized') }
                else{ } */

                // Save post changes
                post.save()
                .then( updatedPost => resolve(updatedPost) )
                .catch( updateError => reject(updateError) )
            })
            .catch( err => reject(err) )
        })
    }

    const deleteOne = req => {
        return new Promise( (resolve, reject) => {
             // Delete object
             Models.post.findByIdAndDelete( req.params.id, (err, deleted) => {
                if( err ){ return reject(err) }
                else{ return resolve(deleted) };
            })
            
            // Get post by ID
            /* Models.post.findById( req.params.id )
            .then( post => {
                // TODO: Check author
                if( post.author !== req.user._id ){ return reject('User not authorized') }
                else{
                    // Delete object
                    Models.post.findByIdAndDelete( req.params.id, (err, deleted) => {
                        if( err ){ return reject(err) }
                        else{ return resolve(deleted) };
                    })
                }
            })
            .catch( err => reject(err) ); */
        });
    }
//

/* 
Export controller methods
*/
    module.exports = {
        readAll,
        readOne,
        createOne,
        updateOne,
        deleteOne
    }
//