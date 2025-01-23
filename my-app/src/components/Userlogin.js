import React,{ useState } from 'react'
import axios from 'axios';
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
width: 75%;
min-height: 100vh;
margin:0 auto;
display: flex;
justify-content: center;
align-items:center;
`
function Userlogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userNotification, setUserNotification] = useState(null);
  const navigate =useNavigate('');

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };


  const handleSubmituser = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/login', { username, password });
      
      if (response.data._id) { // Check if the response contains the user ID
        const userId = response.data._id; // Extract the user ID
        setUserNotification("Logged in successfully");
        
        // Navigate to AddSystem page and pass the userId via state
        navigate('/add-system', { state: { userId } });
      } else {
        setUserNotification("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setUserNotification("An error occurred. Please try again.");
    }
  };
  
  
    return (
        <Container>
        <div className="section">
        <h2>Login User</h2>
        <form onSubmit={handleSubmituser}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={handleUsernameChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <button type="submit">Submit</button>
        {userNotification && <p>{userNotification}</p>}
      </form>
      </div>
        </Container>
    )
 
}

export default Userlogin;
