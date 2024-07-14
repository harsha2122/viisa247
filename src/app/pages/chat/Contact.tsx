import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Logo from "../../../_metronic/assets/icons/logo.png";
import axiosInstance from '../../../app/helpers/axiosInstance';
import Cookies from 'js-cookie';
import toast, { Toaster } from 'react-hot-toast';
import { io, Socket } from "socket.io-client";

interface ContactsProps {
  contacts: any[];
  changeChat: (contact: any) => void;
}
const Contacts: React.FC<ContactsProps> = ({ contacts, changeChat }) => {
  const [currentUserName, setCurrentUserName] = useState<string | undefined>(undefined);
  const [currentUserImage, setCurrentUserImage] = useState<string | undefined>(undefined);
  const [currentSelected, setCurrentSelected] = useState<number | undefined>(undefined);
  const [merchants, setMerchants] = useState<any[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const [profile, setProfile] = useState({
    merchant_email_id: '',
    merchant_name: '',
    merchant_profile_photo: '',
    super_admin_profile_photo: '',
    super_admin_name: '',
    super_admin_email: ''
  });
  const user_type = Cookies.get('user_type');

  useEffect(() => {
    if (user_type === 'merchant') {
      fetchProfileData();
    } else {
      fetchData();
    }
  }, []);

  const fetchProfileData = async () => {
    try {
      const user_id = Cookies.get('user_id');
      const postData = { id: user_id };
      const response = await axiosInstance.post('/backend/fetch_single_merchant_user', postData);
      if (response.status === 203) {
        toast.error('Please Logout And Login Again', { position: 'top-center' });
      }
      setProfile(response.data.data);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  const fetchData = async () => {
    try {
      const user_id = Cookies.get('user_id')
      axiosInstance.post('/backend/fetch_super_admin', {
        id: user_id
      })
        .then((response) => {
          const responseData = response.data.data;
          setProfile(responseData[0])
        })
        .catch((error) => {
          console.error('Error fetching VISA 247 data:', error);
        });

    } catch (error) {
      console.error('Error:', error);
    }
  };


  const [initialChatSet, setInitialChatSet] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user_id = Cookies.get('user_id');
        const response = await axiosInstance.get('/backend/all_user');
        const mappedMerchants = response.data.data.map((merchant) => ({
          _id: merchant._id,
          merchant_name: merchant.merchant_name,
          unreadCount: merchant.unreadCount,
          merchant_profile_photo: merchant.merchant_profile_photo,
        }));

        setMerchants(mappedMerchants);

        if (!initialChatSet && mappedMerchants.length > 0) {
          // changeChat(mappedMerchants[0]); // Comment out this line
          setInitialChatSet(true);
        }

        if (user_type === 'super_admin') {
          setCurrentUserName(profile.super_admin_name);
          setCurrentUserImage(profile.super_admin_profile_photo);
        } else if (user_type === 'merchant') {
          setCurrentUserName(profile.merchant_name);
          setCurrentUserImage(profile.merchant_profile_photo);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [changeChat, profile, user_type, initialChatSet]);

  const handleReceivedMessage = (receivedMessage: any) => {
  };

  useEffect(() => {
    if (user_type === 'merchant') {
      fetchProfileData();
  
      const backendURL = `${window.location.origin}/backend`;

      socketRef.current = io(backendURL, {
        withCredentials: true,
      });
  
      socketRef.current.on("connect", () => {
      });
  
      socketRef.current.on("msg-recieve", (receivedMessage) => {
        handleReceivedMessage(receivedMessage);
      });
  
      socketRef.current.on("disconnect", () => {
      });
  
      socketRef.current.on("error", (error) => {
        console.error("Socket error:", error);
      });
    } else {
      fetchData();
    }
  
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user_type, handleReceivedMessage]);


  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on("msg-recieve", (receivedMessage) => {

        setMerchants((prevMerchants) => {
          return prevMerchants.map((merchant) => {
            const isSuperadminMessage = receivedMessage.from === "superadmin_id";
            const isMessageFromMerchant = merchant?.data?._id === receivedMessage.from;

            if (isMessageFromMerchant || isSuperadminMessage) {
              return {
                ...merchant,
                unreadMessages: (merchant.unreadMessages || 0) + 1,
              };
            }
            return merchant;
          });
        });
      });
    }
  }, [socketRef.current, setMerchants]);

  const changeCurrentChat = (index: number, contact: any) => {
    setCurrentSelected(index);
    changeChat(contact);
  };


  return (
    <>
    <Toaster />
      {currentUserImage && currentUserImage && (
        <Container>
          <div className="brand">
            {/* <img src={Logo} alt="logo" /> */}
            <h3>Recent</h3>
          </div>
          <div className="contacts">
          {Array.isArray(merchants) &&
              merchants.map((merchantObject: any, index: number) => (
                <div
                  key={index}
                  className={`contact ${index === currentSelected ? "selected" : ""}`}
                  onClick={() => changeCurrentChat(index, merchantObject)}
                >
                <div className="avatar">
                  <img src={merchantObject.merchant_profile_photo} alt="" />
                </div>
                <div className="username">
                  <h3>{merchantObject.merchant_name}</h3>
                    <span className="unread-count">{merchantObject.unreadCount}</span>
                </div>
            </div>
          ))}
          </div>
        </Container>
      )}
    </>
  );
};


const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-color: #fff;
  border-right: 1px solid #3271131a;
  padding-right: 30px;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 2rem;
    }
    h3 {
      color: black;
    }
  }
  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .contact {
      background-color: #fff;
      cursor: pointer;
      width: 100%;
      padding: 5px 15px;
      border-top: 1px solid #dadada;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;
      .avatar {
        img {
          height: 35px;
          width: 35px;
          border-radius: 50%;
        }
      }
      .username {
        h3 {
          color: black;
          font-size: 14px;
          font-weight: 500;
          margin-top: 5px;
        }
        .unread-count{
          color: black;
          font-size: 14px;
          font-weight: 500;
        }
      }
    }

    .contact:last-child {
      border-bottom: 1px solid #dadada;
    }
    
    .selected {
      background: linear-gradient(0deg, hsla(0, 0%, 100%, 1) 0%, hsla(124, 32%, 85%, 1) 100%);
      border-right: 2px solid #327113;
    }
  }

  .current-user {
    background-color: #0d0d30;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    .avatar {
      img {
        height: 45px;
        width: 45px;
        border-radius: 50%;
        max-inline-size: 100%;
      }
    }
    .username {
      h2 {
        color: white;
      }
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }
  }
`;


export default Contacts;