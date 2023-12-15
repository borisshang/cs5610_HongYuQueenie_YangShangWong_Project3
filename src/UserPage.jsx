import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './UserPage.css';
import Navbar from './Navbar'; 
import { useNavigate } from 'react-router';

function UserPage() {
  const navigate = useNavigate();

  //show the post
  const [postListState, setPostListState] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  //const [userInfo, setUserInfo] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const params = useParams();
  const owner = params.owner;


  const getAllUserPost = async () => {
    //const response = await axios.get('/api/blogpost/all');
    const response = await axios.get('/api/blogpost/all');
    setPostListState(response.data);
  };

  useEffect(() => {
    getAllUserPost();
  }, []);

  const postComponent = [];

  for (let i = 0; i < postListState.length; i++) {
    const currentPostValue = postListState[i];

    postComponent.push(
      <div>
        {currentPostValue.owner} - Post: {currentPostValue.text} - {currentPostValue.timestamp}
      </div>
    );
  }

  function updatePostContent(event) {
    setNewPostContent(event.target.value);
  }

  async function makeNewPost() {
    const newPost = {
      owner: owner,
      text: newPostContent,
    };

    await axios.post('/api/blogpost', newPost);

    await getAllUserPost();

    setNewPostContent('');
  }

  // make a new post
  if(postListState.length === 0) {
    (<dev>What's on your mind?</dev>)
  }

  return (
    <div>
      <Navbar isLoggedIn={isLoggedIn} />
      <div className="userPageContainer">
        <div className="postContainer">{postComponent}</div>
        <div className="container">
          <h3>Make a new post</h3>
            <div>Content: </div>
            <input className="inputField" onInput={updatePostContent} value={newPostContent} />
            <button className="submitButton" onClick={makeNewPost}>Submit</button>
        </div>
    </div>
  </div>
  );
}

export default UserPage;
