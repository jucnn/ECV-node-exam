/*
Import
*/
const mongoose = require("mongoose");
const { Schema } = mongoose;
//

/*
Definition
*/
const MySchema = new Schema({
  // Schema.org
  "@context": { type: String, default: "http://schema.org" },
  "@type": { type: String, default: "LikeAction" },

  // Associer le profil utilisateur
  author: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },

  // Associer le commentaire
  comment: {
    type: Schema.Types.ObjectId,
    ref: "comment",
    default: "",
  },

  // Associer le post
  post: {
    type: Schema.Types.ObjectId,
    ref: "post",
    default: "",
  },

  // Définir une valeur par défaut
  creationDate: { type: Date, default: new Date() },
  dateModified: { type: Date, default: new Date() },
});
//

/* 
Export
*/
module.exports = mongoose.model("like", MySchema);
//
