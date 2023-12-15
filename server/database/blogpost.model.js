const mongoose = require("mongoose")

const BlogpostSchema = require('./blogpost.schema').BlogpostSchema

const BlogpostModel = mongoose.model("BlogpostSchema", BlogpostSchema);

function insertBlogPost(post) 
{
    return BlogpostModel.create(post);
}

function getAllBlogPosts() 
{
    return BlogpostModel.find().exec();
}

function findPostByOwner(owner) {
    return BlogpostModel.find({owner: owner}).exec();
}

module.exports = 
{
    insertBlogPost,
    getAllBlogPosts,
    findPostByOwner
};