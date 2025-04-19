'use client';

import Image from 'next/image';
import styled from '@emotion/styled';
import FacilityInfoCard from './components/FacilityInfoCard';
import FacilityListItem from './components/FacilityListItem';

// 더미 데이터
const DUMMY_FACILITY = {
  name: '삼척 교동 수소 스테이션',
  type: '대체연료충전소',
  address: '강원특별자치도 삼척시 교동 산 209',
  status: 'open' as const,
  phone: '033-575-5189 ext. 90',
  imageUrl: '/images/facility1.jpg',
};

const DUMMY_LIST = [
  {
    name: '삼척 교동 수소 스테이션',
    address: '강원특별자치도 삼척시 교동 산 209',
    gasStatus: 'normal' as const,
    fireStatus: 'normal' as const,
    vibrationStatus: 'normal' as const,
  },
  {
    name: '대전냥월 수소충전소',
    address: '대전 동구 구도동 77-4',
    gasStatus: 'warning' as const,
    fireStatus: 'normal' as const,
    vibrationStatus: 'normal' as const,
  },
  {
    name: '충주바이오그린 수소충전소',
    address: '충북 충주시 봉방동 649-8',
    gasStatus: 'normal' as const,
    fireStatus: 'normal' as const,
    vibrationStatus: 'warning' as const,
  },
];

export default function MonitoringPage() {
  return (
    <Container>
      <TopBanner>
        <BannerBackground>
          <Image
            src="/images/monitoring-bg.jpg"
            alt="수소 생산 시설 전경"
            fill
            sizes="100vw"
            quality={100}
            style={{ objectFit: 'contain', objectPosition: 'top' }}
            priority
          />
          <DarkOverlay />
        </BannerBackground>
        <BannerContent>
          <Title>수소 생산시설 & 충전소 모니터링</Title>
          <Subtitle>실시간 모니터링을 통해 안전을 확보합니다.</Subtitle>
          <SearchBar>
            <input type="text" placeholder="수소충전소 검색" />
          </SearchBar>
        </BannerContent>
      </TopBanner>

      <ContentSection>
        <MapSection>
          <FacilityInfo>
            <FacilityInfoCard {...DUMMY_FACILITY} />
          </FacilityInfo>
          <MapView>
            {/* 지도 컴포넌트 - 추후 구현 */}
            <MapPlaceholder>지도가 표시될 영역입니다.</MapPlaceholder>
          </MapView>
        </MapSection>

        <ListSection>
          <ListTitle>수소생산시설</ListTitle>
          <ListHeader>
            <HeaderItem>상호</HeaderItem>
            <HeaderItem>주소</HeaderItem>
            <HeaderItem>가스감지기</HeaderItem>
            <HeaderItem>화재감지기</HeaderItem>
            <HeaderItem>진동감지기</HeaderItem>
          </ListHeader>
          <ListContent>
            {DUMMY_LIST.map((facility, index) => (
              <FacilityListItem key={index} {...facility} />
            ))}
          </ListContent>
        </ListSection>
      </ContentSection>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #f2f2f2;
`;

const TopBanner = styled.div`
  position: relative;
  width: 100%;
  height: 500px;
`;

const BannerBackground = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const DarkOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.3) 100%
  );
`;

const BannerContent = styled.div`
  position: relative;
  max-width: 1280px;
  margin: 0 auto;
  padding: 120px 20px;
  color: white;
  z-index: 1;
`;

const Title = styled.h1`
  font-family: 'Pretendard';
  font-weight: 600;
  font-size: 48px;
  text-align: center;
  margin-bottom: 20px;
`;

const Subtitle = styled.p`
  font-family: 'Pretendard';
  font-size: 24px;
  text-align: center;
  margin-bottom: 40px;
`;

const SearchBar = styled.div`
  max-width: 430px;
  margin: 0 auto;

  input {
    width: 100%;
    height: 50px;
    background: rgba(0, 0, 0, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 25px;
    padding: 0 20px;
    color: white;
    font-size: 16px;

    &::placeholder {
      color: white;
    }
  }
`;

const ContentSection = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const MapSection = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 40px;
`;

const FacilityInfo = styled.div`
  width: 378px;
  height: 680px;
`;

const MapView = styled.div`
  flex: 1;
  height: 680px;
  background: white;
  border-radius: 16px;
  overflow: hidden;
`;

const MapPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #767676;
  font-family: 'Pretendard';
  font-size: 16px;
`;

const ListSection = styled.div`
  background: white;
  border-radius: 16px;
  padding: 30px;
`;

const ListTitle = styled.h2`
  font-family: 'Pretendard';
  font-weight: 600;
  font-size: 34px;
  margin-bottom: 30px;
`;

const ListHeader = styled.div`
  display: flex;
  background: white;
  padding: 12px 0;
  border-bottom: 1px solid #c5c5c5;
`;

const HeaderItem = styled.div`
  flex: 1;
  text-align: center;
  color: #747474;
  font-family: 'Pretendard';
  font-weight: 600;
  font-size: 14px;
`;

const ListContent = styled.div`
  margin-top: 10px;
`;
