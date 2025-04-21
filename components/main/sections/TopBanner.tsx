import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Image from 'next/image';

const BannerContainer = styled.section`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  padding: 0 16.7vw;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  user-select: none;
  background-color: black;

  @media (max-width: 1024px) {
    padding: 0 2rem;
    height: 100vh;
  }
`;

const BackgroundSlide = styled.div<{ $isActive: boolean; $bgImage: string }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${(props) => props.$bgImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: ${(props) => (props.$isActive ? 1 : 0)};
  transition: opacity 1s ease-in-out;
  z-index: 0;
`;

const GNB = styled.nav`
  width: 100%;
  height: auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-top: clamp(20px, 2.08vw, 40px);
  user-select: none;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  user-select: none;
  height: 32px;

  img {
    height: 32px;
    width: auto;
    object-fit: contain;
    pointer-events: none;
  }

  span {
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 20px;
    color: #ffffff;
    line-height: 32px;
  }

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const MainMenu = styled.div`
  display: flex;
  gap: clamp(24px, 2.5vw, 48px);
  user-select: none;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    justify-content: center;
  }

  a {
    font-family: 'Pretendard';
    font-size: clamp(14px, 0.83vw, 16px);
    color: #ffffff;
    text-decoration: none;

    &:hover {
      color: #0066ff;
    }
  }
`;

const UserMenu = styled.div`
  display: flex;
  gap: clamp(16px, 1.67vw, 32px);
  user-select: none;

  @media (max-width: 768px) {
    margin-top: 1rem;
  }

  button {
    font-family: 'Pretendard';
    font-size: clamp(14px, 0.83vw, 16px);
    color: #ffffff;
    background: none;
    border: none;
    cursor: pointer;

    &:hover {
      color: #0066ff;
    }
  }
`;

const FadeContent = styled.div<{ $isActive: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 0 16.7vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transform: translateY(0);
  opacity: ${(props) => (props.$isActive ? 1 : 0)};
  transition: opacity 0.8s ease-in-out;
  transition-delay: ${(props) => (props.$isActive ? '0.3s' : '0s')};
  z-index: 1;

  @media (max-width: 1024px) {
    padding: 0 2rem;
  }

  @media (max-width: 768px) {
    justify-content: flex-start;
    padding-top: 180px;
  }
`;

const MainTitle = styled.div`
  max-width: clamp(360px, 37.5vw, 720px);
  width: 100%;
  user-select: none;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.2em;

  @media (max-width: 1366px) {
    max-width: 100%;
    gap: 0.1em;
  }

  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
    gap: 0.3em;
  }
`;

const TitleText = styled.h1`
  font-family: 'Pretendard';
  font-weight: 800;
  font-size: clamp(40px, 3.5vw, 80px);
  color: #ffffff;
  line-height: 1.25;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  user-select: none;
  word-break: keep-all;

  @media (max-width: 1366px) {
    font-size: clamp(32px, 2.8vw, 40px);
    line-height: 1.3;
  }

  @media (max-width: 768px) {
    font-size: clamp(28px, 5vw, 32px);
    line-height: 1.4;
  }
`;

const Description = styled.p`
  font-family: 'Pretendard';
  font-size: clamp(16px, 1.04vw, 20px);
  color: #ffffff;
  margin-top: clamp(16px, 1.25vw, 24px);
  max-width: clamp(360px, 37.5vw, 720px);
  line-height: 1.5;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  user-select: none;

  @media (max-width: 768px) {
    font-size: 16px;
    margin-top: 1rem;
  }
`;

const PageNumber = styled.div`
  position: absolute;
  right: clamp(2rem, 16.7vw, 320px);
  bottom: clamp(60px, 6.25vw, 120px);
  font-family: 'Pretendard';
  font-size: clamp(14px, 0.83vw, 16px);
  color: #ffffff;
  user-select: none;

  @media (max-width: 768px) {
    right: 2rem;
    bottom: 2rem;
  }
`;

const TopBanner: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  const backgroundImages = [
    '/images/main1.png',
    '/images/main2.png',
    '/images/main3.png',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % backgroundImages.length);
      setCurrentPage((prev) => (prev % totalPages) + 1);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <BannerContainer>
      {backgroundImages.map((img, idx) => (
        <BackgroundSlide
          key={idx}
          $isActive={idx === currentBgIndex}
          $bgImage={img}
        />
      ))}

      <GNB>
        <Logo>
          <div style={{ position: 'relative', width: '32px', height: '32px' }}>
            <Image
              src="/images/logo.png"
              alt="HyGE Logo"
              fill
              sizes="32px"
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
          <span>HyGE</span>
        </Logo>
        <UserMenu>
          <button>로그인</button>
          <button>회원가입</button>
        </UserMenu>
      </GNB>

      <FadeContent $isActive={currentBgIndex === 0}>
        <MainTitle>
          <TitleText>SAFETY AS{'\u00A0'}STANDARD</TitleText>
          <TitleText>EFFICIENCY AS{'\u00A0'}EXTRA</TitleText>
        </MainTitle>
        <Description>
          수소생산시설 안전모니터링 시스템으로 미래 에너지의 안전을 선도하세요.
          위험을 예측하고, 이상을 감지해 빠르게 대응하는 스마트한 솔루션으로
          고객과 직원 모두에게 안심을 드립니다.
        </Description>
      </FadeContent>

      <FadeContent $isActive={currentBgIndex === 1}>
        <MainTitle>
          <TitleText>HYDROGEN{'\u00A0'}STATION</TitleText>
          <TitleText>BOOKING{'\u00A0'}AND</TitleText>
          <TitleText>PAYMENT{'\u00A0'}SYSTEM</TitleText>
        </MainTitle>
        <Description>
          수소충전소 예약 및 결제 시스템으로 더 편리한 충전 서비스를 경험하세요.
          실시간 예약 현황 간편한 결제로 기다림 없는 충전이 가능합니다.
        </Description>
      </FadeContent>

      <FadeContent $isActive={currentBgIndex === 2}>
        <MainTitle>
          <TitleText>INNOVATION AND{'\u00A0'}SAFETY</TitleText>
          <TitleText>IN{'\u00A0'}HARMONY</TitleText>
        </MainTitle>
        <Description>
          혁신적인 기술과 안전한 운영이 조화를 이루는 수소 에너지의 미래를
          만들어갑니다. 지속 가능한 에너지 솔루션으로 더 나은 내일을 향해
          나아갑니다.
        </Description>
      </FadeContent>

      <PageNumber>
        {String(currentPage).padStart(2, '0')}/
        {String(totalPages).padStart(2, '0')}
      </PageNumber>
    </BannerContainer>
  );
};

export default TopBanner;
