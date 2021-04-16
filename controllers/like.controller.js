/* 
Imports
*/
const Models = require("../models/index");
//

/*  
CRUD methods
*/
const createOne = (req) => {
  return new Promise((resolve, reject) => {
    Models.like
      .create(req.body)
      .then((data) => {
        //Check if it's comment or post like
        if (data.comment != null) {
          //Update comment likes list
          Models.comment
            .findById(data.comment)
            .then((comment) => {
              comment.likes.push(data);
              // Save comment changes
              comment
                .save()
                .then((updatedComment) => resolve(updatedComment))
                .catch((updateError) => reject(updateError));
            })
            .catch((err) => reject(err));
        } else if (data.post != null) {
          //Update post likes list
          Models.post
            .findById(data.post)
            .then((post) => {
              post.likes.push(data);
              // Save post changes
              post
                .save()
                .then((updatedPost) => resolve(updatedPost))
                .catch((updateError) => reject(updateError));
            })
            .catch((err) => reject(err));
        }
        //Add likes in user infos
        Models.user.findById(req.user._id).then((user) => {
          // Update object
          user.likes.push(data);
          // Save user changes
          user
            .save()
            .then((updatedUser) => resolve(updatedUser))
            .catch((updateError) => reject(updateError));
        });

        resolve(data);
      })
      .catch((err) => reject(err));
  });
};

const readAll = () => {
  return new Promise((resolve, reject) => {
    // Mongoose population to get associated data
    Models.like
      .find()
      .exec((err, data) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(data);
        }
      });
  });
};

const readOne = (id) => {
  return new Promise((resolve, reject) => {
    // Mongoose population to get associated data
    Models.like
      .findById(id)
      .populate("like")
      .exec((err, data) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(data);
        }
      });
  });
};

const updateOne = (req) => {
  return new Promise((resolve, reject) => {
    // Get post by ID
    Models.like
      .findById(req.params.id)
      .then((like) => {
        if (like.author !== req.user._id) {
          return reject("User not authorized");
        } else {
          // Update object
          like.content = req.body.content;
          like.dateModified = new Date();

          // Save like changes
          like
            .save()
            .then((updatedlike) => resolve(updatedlike))
            .catch((updateError) => reject(updateError));
        }
      })
      .catch((err) => reject(err));
  });
};

const deleteOne = (req) => {
  return new Promise((resolve, reject) => {
    //Get like by id
    Models.like
      .findById(req.params.id)
      .then((like) => {
        if (like.author.toString() != req.user._id.toString()) {
          return reject("User not authorized");
        } else {
          // Delete object
          Models.like.findByIdAndDelete(req.params.id, (err, deleted) => {
            if (err) {
              return reject(err);
            } else {
              return resolve(deleted);
            }
          });
        }
      })
      .catch((err) => reject(err));
  });
};

const getLikePerUser = (userId) => {
  return new Promise((resolve, reject) => {
    Models.like
      .find({ author: userId })
      .exec((err, data) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(data);
        }
      });
  });
};
//

/* 
Export controller methods
*/
module.exports = {
  readAll,
  readOne,
  createOne,
  updateOne,
  deleteOne,
  getLikePerUser
};
//
