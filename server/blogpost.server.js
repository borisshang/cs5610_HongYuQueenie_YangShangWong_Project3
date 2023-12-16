const express = require('express');
const router = express.Router();
const { v4: uuid } = require('uuid');
const blogPostAccessor = require('./database/blogpost.model');

//generate time stamp
function generateTimestamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


// return all post
router.get('/', async function(req, res) {
    const foundBlogPosts = await blogPostAccessor.getAllBlogPosts();
    res.json(foundBlogPosts)
});


//api/post/all?owner=Boris
//api/post/all
router.get('/all', async function(req, res) {

    const username = req.cookies.username;
    let postResponse = [];

//    const allPokemon = await PokemonAccessor.getAllPokemon();
//    return  response.json(allPokemon);
 
    if(username) {
        const foundBlogPosts = await blogPostAccessor.findBlogPostsByOwner(username);
        res.status(200);
        return res.json(foundBlogPosts);
    }
    else
    {
        res.status(400);
        return res.send("Cannot get blog posts when logged out");
    }

})



//http://localhost:3500/api/post/
//Headers:Content-Type application/json
//text , ...
//name , ... (use cookie username later....)
//image , ....
router.post('/', async function(req, res) {
    const username = req.cookies.username;
    
    if(!username) {
         res.status(400)
         return res.send("Users need to be logged in to create a new post!")
    }

    const body = req.body;
    const text = body.text;
    const owner = username;
    const id = uuid();

    if(!text) {
        res.status(400);
        return res.send("Missing post text or owner!")
    }

    const newPost = ({
        id: id,
        owner: owner,
        text: text,
        timestamp: generateTimestamp()
    });

    const createBlogPost = await blogPostAccessor.insertBlogPost(newPost);

    res.json(createBlogPost);
    //response.cookie('postId', createBlogPost.id)

    //return res.status(200).json({message: "Post added successfully!", post: newPost, });
});


// // http://localhost:3500/api/1
// // Headers:Content-Type application/json
// // text , ...
// // name , ... (use cookie username later....)
// // image , ....
// router.put('/:postId', function(req, res) {

//     const username = req.cookies.username;
    
//     if(!username) {
//          res.status(400)
//          return res.send("Users need to be logged in to update their post!")
//     }

//     //adding cookies using username later for owner.
//     const postIdToUpdate = Number(req.params.postId);
//     const owner = username
//     const text = req.body.text;
    
//     let postToUpdate = null
//     for(let i = 0; i < postDB.length; i++) {
//         const postValue = postDB[i];
//         if(postValue.id === postIdToUpdate) {
//             postToUpdate = postValue
//         } 
//     }

//     if (postToUpdate) {
//         //no need when add cookie
//         postToUpdate.owner = owner;
//         postToUpdate.text = text;

//         if (image) {
//             postToUpdate.image = image;
//         }

//         postToUpdate.timestamp = generateTimestamp();
//         res.status(200);
//         return res.send("Successfully update post with post id " + postIdToUpdate)
//     } else {
//         res.status(404);
//         return res.send("Could not find post id " + postIdToUpdate)
//     }
    

// });

// router.delete('/:postId', function(req, res) {
//     const idQuery = Number(req.params.postId);
    
//     for (let i = 0; i < postDB.length; i++) {
//         const postValue = postDB[i];
//         if (postValue.id === idQuery) {
//             postDB.splice(i, 1); 
//             return res.status(200).json({ message: "Post " + idQuery + " deleted successfully!" });
//         }
//     }

//     return res.status(200).json({ error: "No post matches that post id!" });
// })


module.exports = router;

