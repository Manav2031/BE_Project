import React, { useState } from 'react';
import styled from 'styled-components';
import Fuse from 'fuse.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import data from '../data/data.json';
import { FaMicrophone } from 'react-icons/fa'; // Import microphone icon from react-icons

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY); // Read API key from .env
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

// Initialize Fuse.js for fuzzy searching
const fuse = new Fuse(data.questions, {
  keys: ['question'], // Search only in the 'question' field
  includeScore: true, // Include a match score
  threshold: 0.3, // Lower threshold means stricter matching
});

const ChatbotContainer = styled.div`
  position: fixed;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  width: 350px;
  height: 500px;
  background-color: #f1f1f1;
  border: 1px solid #ccc;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const ChatHeader = styled.div`
  padding: 10px;
  background-color: #968df0;
  color: white;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const HeaderTitle = styled.span`
  width: 8000px;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 14px;
  cursor: pointer;
  padding: 2px;
`;

const ChatBody = styled.div`
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Message = styled.div`
  max-width: 80%;
  padding: 10px;
  border-radius: 10px;
  word-wrap: break-word;
  font-size: 14px;

  &.user {
    align-self: flex-end;
    background-color: #968df0;
    color: white;
  }

  &.bot {
    align-self: flex-start;
    background-color: #e1e1e1;
    color: black;
  }
`;

const ChatInput = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-top: 1px solid #ccc;
`;

const InputField = styled.input`
  padding: 10px !important;
  margin: 10px 0 !important;
  width: calc(100% - 20px) !important;
  border: 1px solid #ccc !important;
  border-radius: 5px !important;
  font-size: 14px !important;
  color: black !important;
`;

const SendButton = styled.button`
  margin-top: 10px;
  padding: 10px 0;
  background-color: #968df0;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  width: 100%;
`;

const MicButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #968df0;
  font-size: 20px;
  margin-left: 10px;
`;

function Chatbot({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isListening, setIsListening] = useState(false);

  const fetchGeminiResponse = async (query) => {
    try {
      const result = await model.generateContent(query);
      return result.response.text();
    } catch (error) {
      console.error('Error fetching Gemini response:', error);
      return "Sorry, I couldn't fetch a response.";
    }
  };

  const handleSendMessage = async () => {
    if (userInput.trim() === '') return;

    const userMessage = { text: userInput, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    const searchResult = fuse.search(userInput);

    let botMessage;
    if (searchResult.length > 0) {
      botMessage = {
        text: searchResult[0].item.answer,
        sender: 'bot',
      };
    } else {
      const geminiResponse = await fetchGeminiResponse(userInput);
      botMessage = {
        text: geminiResponse,
        sender: 'bot',
      };
    }

    setMessages((prevMessages) => [...prevMessages, botMessage]);
    setUserInput('');
  };

  const startListening = () => {
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();
    setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setUserInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onspeechend = () => {
      recognition.stop();
      setIsListening(false);
    };
  };

  return (
    <ChatbotContainer>
      <ChatHeader>
        <HeaderTitle>Electron Eye Chatbot</HeaderTitle>
        <CloseButton onClick={onClose}>×</CloseButton>
      </ChatHeader>
      <ChatBody>
        {messages.map((msg, index) => (
          <Message key={index} className={msg.sender}>
            {msg.text}
          </Message>
        ))}
      </ChatBody>
      <ChatInput>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <InputField
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <MicButton onClick={startListening} disabled={isListening}>
            <FaMicrophone />
          </MicButton>
        </div>
        <SendButton onClick={handleSendMessage}>Send</SendButton>
      </ChatInput>
    </ChatbotContainer>
  );
}

export default Chatbot;

// import React, { useState } from 'react';
// import styled from 'styled-components';
// import Fuse from 'fuse.js';
// import { GoogleGenerativeAI } from '@google/generative-ai';
// import data from '../data/data.json';

// // Initialize Gemini API
// const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY); // Read API key from .env
// const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

// // Initialize Fuse.js for fuzzy searching
// const fuse = new Fuse(data.questions, {
//   keys: ['question'], // Search only in the 'question' field
//   includeScore: true, // Include a match score
//   threshold: 0.3, // Lower threshold means stricter matching
// });

// const ChatbotContainer = styled.div`
//   position: fixed;
//   top: 50%;
//   right: 20px;
//   transform: translateY(-50%);
//   width: 350px;
//   height: 500px;
//   background-color: #f1f1f1;
//   border: 1px solid #ccc;
//   border-radius: 10px;
//   display: flex;
//   flex-direction: column;
//   box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
// `;

