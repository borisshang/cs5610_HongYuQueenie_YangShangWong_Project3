import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './UserPage.css';
import Navbar from './Navbar';

function UserPage() {
  // show the post
  const [postListState, setPostListState] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userName, setUsername] = useState('');
  const [joinTimestamp, setJoinTimestamp] = useState('');

  const params = useParams();
  const owner = params.owner;

  async function getUsername() {
    const response = await axios.get('/api/user/isLoggedIn');

    if (response.data.username) {
      setUsername(response.data.username);

    }
  }

  

  const getAllUserPost = async () => {
    const response = await axios.get(`/api/blogpost`);
    setPostListState(response.data);
  };

  useEffect(() => {
    async function getUserInformation() {
      try {
        const userResponse = await axios.get(`/api/user/joinTimestamp/${owner}`);
        const createdTime = userResponse.data.joinTimestamp;
        const parsedDate = new Date(createdTime);
        const formattedDate = parsedDate.toLocaleString(); 
        setJoinTimestamp(formattedDate);
      } catch (error) {
        console.error('Error retrieving user information:', error);
      }
    }
    getAllUserPost();
    getUsername();
    getUserInformation();
  }, [owner, userName]);

  const handleUpdate = async (postId) => {
    try {
      const updatedText = prompt('Enter the updated text:');
      if (updatedText !== null) {
        await axios.put(`/api/blogpost/${postId}`, { text: updatedText });
        await getAllUserPost();
      }
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleDelete = async (postId) => {
    try {
      if (window.confirm('Are you sure you want to delete this post?')) {
        await axios.delete(`/api/blogpost/${postId}`);
        await getAllUserPost();
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const postComponent = [...postListState].filter(post => post.owner.toLowerCase() === owner.toLowerCase()).reverse().map((post) => {
    const postTimestamp = new Date(post.timestamp);
  
    const formattedTimestamp = `${postTimestamp.getFullYear()}/${(postTimestamp.getMonth() + 1).toString().padStart(2, '0')}/${postTimestamp.getDate().toString().padStart(2, '0')} ${postTimestamp.getHours().toString().padStart(2, '0')}:${postTimestamp.getMinutes().toString().padStart(2, '0')}:${postTimestamp.getSeconds().toString().padStart(2, '0')}`;
  
    return (
      <div key={post._id} className="postContainer">
        <div className="postContent">
          <div className="post-owner">{post.owner}</div>
          <div className="post.text">{post.text}</div>
          <div className="post.timestamp">{formattedTimestamp}</div>
        </div>
        {userName === owner && (
        <div className="postButtons">
          <button onClick={() => handleUpdate(post._id)}>Update</button>
          <button onClick={() => handleDelete(post._id)}>Delete</button>
        </div>
      )}
      </div>
    );
  });
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

  let usernameMessage = <div>Loading...</div>;
  if (userName) {
    usernameMessage = <div>Logged in as {userName}</div>;
  }

  console.log('joinTimestamp: ', joinTimestamp)

  return (
    <div>
      {userName.toLowerCase() === owner.toLowerCase() && (
        <>
          <Navbar isLoggedIn={isLoggedIn} userName={userName}/>
          
          <div className="userPageContainer">
            <h1>{usernameMessage}</h1>
            <div className="container">
              <h3>Make a new post</h3>
              <div>Content: </div>
              <input 
                className="inputField" 
                onInput={updatePostContent} 
                value={newPostContent} 
              />
              <button 
                className="submitButton" 
                onClick={makeNewPost}
              >
                Submit
              </button>
            </div>
            <p>Joined on: {joinTimestamp}</p>
            <div className="postContainer">{postComponent}</div>
          </div>
        </>
      )}
      {userName.toLowerCase() !== owner.toLowerCase() && (
      <>
        {userName ? <Navbar isLoggedIn={isLoggedIn} userName={userName}/> : <Navbar />}
        
        <div className="userPageContainer">
          <h1>{owner}'s Profile</h1>
          <div className="postContainer">{postComponent}</div>
        </div>
      </>
    )}
    </div>
  );
}

export default UserPage;
