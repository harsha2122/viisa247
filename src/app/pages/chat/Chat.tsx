import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import styled from "styled-components";
import ChatContainer from "./ChatContainer";
import Contacts from "./Contact";
import SuperadminChatContainer from "./SuperadminChatContainer";
import Cookies from 'js-cookie';
import axiosInstance from '../../../app/helpers/axiosInstance';

const Chat: React.FC = () => {
  const navigate = useNavigate();
  const socketRef = useRef<Socket | null>(null);
  const [currentUser, setCurrentUser] = useState<any | undefined>(undefined);
  const [currentChat, setCurrentChat] = useState<any | undefined>(undefined);
  const [merchantList, setMerchantList] = useState<any[]>([]);

  useEffect(() => {
    const user = {
      user_type: Cookies.get('user_type'),
    };
    
    setCurrentUser(user);
  }, []);  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.post(`/backend/fetch_merchant_user`);
        setMerchantList(response.data);

        if (response.data.length > 0) {
          setCurrentChat(response.data[0]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [currentUser]);

  useEffect(() => {
    const socket = io();
    socketRef.current = socket;

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);  

  const handleChatChange = (chat: any) => {
    setCurrentChat(chat);
  };

  return (
    <>
      {currentUser && currentUser.user_type === 'super_admin' && (
        <Container>
          <div className="container">
              <Contacts contacts={merchantList} changeChat={handleChatChange} />
              <SuperadminChatContainer currentChat={currentChat} />
          </div>
        </Container>
      )}
      {currentUser && currentUser.user_type === 'merchant' && (
      <Container>
        <div className="container1">
            <ChatContainer currentChat={currentChat} socket={socketRef} />
        </div>
      </Container>
      )}
    </>
  );
};

const Container = styled.div`
    height: 100%;
    width: 100%;
    margin-top: -50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    align-items: center;
    background-color: #fff;
    .container {
        height: 85vh;
        width: 85vw;
        background-color: #fff;
        display: grid;
        grid-template-columns: 25% 75%;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
            grid-template-columns: 35% 65%;
        }
    }
    .container1 {
      height: 90vh;
      width: 25vw;
      margin-top: 100px; 
      background-color: #fff;
      display: grid;
      grid-template-columns: 25% 75%;
      @media screen and (min-width: 720px) and (max-width: 1080px) {
          grid-template-columns: 35% 65%;
      }
  }
`;

export default Chat;
