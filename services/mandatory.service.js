/* 
Definition
*/
const Mandatory = {
  register: ["givenName", "familyName", "password", "email"],
  login: ["password", "email"],
  post: ["headline", "body"],
  comment: ["post", "content"],
  like: ["post", "comment"]
};
//

/* 
Export
*/
module.exports = Mandatory;
//
