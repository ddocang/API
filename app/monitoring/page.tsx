'use client';

import Image from 'next/image';
import styled from '@emotion/styled';
import FacilityInfoCard from './components/FacilityInfoCard';
import FacilityListItem from './components/FacilityListItem';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Footer from '../../components/main/sections/Footer';
import { BiShieldAlt2, BiGasPump, BiLogIn, BiUserPlus } from 'react-icons/bi';
import useWebSocket from '@/hooks/useWebSocket';

// 더미 데이터
const DUMMY_FACILITY = {
  name: '삼척 교동 수소 스테이션',
  type: '대체연료충전소',
  address: '강원특별자치도 삼척시 교동 산 209',
  status: 'open' as const,
  phone: '033-575-5189 ext. 90',
  imageUrl: '/images/monitoring/facility1.jpg',
};

const DUMMY_LIST = [
  {
    id: 1,
    name: '삼척 교동 수소 스테이션',
    address: '강원특별자치도 삼척시 교동 산 209',
    gasStatus: 'inactive',
    fireStatus: 'inactive',
    vibrationStatus: 'inactive',
    type: '대체연료충전소',
    status: 'open',
    phone: '033-575-5189',
    imageUrl: '/images/monitoring/facility1.jpg',
  },
  {
    id: 2,
    name: '삼척 수소충전소',
    address: '강원특별자치도 삼척시 동해대로 3846',
    gasStatus: 'inactive',
    fireStatus: 'inactive',
    vibrationStatus: 'inactive',
    type: '수소충전소',
    status: 'open',
    phone: '033-570-3391',
    imageUrl: '/images/monitoring/facility2.jpg',
  },
  {
    id: 3,
    name: '원주 수소충전소',
    address: '강원특별자치도 원주시 원문로 1320',
    gasStatus: 'inactive',
    fireStatus: 'inactive',
    vibrationStatus: 'inactive',
    type: '수소충전소',
    status: 'open',
    phone: '033-734-4589',
    imageUrl: '/images/monitoring/facility3.jpg',
  },
  {
    id: 4,
    name: '속초 수소충전소',
    address: '강원특별자치도 속초시 동해대로 4521',
    gasStatus: 'inactive',
    fireStatus: 'inactive',
    vibrationStatus: 'inactive',
    type: '수소충전소',
    status: 'open',
    phone: '033-636-3014',
    imageUrl: '/images/monitoring/facility4.jpg',
  },
  {
    id: 5,
    name: '동해 휴게소 수소충전소',
    address: '강원특별자치도 동해시 동해대로 6170',
    gasStatus: 'inactive',
    fireStatus: 'inactive',
    vibrationStatus: 'inactive',
    type: '수소충전소',
    status: 'open',
    phone: '033-535-4891',
    imageUrl: '/images/monitoring/facility5.jpg',
  },
];

// 실시간 상태를 위한 타입
type FacilityStatus = {
  id: number;
  gasStatus: 'normal' | 'warning' | 'inactive';
  fireStatus: 'normal' | 'warning' | 'inactive';
  vibrationStatus: 'normal' | 'warning' | 'inactive';
};

