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
  "@type": { type: String, default: "Comment" },

  // Associer le profil utilisateur
  author: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },

  content: {
    type: String,
  },

  // Associer le post
  post: {
    type: Schema.Types.ObjectId,
    ref: "post",
  },

  //Associer les likes
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "like",
    },
  ],

  // Définir une valeur par défaut
  creationDate: { type: Date, default: new Date() },
  dateModified: { type: Date, default: new Date() },
});
//

/* 
Export
*/
module.exports = mongoose.model("comment", MySchema);
//
