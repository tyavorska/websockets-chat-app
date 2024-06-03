'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

import styles from './page.module.css';

const Home = () => {
  const [message, setMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [isLogIn, setIsLogIn] = useState(false);
  const [islogout, setIsLogOut] = useState('');

  const socket = io('http://localhost:5000');

  socket.on('received_message', (data) => {
    setMessageList([...messageList, data]);
  });

  socket.on('left-chat', (data) => {
    setIsLogOut(data);
  });

  socket.on('disconnect', (reason) => {
    // the reason of the disconnection, for example "transport error"
    console.log(reason);
  });

  const handleSendMessage = () => {
    socket.emit('send_message', {
      userName,
      message,
    });

    setMessage('');
  };

  const leftChatHandler = () => {
    socket.emit('left-chat', userName);
    socket.disconnect();
  };

  return (
    <div className={styles.container}>
      <h2>Realtime Chat App</h2>
      {!isLogIn ? (
        <div className={styles.chatInputButton}>
          <input
            value={userName}
            placeholder="Enter your nickname"
            onChange={(e) => setUserName(e.target.value)}
          />
          <button onClick={() => setIsLogIn(true)}>Log In</button>
        </div>
      ) : (
        <div className={styles.user}>
          Log In as: <span className={styles.userName}>{userName}</span>
        </div>
      )}
      <div className={styles.chatInputButton}>
        <input
          type="text"
          placeholder="Enter your message."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send Message</button>
      </div>
      {messageList.map((chat) => (
        <div
          className={styles.chat}
          style={chat.userName === userName ? { justifyContent: 'end' } : {}}
          key={chat.message}
        >
          <div className={styles.avatar}>{chat.userName}</div>
          <div
            className={styles.chatArea}
            style={
              chat.userName === userName
                ? {
                    backgroundColor: 'rgb(56, 82, 103)',
                    color: 'rgb(255, 255, 255',
                  }
                : {}
            }
          >
            {chat.message}
          </div>
        </div>
      ))}
      {islogout ? (
        <div className={styles.logOut}>{islogout} user left the chat</div>
      ) : null}
      <div className={styles.chatInputButton}>
        {' '}
        {isLogIn ? (
          <button onClick={leftChatHandler}>Left the chat</button>
        ) : null}
      </div>
    </div>
  );
};

export default Home;
