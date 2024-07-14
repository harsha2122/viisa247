import React from 'react';
import styled, { keyframes } from 'styled-components';
import Robot from '../../../_metronic/assets/card/3dchat1.webp';
import { GiBeveledStar } from "react-icons/gi";

const WelcomeContainer: React.FC = () => (
  <Container>
    <BounceImage width='150px' height='150px' src={Robot} alt="" />
    <h1>Welcome <RotatingStar><GiBeveledStar style={{fontSize:"28px", color:"#327113"}} /></RotatingStar></h1>
    <h3>Please select a chat to start messaging.</h3>
  </Container>
);

const rotateAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const RotatingStar = styled.span`
  display: inline-block;
  animation: ${rotateAnimation} 2s linear infinite;
`;

const bounceAnimation = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-30px);
  }
  60% {
    transform: translateY(-15px);
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80dvh;
  gap: 15px;
  color: white;
  flex-direction: column;
  h1, h3 {
    margin: 0;
  }
`;

const BounceImage = styled.img`
  animation: ${bounceAnimation} 2s infinite;
`;

export default WelcomeContainer;
