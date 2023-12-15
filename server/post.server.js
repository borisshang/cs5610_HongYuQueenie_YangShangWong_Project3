const express = require('express');
const router = express.Router();
const { v4: uuid } = require('uuid');
const PostAccessor = require('./database/blogpost.model');

const postDB = [
    {
        id: 1,
        owner: 'Boris',
        text: 'ONE!',
        timestamp: generateTimestamp(),
    },
    {
        id: 2,
        owner: 'Hong',
        text: 'TWO!',
        timestamp: generateTimestamp(),
    },
    {
        id: 3,
        owner: 'Queenie',
        text: 'THREE!',
        timestamp: generateTimestamp(),
    },
]

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
    const foundPost = await PostAccessor.getAllBlogPosts();
    return res.json(foundPost);
});

//api/post/all?owner=Boris
//api/post/all
router.get('/all', async function(req, res) {

    
    const username = req.cookies['username'];

    if(username) {
        const foundPost = await PostAccessor.findPostByOwner(username);
        return res.json(foundPost);
    } else {
        const foundPost = await PostAccessor.getAllBlogPosts();
        return res.json(foundPost);
    }
 
    // if(ownerQuery) {
    //     const response = [];

    //     for(let i = 0; i < postResponse.length; i++) {
    //         const postValue = postResponse[i];
    //         if(postValue.owner === ownerQuery) {
    //             response.push(postValue)
    //         }
    //     }
    //     postResponse = response;
    // }
    // if(postResponse.length == 0) {
    //     return res.status(404).json({ error: "No such User!"});
    // }
    // res.json(postResponse);
})

// ////api/post/1
// router.get('/:postId', function (req, res) {
//     // return pokemon if one is found matching the pokemonId
//     // return a 404 if no pokemon matches that pokemonId
//     const idQuery = Number(req.params.postId);

//     for (let i = 0; i < postDB.length; i++) {
//         const postValue = postDB[i];
//         if (postValue.id === idQuery) {
//             return res.json(postValue);
//         }
//     }
//     res.status(404).json({ error: "No post matches that post id!"});
// });

//http://localhost:3500/api/post/
//Headers:Content-Type application/json
//text , ...
//name , ... (use cookie username later....)
//image , ....
router.post('/', async function(req, res) {
    
    // document.cookie = `username=Boris; path=/`;


    const username = req.cookies['username'];
    console.log("username: " + username)
    if(!username) {
        res.status(400)
        return res.send("username:" + username)
        //return res.send("Users need to be logged in to create a new post!")
    }

    const body = req.body;
    const postText = body.text;
    const owner = username
    const image = body.image
    const postId = uuid();

    if(!postText) {
        res.status(400);
        return res.send("Missing post text")
    }

    const newPost = {
        id: postId,
        owner: owner,
        text: postText,
        timestamp: generateTimestamp()
    };

    if(image) {
        newPost.image = image;
    }

    const createPost = await PostAccessor.insertBlogPost(newPost);

    return res.status(200).json({ createPost });
});



//http://localhost:3500/api/1
//Headers:Content-Type application/json
//text , ...
//name , ... (use cookie username later....)
//image , ....
router.put('/:postId', function(req, res) {

    //adding cookies using username later for owner.
    const postIdToUpdate = Number(req.params.postId);
    const owner = req.body.owner;
    const text = req.body.text;
    const image = req.body.image; 
    
    let postToUpdate = null
    for(let i = 0; i < postDB.length; i++) {
        const postValue = postDB[i];
        if(postValue.id === postIdToUpdate) {
            postToUpdate = postValue
        } 
    }

    if (postToUpdate) {
        //no need when add cookie
        postToUpdate.owner = owner;
        postToUpdate.text = text;

        if (image) {
            postToUpdate.image = image;
        }

        postToUpdate.timestamp = generateTimestamp();
        res.status(200);
        return res.send("Successfully update post with post id " + postIdToUpdate)
    } else {
        res.status(404);
        return res.send("Could not find post id " + postIdToUpdate)
    }
    

});

router.delete('/:postId', function(req, res) {
    const idQuery = Number(req.params.postId);
    
    for (let i = 0; i < postDB.length; i++) {
        const postValue = postDB[i];
        if (postValue.id === idQuery) {
            postDB.splice(i, 1); 
            return res.status(200).json({ message: "Post " + idQuery + " deleted successfully!" });
        }
    }

    return res.status(200).json({ error: "No post matches that post id!" });
})

module.exports = router;