export default function MonitoringPage() {
  const [selectedFacility, setSelectedFacility] = useState(DUMMY_LIST[0]);
  const [facilityStatusList, setFacilityStatusList] = useState<
    FacilityStatus[]
  >(() =>
    DUMMY_LIST.map((f) => ({
      id: f.id,
      gasStatus: (f.gasStatus === 'danger' ? 'warning' : f.gasStatus) as
        | 'normal'
        | 'warning'
        | 'inactive',
      fireStatus: (f.fireStatus === 'danger' ? 'warning' : f.fireStatus) as
        | 'normal'
        | 'warning'
        | 'inactive',
      vibrationStatus: (f.vibrationStatus === 'danger'
        ? 'warning'
        : f.vibrationStatus) as 'normal' | 'warning' | 'inactive',
    }))
  );
  const [currentTime, setCurrentTime] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAutoCompleteVisible, setIsAutoCompleteVisible] = useState(false);

  useEffect(() => {
    // 초기 시간 설정
    setCurrentTime(formatTime(new Date()));

    // 1초마다 시간 업데이트
    const timer = setInterval(() => {
      setCurrentTime(formatTime(new Date()));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsAutoCompleteVisible(true);
    if (e.target.value === '') {
      setSelectedFacility(DUMMY_LIST[0]);
      setIsAutoCompleteVisible(false);
    }
  };

  const handleAutoCompleteSelect = (facility: (typeof DUMMY_LIST)[0]) => {
    setSearchTerm(facility.name);
    setSelectedFacility(facility);
    setIsAutoCompleteVisible(false);
  };

  const handleSearchBarBlur = () => {
    // 약간의 지연을 주어 클릭 이벤트가 처리될 수 있도록 함
    setTimeout(() => {
      setIsAutoCompleteVisible(false);
    }, 200);
  };

  // 상세페이지와 동일한 WebSocket 데이터 수신 및 상태 갱신
  useWebSocket(
    'wss://iwxu7qs5h3.execute-api.ap-northeast-2.amazonaws.com/dev',
    (data: any) => {
      // 예시: topic_id로 시설 구분, barr/gdet/fdet로 상태 추출
      if (!data?.mqtt_data?.topic_id) {
        setFacilityStatusList((prev) =>
          prev.map((f) => ({
            ...f,
            gasStatus: 'inactive',
            fireStatus: 'inactive',
            vibrationStatus: 'inactive',
          }))
        );
        return;
      }
      // 예시: topic_id에서 id 추출 (BASE/P001 → 1)
      const id = (() => {
        const match = data.mqtt_data.topic_id.match(/BASE\/P(\d+)/);
        return match ? parseInt(match[1], 10) : null;
      })();
      if (!id) return;

      // 삼척 교동 수소 스테이션(P001)만 아래 로직 적용
      if (data.mqtt_data.topic_id === 'BASE/P001') {
        // 진동
        let vibrationStatus: 'normal' | 'warning' | 'inactive' = 'inactive';
        if (data.mqtt_data.data?.barr) {
          const barrArr = data.mqtt_data.data.barr
            .split(',')
            .slice(0, 9)
            .map((v: string) => parseInt(v));
          vibrationStatus = barrArr.every((v: number) => v < 500)
            ? 'normal'
            : 'warning';
        }
        // 가스
        let gasStatus: 'normal' | 'warning' | 'inactive' = 'inactive';
        if (data.mqtt_data.data?.gdet) {
          const gdetArr = Array.isArray(data.mqtt_data.data.gdet)
            ? data.mqtt_data.data.gdet
            : typeof data.mqtt_data.data.gdet === 'string'
            ? data.mqtt_data.data.gdet.split(',').map(Number)
            : [];
          gasStatus = gdetArr.every((v: number) => v === 0)
            ? 'normal'
            : 'warning';
        }
        // 화재
        let fireStatus: 'normal' | 'warning' | 'inactive' = 'inactive';
        if (data.mqtt_data.data?.fdet) {
          const fdetArr = Array.isArray(data.mqtt_data.data.fdet)
            ? data.mqtt_data.data.fdet
            : typeof data.mqtt_data.data.fdet === 'string'
            ? data.mqtt_data.data.fdet.split(',').map(Number)
            : [];
          fireStatus = fdetArr.every((v: number) => v === 0)
            ? 'normal'
            : 'warning';
        }
        setFacilityStatusList((prev) => {
          return prev.map((f) => {
            if (f.id === 1) {
              return {
                ...f,
                gasStatus: gasStatus,
                fireStatus: fireStatus,
                vibrationStatus: vibrationStatus,
              };
            }
            return f;
          });
        });
        return;
      }

      // 삼척 수소충전소(P003, id: 2) 처리
      if (data.mqtt_data.topic_id === 'BASE/P003') {
        // 진동 상태 계산 (앞 3개만)
        let vibrationStatus: 'normal' | 'warning' | 'inactive' = 'inactive';
        if (data.mqtt_data.data?.barr) {
          const barrArr = data.mqtt_data.data.barr
            .split(',')
            .slice(0, 3)
            .map((v: string) => parseInt(v));
          vibrationStatus = barrArr.every((v: number) => v < 500)
            ? 'normal'
            : 'warning';
        }

        // 가스 상태 계산
        let gasStatus: 'normal' | 'warning' | 'inactive' = 'inactive';
        if (data.mqtt_data.data?.gdet) {
          const gdetArr = Array.isArray(data.mqtt_data.data.gdet)
            ? data.mqtt_data.data.gdet
            : typeof data.mqtt_data.data.gdet === 'string'
            ? data.mqtt_data.data.gdet.split(',').map(Number)
            : [];
          gasStatus = gdetArr.every((v: number) => v === 0)
            ? 'normal'
            : 'warning';
        }

        // 화재 상태 계산
        let fireStatus: 'normal' | 'warning' | 'inactive' = 'inactive';
        if (data.mqtt_data.data?.fdet) {
          const fdetArr = Array.isArray(data.mqtt_data.data.fdet)
            ? data.mqtt_data.data.fdet
            : typeof data.mqtt_data.data.fdet === 'string'
            ? data.mqtt_data.data.fdet.split(',').map(Number)
            : [];
          fireStatus = fdetArr.every((v: number) => v === 0)
            ? 'normal'
            : 'warning';
        }

        setFacilityStatusList((prev) =>
          prev.map((f) =>
            f.id === 2 ? { ...f, gasStatus, fireStatus, vibrationStatus } : f
          )
        );
        return;
      }

      // P001이 아닌 경우만 기존 로직 실행
      if (
        data.mqtt_data.topic_id !== 'BASE/P001' &&
        data.mqtt_data.topic_id !== 'BASE/P003'
      ) {
        // 진동 상태 계산
        let vibrationStatus: 'normal' | 'warning' | 'inactive' = 'inactive';
        if (data.mqtt_data.data?.barr) {
          const barrArr = data.mqtt_data.data.barr
            .split(',')
            .slice(0, 9)
            .map((v: string) => parseInt(v));
          vibrationStatus = barrArr.every((v: number) => v < 500)
            ? 'normal'
            : 'warning';
        }

        // 가스 상태 계산
        let gasStatus: 'normal' | 'warning' | 'inactive' = 'inactive';
        if (data.mqtt_data.data?.gdet) {
          const gdetArr = Array.isArray(data.mqtt_data.data.gdet)
            ? data.mqtt_data.data.gdet
            : typeof data.mqtt_data.data.gdet === 'string'
            ? data.mqtt_data.data.gdet.split(',').map(Number)
            : [];
          gasStatus = gdetArr.every((v: number) => v === 0)
            ? 'normal'
            : 'warning';
        }

        // 화재 상태 계산
        let fireStatus: 'normal' | 'warning' | 'inactive' = 'inactive';
        if (data.mqtt_data.data?.fdet) {
          const fdetArr = Array.isArray(data.mqtt_data.data.fdet)
            ? data.mqtt_data.data.fdet
            : typeof data.mqtt_data.data.fdet === 'string'
            ? data.mqtt_data.data.fdet.split(',').map(Number)
            : [];
          fireStatus = fdetArr.every((v: number) => v === 0)
            ? 'normal'
            : 'warning';
        }

        setFacilityStatusList((prev) =>
          prev.map((f) =>
            f.id === id ? { ...f, gasStatus, fireStatus, vibrationStatus } : f
          )
        );
      }
    }
  );

  // 실시간 상태를 facilityStatusList에서 병합
  const mergedList = DUMMY_LIST.map((facility) => {
    // 상세페이지 없는 충전소(id 3,4,5)는 항상 비활성
    if ([3, 4, 5].includes(facility.id)) {
      return {
        ...facility,
        gasStatus: 'inactive',
        fireStatus: 'inactive',
        vibrationStatus: 'inactive',
      };
    }
    // id:2(삼척 수소충전소)는 실시간 데이터가 있으면 그 값 사용
    const status = facilityStatusList.find((f) => f.id === facility.id);
    return status
      ? {
          ...facility,
          gasStatus: status.gasStatus as typeof facility.gasStatus,
          fireStatus: status.fireStatus as typeof facility.fireStatus,
          vibrationStatus:
            status.vibrationStatus as typeof facility.vibrationStatus,
          status: facility.status as typeof facility.status,
        }
      : facility;
  });

  const filteredList = mergedList.filter((facility) => {
    const searchValue = searchTerm.toLowerCase().replace(/\s+/g, '');
    const facilityName = facility.name.toLowerCase().replace(/\s+/g, '');
    const facilityAddress = facility.address.toLowerCase().replace(/\s+/g, '');

    return (
      facilityName.includes(searchValue) ||
      facilityAddress.includes(searchValue)
    );
  });

  useEffect(() => {
    if (filteredList.length > 0 && !filteredList.includes(selectedFacility)) {
      setSelectedFacility(filteredList[0]);
    }
  }, [searchTerm]);

  const handleFacilitySelect = (facility: (typeof DUMMY_LIST)[0]) => {
    setSelectedFacility(facility);
  };

  return (
    <Container>
      <TopBanner>
        <BannerBackground>
          <Image
            src="/images/monitoring/monitoring-bg.jpg"
            alt="수소 생산 시설 전경"
            fill
            sizes="100vw"
            quality={100}
            style={{
              objectFit: 'cover',
              objectPosition: 'center',
              zIndex: 1,
            }}
            priority
          />
          <DarkOverlay />
        </BannerBackground>
        <GNB>
          <Logo>
            <LogoImageWrapper>
              <Image
                src="/images/logo.png"
                alt="Logo"
                fill
                sizes="36px"
                style={{ objectFit: 'contain' }}
                priority
              />
            </LogoImageWrapper>
            <span>HyGE</span>
          </Logo>
          <MenuContainer>
            <MainMenu>
              <Link href="/">홈</Link>
              <Link href="/monitoring">
                <BiShieldAlt2 />
                모니터링
              </Link>
              <Link href="/charging">
                <BiGasPump />
                충전소
              </Link>
            </MainMenu>
            <UserMenu>
              <button>
                <BiLogIn />
                로그인
              </button>
              <button>
                <BiUserPlus />
                회원가입
              </button>
            </UserMenu>
          </MenuContainer>
        </GNB>
        <BannerContent>
          <Title>수소 생산시설 & 충전소 모니터링</Title>
          <Subtitle>실시간 모니터링을 통해 안전을 확보합니다.</Subtitle>
        </BannerContent>
      </TopBanner>

      <ContentSection>
        <MapSection>
          <MapContent>
            <FacilityInfo>
              <FacilityInfoCard
                {...(selectedFacility as {
                  id: number;
                  name: string;
                  address: string;
                  gasStatus: 'normal' | 'warning' | 'inactive';
                  fireStatus: 'normal' | 'warning' | 'inactive';
                  vibrationStatus: 'normal' | 'warning' | 'inactive';
                  type: string;
                  status: 'open' | 'closed' | 'preparing';
                  phone: string;
                  imageUrl: string;
                })}
              />
            </FacilityInfo>
            <MapView>
              <SearchBarWrapper>
                <SearchBar>
                  <input
                    type="text"
                    placeholder="수소충전소 검색"
                    value={searchTerm}
                    onChange={handleSearch}
                    onBlur={handleSearchBarBlur}
                  />
                  {searchTerm && (
                    <ClearButton
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedFacility(DUMMY_LIST[0]);
                        setIsAutoCompleteVisible(false);
                      }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M15 5L5 15M5 5L15 15"
                          stroke="#D7D7D7"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </ClearButton>
                  )}
                  {isAutoCompleteVisible && filteredList.length > 0 && (
                    <AutoCompleteList>
                      {filteredList.map((facility) => (
                        <AutoCompleteItem
                          key={facility.id}
                          onClick={() => handleAutoCompleteSelect(facility)}
                        >
                          <ItemName>{facility.name}</ItemName>
                          <ItemAddress>{facility.address}</ItemAddress>
                        </AutoCompleteItem>
                      ))}
                    </AutoCompleteList>
                  )}
                </SearchBar>
              </SearchBarWrapper>
              <Image
                src={
                  selectedFacility.name === '삼척 수소충전소'
                    ? '/images/monitoring/sc.png'
                    : selectedFacility.name === '원주 수소충전소'
                    ? '/images/monitoring/wj.png'
                    : selectedFacility.name === '속초 수소충전소'
                    ? '/images/monitoring/scc.png'
                    : selectedFacility.name === '동해 휴게소 수소충전소'
                    ? '/images/monitoring/dh.png'
                    : '/images/monitoring/kd.png'
                }
                alt={`${selectedFacility.name} 지도`}
                width={1200}
                height={800}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                }}
                priority
              />
            </MapView>
          </MapContent>
        </MapSection>

        <ListSection>
          <UpdateTime>업데이트: {currentTime}</UpdateTime>
          <ListHeader>
            <HeaderItem>상호</HeaderItem>
            <HeaderItem hideOnMobile>주소</HeaderItem>
            <HeaderItem>가스감지기</HeaderItem>
            <HeaderItem>화재감지기</HeaderItem>
            <HeaderItem>진동감지기</HeaderItem>
            <HeaderItem>상세보기</HeaderItem>
          </ListHeader>
          <ListContent>
            {filteredList.map((facility) => (
              <FacilityListItem
                key={facility.id}
                {...(facility as {
                  id: number;
                  name: string;
                  address: string;
                  gasStatus: 'normal' | 'warning' | 'inactive';
                  fireStatus: 'normal' | 'warning' | 'inactive';
                  vibrationStatus: 'normal' | 'warning' | 'inactive';
                  type: string;
                  status: 'open' | 'closed' | 'preparing';
                  phone: string;
                  imageUrl: string;
                })}
                isSelected={selectedFacility.id === facility.id}
                onClick={() => handleFacilitySelect(facility)}
                {...([3, 4, 5].includes(facility.id)
                  ? {}
                  : {
                      onDetailClick: () =>
                        (window.location.href =
                          facility.id === 2
                            ? '/monitoring/detail/2/page2'
                            : `/monitoring/detail/${facility.id}`),
                    })}
              />
            ))}
          </ListContent>
        </ListSection>
      </ContentSection>

      <Footer />
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #f2f2f2;
`;

const TopBanner = styled.div`
  width: 100%;
  position: relative;
  overflow: hidden;
  aspect-ratio: 1920/357;

  @media (max-width: 768px) {
    display: none;
  }
`;

const BannerBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
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
  z-index: 2;
`;

const BannerContent = styled.div`
  position: relative;
  max-width: 1280px;
  margin: 0 auto;
  padding: 40px 20px;
  color: white;
  z-index: 5;
  text-align: center;
  margin-top: -15px;

  @media (max-width: 768px) {
    margin-top: 80px;
    padding: 20px;
  }
`;

const Title = styled.h1`
  font-family: 'Pretendard';
  font-weight: 600;
  font-size: 32px;
  text-align: center;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 24px;
    margin-bottom: 8px;
  }
`;

const Subtitle = styled.p`
  font-family: 'Pretendard';
  font-size: 18px;
  text-align: center;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const SearchBarWrapper = styled.div`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0 20px;
`;

const SearchBar = styled.div`
  width: 800px;
  position: relative;

  @media (max-width: 1024px) {
    width: 100%;
    max-width: 600px;
  }

  input {
    width: 100%;
    height: 50px;
    background: rgba(0, 0, 0, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 25px;
    padding: 0 50px 0 20px;
    color: #d7d7d7;
    font-size: 16px;
    text-align: center;

    @media (max-width: 768px) {
      height: 40px;
      font-size: 14px;
    }

    &::placeholder {
      color: #d7d7d7;
      text-align: center;
    }

    &:focus {
      outline: none;
      border-color: #0066ff;
    }
  }
`;

const ContentSection = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 40px 20px;

  @media (max-width: 768px) {
    padding: 0 15px;
  }
`;

const MapSection = styled.div`
  margin-bottom: 40px;
  position: relative;

  @media (max-width: 768px) {
    margin-bottom: 30px;
  }
`;

const FacilityInfo = styled.div`
  width: 378px;
  height: 630px;

  @media (max-width: 1024px) {
    width: 100%;
    height: auto;
    min-height: 300px;
  }
`;

const MapView = styled.div`
  flex: 1;
  min-height: 630px;
  position: relative;
  background: white;
  border-radius: 16px;
  overflow: hidden;

  @media (max-width: 1024px) {
    min-height: 500px;
  }

  @media (max-width: 768px) {
    min-height: 300px;
  }
`;

const ListSection = styled.div`
  background: white;
  border-radius: 16px;
  padding: 17px 30px 30px 30px;
  margin-top: 40px;

  @media (max-width: 768px) {
    padding: 15px;
    margin-top: 30px;
    overflow-x: auto;
  }
`;

const ListHeader = styled.div`
  display: flex;
  background: #f7f7f7;
  padding: 12px 0;
  border-bottom: 1px solid #c5c5c5;
  border-radius: 8px;
  min-width: 800px;

  @media (max-width: 768px) {
    padding: 10px 0;
    min-width: auto;
  }
`;

const HeaderItem = styled.div<{ hideOnMobile?: boolean }>`
  flex: 1;
  text-align: center;
  color: #747474;
  font-family: 'Pretendard';
  font-weight: 600;
  font-size: 14px;

  @media (max-width: 768px) {
    font-size: 12px;
    display: ${(props) => (props.hideOnMobile ? 'none' : 'block')};
  }
`;

const ListContent = styled.div`
  margin-top: 10px;
  min-width: 800px;

  @media (max-width: 768px) {
    min-width: auto;
  }
`;

const GNB = styled.nav`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  height: auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: clamp(20px, 2.08vw, 40px) 20px;
  user-select: none;
  position: relative;
  z-index: 10;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  user-select: none;
  height: 36px;

  span {
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 24px;
    color: #ffffff;
    line-height: 36px;
  }

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const LogoImageWrapper = styled.div`
  position: relative;
  width: 36px;
  height: 36px;
`;

const MenuContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
`;

const MainMenu = styled.div`
  display: flex;
  gap: 10px;
  user-select: none;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    justify-content: center;
  }

  a {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: 'Pretendard';
    font-size: clamp(14px, 0.83vw, 16px);
    color: #ffffff;
    text-decoration: none;
    transition: all 0.2s ease;
    padding: 8px 16px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 24px;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(1px);

    svg {
      width: 18px;
      height: 18px;
    }

    &:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: scale(1.05);
    }
  }
`;

const UserMenu = styled.div`
  display: flex;
  gap: 10px;
  user-select: none;

  @media (max-width: 768px) {
    margin-top: 1rem;
  }

  button,
  a {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: 'Pretendard';
    font-size: clamp(14px, 0.83vw, 16px);
    color: #ffffff;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(1px);
    border: 1px solid rgba(255, 255, 255, 0.5);
    cursor: pointer;
    text-decoration: none;
    transition: all 0.2s ease;
    padding: 8px 16px;
    border-radius: 24px;

    svg {
      width: 18px;
      height: 18px;
    }

    &:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: scale(1.05);
    }
  }
`;

const UpdateTime = styled.div`
  font-family: 'Pretendard';
  font-size: 13px;
  color: #666666;
  text-align: right;
  padding: 0 0 12px 0;
`;

const MapContent = styled.div`
  display: flex;
  gap: 20px;
  position: relative;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

const AutoCompleteList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 8px;
  padding: 8px 0;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 16px;
  list-style: none;
  max-height: 300px;
  overflow-y: auto;
  z-index: 100;

  @media (max-width: 768px) {
    max-height: 250px;
    margin-top: 6px;
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
  }
`;

const AutoCompleteItem = styled.li`
  padding: 12px 20px;
  cursor: pointer;
  transition: background-color 0.2s;

  @media (max-width: 768px) {
    padding: 10px 15px;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ItemName = styled.div`
  color: #ffffff;
  font-size: 16px;
  margin-bottom: 4px;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const ItemAddress = styled.div`
  color: #d7d7d7;
  font-size: 14px;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.7;
  }

  &:focus {
    outline: none;
  }
`;
