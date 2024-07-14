import React, { useState, useEffect, useRef } from "react";
import styled from 'styled-components';
import ChatInput from "./ChatInput";
import { v4 as uuidv4 } from "uuid";
import axiosInstance from '../../../app/helpers/axiosInstance';
import Cookies from 'js-cookie';
import { io, Socket } from "socket.io-client";

interface ChatContainerProps {
  currentChat?: any;
  socket?: React.MutableRefObject<any>;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ currentChat }) => {
  const [messages, setMessages] = useState<any[]>([]); // Initialize messages as an empty array
  const scrollRef = useRef<any>();
  const socketRef = useRef<Socket | null>(null);
  const [arrivalMessage, setArrivalMessage] = useState<any | null>();

  const handleSendMsg = async (msg: string) => {
    try {
      const userIdFromCookies = Cookies.get('user_id');
      let sendMessageRoute = "/backend/add_message";
      if (socketRef.current && userIdFromCookies) {
        const toId = "6523a9eed9be7d310661ecc4";
        socketRef.current.emit("send-msg", {
          to: toId,
          from: userIdFromCookies,
          msg,
        });

        await axiosInstance.post(sendMessageRoute, {
          from: userIdFromCookies,
          to: toId,
          message: msg,
        });

        const msgs = [...messages];
        msgs.push({ fromSelf: true, message: msg });
        setMessages(msgs);
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
      setMessages((prevMessages) => [...prevMessages, { ...receivedMessage, time: receivedMessage.createdAt }]);
    });
  }, [socketRef]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userIdFromCookies = Cookies.get('user_id');
        let receiveMessageRoute = "/backend/get_message";
  
        if (receiveMessageRoute) {
          const toId = '6523a9eed9be7d310661ecc4';
          const messagesResponse = await axiosInstance.post(receiveMessageRoute, {
            from: userIdFromCookies,
            to: toId,
          });
  
          const msgs = messagesResponse.data.data.map((msg) => {
            return {
              ...msg,
              time: msg.createdAt, 
            };
          });
          setMessages(msgs);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [currentChat]);

  useEffect(() => {
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="username">
            <h3>Chat Support !</h3>
          </div>
        </div>
      </div>
      <div className="chat-messages" ref={scrollRef}>
        {messages.map((message) => (
          <div
            key={uuidv4()}
            className={`message ${message.fromSelf ? "sended" : "received"}`}
          >
            <div className="content">
              <p>{message.message}</p>
              <h6 style={{fontSize:"11px", fontWeight:"500", textAlign:"right"}}>{message.time}</h6>
            </div>
          </div>
        ))}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 5% 85% 10%;
  gap: 0.1rem;
  width: 25vw;
  overflow: hidden;
  
  .chat-header {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .username {
        h3 {
          color: black;
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
        max-width: 70%;
        overflow-wrap: break-word;
        padding: 10px 20px 0px 20px;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #000;
      }
    }
    
    .sended {
      .content {
        background-color: #dbfbcc;
        margin-left: auto;
        border-radius: 5px 15px 5px 15px;
      }
    }
    
    .received {
      .content {
        background-color: #f4f4f4;
        margin-right: auto;
        border-radius: 15px 5px 15px 5px;
      }
    }
  }
`;

export default ChatContainer;
