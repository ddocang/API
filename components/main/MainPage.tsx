'use client';
import React from 'react';
import styled from 'styled-components';
import TopBanner from './sections/TopBanner';
import Copy01 from './sections/Copy01';
import ServiceSection from './sections/ServiceSection';
import MapSection from './sections/MapSection';
import PriceSection from './sections/PriceSection';
import Copy02 from './sections/Copy02';
import NewsSection from './sections/NewsSection';
import Footer from './sections/Footer';

const MainContainer = styled.main`
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;

  > section {
    width: 100%;
    max-width: 100vw;
  }

  @media (max-width: 1024px) {
    > section {
      padding-left: 1rem;
      padding-right: 1rem;
    }
  }
`;

const MainPage: React.FC = () => {
  return (
    <MainContainer>
      <TopBanner />
      <Copy01 />
      <ServiceSection />
      <MapSection />
      <PriceSection />
      <Copy02 />
      <NewsSection />
      <Footer />
    </MainContainer>
  );
};

export default MainPage;
