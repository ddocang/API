'use client';

import React, { useState, useEffect } from 'react';
import TopBanner from './TopBanner';
import TubeTrailerList from './TubeTrailerList';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { colors } from '@/app/styles/colors';
import { useParams, usePathname, useRouter } from 'next/navigation';
import {
  PopupOverlay,
  DetailedGraphPopup,
  PopupHeader,
  CloseButton,
  PopupButton,
} from '../styles';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  @media (max-width: 768px) {
    height: auto;
    min-height: 100vh;
    padding: 0;
  }
`;

const LayoutContainer = styled.div`
  display: flex;
  align-items: stretch;
  width: 100%;
  flex: 1;
  gap: 15px;
  padding: 15px;
  min-height: 0;
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
    padding: 8px;
  }
`;

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  flex: 1;
  min-height: 0;
  height: 100%;
  overflow: hidden;
  @media (max-width: 768px) {
    gap: 8px;
    height: auto;
  }
`;

const TubeTrailerInfoContainer = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  padding: 0;
  border: 1px solid ${colors.theme.light.border};
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: stretch;
  font-family: 'Pretendard', sans-serif;
  overflow: hidden;
  min-height: 0;
  @media (max-width: 768px) {
    min-height: 220px;
    height: 220px;
    margin-bottom: 8px;
  }
`;

const TubeTrailerBottomContainer = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid ${colors.theme.light.border};
  height: auto;
  overflow: hidden;
  font-family: 'Pretendard', sans-serif;
  flex-shrink: 0;
  @media (max-width: 768px) {
    height: auto;
    min-height: 120px;
    img {
      height: 80px;
      object-fit: contain;
    }
  }
`;

const ListCard = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  padding: 20px 0 0 0;
  margin: 0px 0 0px 0px;
  display: flex;
  flex-direction: column;
  min-height: 0;
  flex: 1;
  border: 1px solid ${colors.theme.light.border};
  font-family: 'Pretendard', sans-serif;
  @media (max-width: 768px) {
    padding: 10px 0 0 0;
    border-radius: 10px;
  }
`;

// SSR 비활성화
const TubeTrailerMap = dynamic(() => import('./TubeTrailerMap'), {
  ssr: false,
});

const TubeTrailerPage = () => {
  const params = useParams() as { id: string };
  const pathname = usePathname();
  const router = useRouter();
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState('');

  useEffect(() => {
    setLastUpdateTime(new Date().toLocaleTimeString());
  }, []);

  return (
    <PageContainer>
      <TopBanner
        params={params}
        pathname={pathname ?? ''}
        isMobile={false}
        lastUpdateTime={lastUpdateTime}
        setIsLogOpen={setIsLogOpen}
        router={router}
      />
      <LayoutContainer>
        <ColumnContainer>
          <div
            style={{
              flex: 1,
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <TubeTrailerList />
          </div>
          <TubeTrailerBottomContainer>
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src="/images/tube-trailer/tt 2.svg"
                alt="튜브 트레일러"
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                  borderRadius: '16px',
                }}
              />
            </div>
          </TubeTrailerBottomContainer>
        </ColumnContainer>
        <TubeTrailerInfoContainer>
          <TubeTrailerMap />
        </TubeTrailerInfoContainer>
      </LayoutContainer>
    </PageContainer>
  );
};

export default TubeTrailerPage;