// const ChatHeader = styled.div`
//   padding: 10px;
//   background-color: #968df0;
//   color: white;
//   border-top-left-radius: 10px;
//   border-top-right-radius: 10px;
//   display: flex;
//   justify-content: center;
//   align-items: center;
// `;

// const HeaderTitle = styled.span`
//   width: 8000px;
//   text-align: center;
//   font-size: 16px;
//   font-weight: bold;
// `;

// const CloseButton = styled.button`
//   background: none;
//   border: none;
//   color: white;
//   font-size: 14px; /* Reduce size */
//   cursor: pointer;
//   padding: 2px; /* Less padding */
// `;

// const ChatBody = styled.div`
//   flex: 1;
//   padding: 10px;
//   overflow-y: auto;
//   display: flex;
//   flex-direction: column;
//   gap: 10px; /* Spacing between messages */
// `;

// const Message = styled.div`
//   max-width: 80%;
//   padding: 10px;
//   border-radius: 10px;
//   word-wrap: break-word;
//   font-size: 14px;

//   &.user {
//     align-self: flex-end; /* Sender message on the right */
//     background-color: #968df0;
//     color: white;
//   }

//   &.bot {
//     align-self: flex-start; /* Receiver message on the left */
//     background-color: #e1e1e1;
//     color: black;
//   }
// `;

// const ChatInput = styled.div`
//   display: flex;
//   flex-direction: column; /* Stack input and button */
//   padding: 10px;
//   border-top: 1px solid #ccc;
// `;

// const InputField = styled.input`
//   padding: 10px !important;
//   margin: 10px 0 !important;
//   width: calc(100% - 20px) !important;
//   border: 1px solid #ccc !important;
//   border-radius: 5px !important;
//   font-size: 14px !important;
//   color: black !important; /* Change text color to black */
// `;

// const SendButton = styled.button`
//   margin-top: 10px; /* Add space between input and button */
//   padding: 10px 0; /* Full width button */
//   background-color: #968df0;
//   color: white;
//   border: none;
//   border-radius: 5px;
//   cursor: pointer;
//   font-size: 14px;
//   width: 100%;
// `;

// function Chatbot({ onClose }) {
//   const [messages, setMessages] = useState([]);
//   const [userInput, setUserInput] = useState('');

//   const fetchGeminiResponse = async (query) => {
//     try {
//       const result = await model.generateContent(query);
//       return result.response.text(); // Return the generated text
//     } catch (error) {
//       console.error('Error fetching Gemini response:', error);
//       return "Sorry, I couldn't fetch a response.";
//     }
//   };

//   const handleSendMessage = async () => {
//     if (userInput.trim() === '') return;

//     const userMessage = { text: userInput, sender: 'user' };
//     setMessages((prevMessages) => [...prevMessages, userMessage]);

//     const searchResult = fuse.search(userInput);

//     let botMessage;
//     if (searchResult.length > 0) {
//       botMessage = {
//         text: searchResult[0].item.answer,
//         sender: 'bot',
//       };
//     } else {
//       const geminiResponse = await fetchGeminiResponse(userInput);
//       botMessage = {
//         text: geminiResponse,
//         sender: 'bot',
//       };
//     }

//     setMessages((prevMessages) => [...prevMessages, botMessage]);
//     setUserInput('');
//   };

//   return (
//     <ChatbotContainer>
//       <ChatHeader>
//         <HeaderTitle>Electron Eye Chatbot</HeaderTitle>
//         <CloseButton onClick={onClose}>×</CloseButton>
//       </ChatHeader>
//       <ChatBody>
//         {messages.map((msg, index) => (
//           <Message key={index} className={msg.sender}>
//             {msg.text}
//           </Message>
//         ))}
//       </ChatBody>
//       <ChatInput>
//         <InputField
//           type="text"
//           value={userInput}
//           onChange={(e) => setUserInput(e.target.value)}
//           placeholder="Type a message..."
//           onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
//         />
//         <SendButton onClick={handleSendMessage}>Send</SendButton>
//       </ChatInput>
//     </ChatbotContainer>
//   );
// }

// export default Chatbot;
