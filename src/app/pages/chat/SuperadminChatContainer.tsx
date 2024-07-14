import React, { useState, useEffect, useRef } from "react";
import styled from 'styled-components';
import ChatInput from "./ChatInput";
import { v4 as uuidv4 } from "uuid";
import axiosInstance from '../../../app/helpers/axiosInstance';
import Cookies from 'js-cookie';
import { io, Socket } from "socket.io-client";
import Welcome from './Welcome';

interface SuperadminChatContainerProps {
  currentChat?: any;
  socket?: React.MutableRefObject<any>;
}

const SuperadminChatContainer: React.FC<SuperadminChatContainerProps> = ({ currentChat }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const scrollRef = useRef<any>();
  const socketRef = useRef<Socket | null>(null);
  const [arrivalMessage, setArrivalMessage] = useState<any | null>();
  const prevMessagesRef = useRef<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSendMsg = async (msg: string) => {
    try {
      const userIdFromCookies = Cookies.get('user_id');
      const toId = currentChat?._id || "";
      const sendMessageRoute = "/backend/add_message";

      if (socketRef.current && userIdFromCookies) {
        socketRef.current.emit("send-msg", {
          to: toId,
          from: userIdFromCookies,
          msg,
        });

        const response = await axiosInstance.post(sendMessageRoute, {
          from: userIdFromCookies,
          to: toId,
          message: msg,
        });

        setMessages((prevMessages) => [...prevMessages, { fromSelf: true, message: msg }]);
        prevMessagesRef.current = [...prevMessagesRef.current, { fromSelf: true, message: msg }];
      } else {
        console.error("Socket or user ID is not available.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    const backendURL = `${window.location.origin}/backend`;

    socketRef.current = io(backendURL, {
      withCredentials: true,
    });

    socketRef.current.on("connect", () => {
    });

    socketRef.current.on("msg-recieve", (receivedMessage) => {
      setMessages((prevMessages) => [...prevMessages, { fromSelf: false, message: receivedMessage }]);
    });

    socketRef.current.on("disconnect", () => {
    });

    socketRef.current.on("error", (error) => {
      console.error("Socket error:", error);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userIdFromCookies = Cookies.get('user_id');
        const receiveMessageRoute = "/backend/get_message";
    
        if (receiveMessageRoute && currentChat) {
          const toId = currentChat._id;
    
          const messagesResponse = await axiosInstance.post(receiveMessageRoute, {
            from: toId,
            to: userIdFromCookies,
          });
    
          const updatedMessages = messagesResponse.data.data.map((message) => {
            const isValidTimeString = (str) => {
              const date = new Date(str);
              return !isNaN(date.getTime());
            };
          
            // Check if time is a valid date-time string
            const time = isValidTimeString(message.time) ? Date.parse(message.time) : Date.now();          
            return { ...message, time };
          });
          
          // Set messages in state
          setMessages(updatedMessages);
          prevMessagesRef.current = updatedMessages;
          
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [currentChat]);


  useEffect(() => {
    // Scroll to the bottom when messages are updated
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const isCurrentUser = (message: any) => {
    const userIdFromCookies = Cookies.get('user_id');
    return message.fromSelf && message.from === userIdFromCookies;
  };

  const formatTime = (time: number) => {
    const date = new Date(time);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Container>
      {currentChat ? (
        <>
          <div className="chat-messages" ref={scrollRef}>
            {loading && <p>Loading...</p>}
            {!loading && messages &&
              messages
                .sort((a, b) => a.time - b.time)
                .map((message) => (
                  <div
                    key={uuidv4()}
                    className={`message ${isCurrentUser(message) ? "sended" : "received"}`}
                  >
                    <div className="content">
                      <p>{message.message}</p>
                      <h6 style={{fontSize:"11px", fontWeight:"500", float:"right", color:"rgb(152 152 152)"}}>{formatTime(message.time)}</h6>
                    </div>
                  </div>
                ))}
            <div ref={scrollRef}></div>
          </div>
          <ChatInput handleSendMsg={handleSendMsg} />
        </>
      ) : (
        <Welcome />
      )}
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 92% 10%;
  gap: 0.1rem;
  width: 50vw;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 85% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
        display: flex;
        align-items: center;
        .content {
          max-width: 40%;
          overflow-wrap: break-word;
          padding: 10px 20px 0px 20px;
          font-size: 1.1rem;
          border-radius: 1rem;
          color: #000;
          @media screen and (min-width: 720px) and (max-width: 1080px) {
            max-width: 70%;
          }
        }
      }
    
      .sended {
        .content {
          background-color: #f4f4f4;
          margin-right: auto;
          border-radius: 15px 5px 15px 5px;
        }
      }
    
      .received {
        .content {
          background-color: #dbfbcc;
          border-radius: 5px 15px 5px 10px;
          margin-left: auto; // Adjusted line to margin-left
        }
      }
    `;

export default SuperadminChatContainer;