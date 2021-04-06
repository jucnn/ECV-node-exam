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
    Models.comment
      .create(req.body)
      .then((data) => {
        Models.post.findById(data.post).then((post) => {
          // Update post
          post.comments.push(data);
          // Save post changes
          post
            .save()
            .then((updatedPost) => resolve(updatedPost))
            .catch((updateError) => reject(updateError));
        });
        Models.user
          .findById(req.user._id)
          .then((user) => {
            // Update user
            user.comments.push(data);
            // Save user changes
            user
              .save()
              .then((updatedUser) => resolve(updatedUser))
              .catch((updateError) => reject(updateError));
          })
          .catch((err) => reject(err));
        resolve(data);
      })
      .catch((err) => reject(err));
  });
};

const readAll = () => {
  return new Promise((resolve, reject) => {
    // Mongoose population to get associated data
    Models.comment
      .find()
      .populate("author", ["-password", "-likes", "-comments"])
      /*  .populate("post") */
      /*  .populate("like") */
      .exec((err, data) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(data);
        }
      });
  });
};

const readAllByPost = (postId) => {
  return new Promise((resolve, reject) => {
    // Mongoose population to get associated data
    Models.comment
      .find({ post: postId })
      .populate("comment", ["content", "author"])
      .populate("author", ["-password", "-likes", "-comments"])
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
    Models.comment
      .findById(id)
      .populate("author", ["-password"])
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
    Models.comment
      .findById(req.params.id)
      .then((comment) => {
        if (comment.author !== req.user._id) {
          return reject("User not authorized");
        } else {
          // Update object
          comment.content = req.body.content;
          comment.dateModified = new Date();

          // Save comment changes
          comment
            .save()
            .then((updatedComment) => resolve(updatedComment))
            .catch((updateError) => reject(updateError));
        }
      })
      .catch((err) => reject(err));
  });
};

const deleteOne = (req) => {
  return new Promise((resolve, reject) => {
    //Get comment by id
    Models.comment
      .findById(req.params.id)
      .then((comment) => {
        if (comment.author.toString() != req.user._id.toString()) {
          return reject("User not authorized");
        } else {
          // Delete object
          Models.comment.findByIdAndDelete(req.params.id, (err, deleted) => {
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
//

/* 
Export controller methods
*/
module.exports = {
  readAll,
  readOne,
  createOne,
  updateOne,
  readAllByPost,
  deleteOne,
};
//
