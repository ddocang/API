'use client';

import Image from 'next/image';
import styled from '@emotion/styled';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface SensorBase {
  id: number;
  name: string;
  unit: string;
  status: string;
}

interface GasSensor extends SensorBase {
  value?: string;
}

interface FireSensor extends SensorBase {
  value?: string;
}

interface DetailedVibrationDataPoint {
  time: string;
  value: number;
}

interface VibrationSensor extends SensorBase {
  value: string;
  data: VibrationDataPoint[];
  detailedData: DetailedVibrationDataPoint[];
}

interface FacilityDetail {
  name: string;
  type: string;
  address: string;
  status: 'open';
  phone: string;
  imageUrl: string;
  operationHours: string;
  capacity: string;
  pressure: string;
  sensors: {
    gas: GasSensor[];
    fire: FireSensor[];
    vibration: VibrationSensor[];
  };
}

const FACILITY_DETAIL: FacilityDetail = {
  name: '삼척 교동 수소 스테이션',
  type: '대체연료충전소',
  address: '강원특별자치도 삼척시 교동 산 209',
  status: 'open' as const,
  phone: '033-575-5189 ext. 90',
  imageUrl: '/images/monitoring/facility1.jpg',
  operationHours: '09:00 ~ 18:00',
  capacity: '250kg/일',
  pressure: '700bar',
  sensors: {
    gas: [
      {
        id: 1,
        name: '수소감지기1',
        unit: '--',
        status: 'normal',
      },
      {
        id: 2,
        name: '수소감지기2',
        unit: '--',
        status: 'normal',
      },
      {
        id: 3,
        name: '수소감지기3',
        unit: '--',
        status: 'normal',
      },
      {
        id: 4,
        name: '수소감지기4',
        unit: '--',
        status: 'normal',
      },
      {
        id: 5,
        name: '수소감지기5',
        unit: '--',
        status: 'normal',
      },
      {
        id: 6,
        name: '수소감지기6',
        unit: '--',
        status: 'normal',
      },
      {
        id: 7,
        name: '수소감지기7',
        unit: '--',
        status: 'normal',
      },
      {
        id: 8,
        name: '수소감지기8',
        unit: '--',
        status: 'normal',
      },
      {
        id: 9,
        name: '수소감지기9',
        unit: '--',
        status: 'normal',
      },
      {
        id: 10,
        name: '수소감지기10',
        unit: '--',
        status: 'normal',
      },
      {
        id: 11,
        name: '수소감지기11',
        unit: '--',
        status: 'normal',
      },
      {
        id: 12,
        name: '수소감지기12',
        unit: '--',
        status: 'normal',
      },
      {
        id: 13,
        name: '수소감지기13',
        unit: '--',
        status: 'normal',
      },
      {
        id: 14,
        name: '수소감지기14',
        unit: '--',
        status: 'normal',
      },
      {
        id: 15,
        name: '수소감지기15',
        unit: '--',
        status: 'normal',
      },
    ],
    fire: [
      { id: 1, name: '화재감지1', unit: '--', status: 'normal' },
      { id: 2, name: '화재감지2', unit: '--', status: 'normal' },
      { id: 3, name: '화재감지3', unit: '--', status: 'normal' },
      { id: 4, name: '화재감지4', unit: '--', status: 'normal' },
      { id: 5, name: '화재감지5', unit: '--', status: 'normal' },
      { id: 6, name: '화재감지6', unit: '--', status: 'normal' },
    ],
    vibration: [
      {
        id: 1,
        name: '진동감지기1',
        value: '0.85',
        unit: 'g',
        status: 'normal',
        data: [],
        detailedData: [],
      },
      {
        id: 2,
        name: '진동감지기2',
        value: '0.92',
        unit: 'g',
        status: 'normal',
        data: [],
        detailedData: [],
      },
      {
        id: 3,
        name: '진동감지기3',
        value: '0.78',
        unit: 'g',
        status: 'normal',
        data: [],
        detailedData: [],
      },
      {
        id: 4,
        name: '진동감지기4',
        value: '0.88',
        unit: 'g',
        status: 'normal',
        data: [],
        detailedData: [],
      },
      {
        id: 5,
        name: '진동감지기5',
        value: '0.95',
        unit: 'g',
        status: 'normal',
        data: [],
        detailedData: [],
      },
      {
        id: 6,
        name: '진동감지기6',
        value: '0.82',
        unit: 'g',
        status: 'normal',
        data: [],
        detailedData: [],
      },
      {
        id: 7,
        name: '진동감지기7',
        value: '0.87',
        unit: 'g',
        status: 'normal',
        data: [],
        detailedData: [],
      },
      {
        id: 8,
        name: '진동감지기8',
        value: '0.91',
        unit: 'g',
        status: 'normal',
        data: [],
        detailedData: [],
      },
      {
        id: 9,
        name: '진동감지기9',
        value: '0.84',
        unit: 'g',
        status: 'normal',
        data: [],
        detailedData: [],
      },
    ],
  },
};

const CustomTooltip = styled.div`
  background: rgba(0, 0, 0, 0.85);
  border-radius: 4px;
  padding: 8px 12px;

  .time {
    font-family: 'Pretendard';
    font-size: 12px;
    color: #999999;
    margin-bottom: 4px;
  }

  .value {
    font-family: 'Pretendard';
    font-size: 14px;
    color: white;
    font-weight: 600;
  }
`;

interface VibrationDataPoint {
  time: string;
  value: number;
}

const DetailedGraphPopup = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 1500px;
  height: 650px;
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  z-index: 1000;
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
  padding: 32px;
  border: 1px solid rgba(96, 165, 250, 0.15);
`;

const PopupOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  z-index: 999;
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
`;

const PopupHeader = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr 120px;
  align-items: center;
  margin-bottom: 28px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e2e8f0;

  h2 {
    font-family: 'Pretendard';
    font-weight: 700;
    font-size: 28px;
    color: #1e293b;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    grid-column: 2;

    &:before {
      content: '';
      display: block;
      width: 8px;
      height: 8px;
      background: #2563eb;
      border-radius: 50%;
      box-shadow: 0 0 12px rgba(37, 99, 235, 0.5);
    }
  }
`;

const PopupLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  grid-column: 1;

  .logo-wrapper {
    position: relative;
    width: 36px;
    height: 36px;
  }

  span {
    font-family: 'Pretendard';
    font-weight: 700;
    font-size: 28px;
    color: #1e293b;
    letter-spacing: -0.02em;
  }
`;

const CloseButton = styled.button`
  background: #f1f5f9;
  border: none;
  cursor: pointer;
  padding: 8px;
  color: #64748b;
  font-size: 24px;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  grid-column: 3;
  justify-self: end;

  &:hover {
    background: #e2e8f0;
    color: #1e293b;
  }
`;

const DetailedGraphContainer = styled.div`
  width: 100%;
  height: calc(100% - 80px);
  background: #f8fafc;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #e2e8f0;
`;

const MainMenu = styled.div`
  display: flex;
  gap: 12px;
  user-select: none;
  align-items: center;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const NavLinkStyle = styled.a<{ active?: boolean }>`
  && {
    font-family: 'Pretendard';
    font-size: 14px;
    font-weight: ${({ active }) => (active ? 600 : 500)};
    color: ${({ active }) => (active ? '#2563eb' : '#64748b')};
    text-decoration: none;
    position: relative;
    padding: 6px 12px;
    border-radius: 6px;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    background: ${({ active }) => (active ? '#eff6ff' : '#ffffff')};
    border: 1px solid ${({ active }) => (active ? '#93c5fd' : '#e2e8f0')};

    &:hover {
      color: #2563eb;
      border-color: #93c5fd;
      background: #eff6ff;

      svg {
        color: #2563eb;
      }
    }

    svg {
      width: 16px;
      height: 16px;
      transition: all 0.2s ease;
      color: ${({ active }) => (active ? '#2563eb' : '#64748b')};
    }
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(96, 165, 250, 0.2);
  padding: 6px 12px;
  border-radius: 8px;
  font-family: 'Pretendard';
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 8px;

  &:hover {
    background: #eff6ff;
    border-color: #93c5fd;
    color: #2563eb;

    svg {
      color: #2563eb;
    }
  }

  svg {
    width: 16px;
    height: 16px;
    color: #64748b;
    transition: all 0.2s ease;
  }
`;

export default function MonitoringDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [imageHeight, setImageHeight] = useState(0);
  const [lastUpdateTime, setLastUpdateTime] = useState('');
  const [selectedSensor, setSelectedSensor] = useState<VibrationSensor | null>(
    null
  );
  const [isDetailedGraphOpen, setIsDetailedGraphOpen] = useState(false);
  const [vibrationSensors, setVibrationSensors] = useState<VibrationSensor[]>(
    () =>
      FACILITY_DETAIL.sensors.vibration.map((sensor) => ({
        ...sensor,
        value: sensor.value || '0.00',
        data: [],
        detailedData: [],
      }))
  );

  const generateDetailedData = useCallback((baseValue: number) => {
    const data: DetailedVibrationDataPoint[] = [];
    const now = new Date();
    const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000);

    for (
      let time = sixHoursAgo;
      time <= now;
      time = new Date(time.getTime() + 10000)
    ) {
      const hours = String(time.getHours()).padStart(2, '0');
      const minutes = String(time.getMinutes()).padStart(2, '0');
      const seconds = String(time.getSeconds()).padStart(2, '0');
      const timeString = `${hours}:${minutes}:${seconds}`;

      const variation = Math.random() * 0.4 - 0.2;
      const value = Number((baseValue + variation).toFixed(2));
      data.push({
        time: timeString,
        value: Math.max(0, Math.min(2, value)),
      });
    }
    return data;
  }, []);

  const formatTime = useCallback((date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }, []);

  const updateData = useCallback(() => {
    const now = new Date();
    const updatedSensors = FACILITY_DETAIL.sensors.vibration.map((sensor) => {
      const data = [];
      const baseValue = 0.8 + Math.random() * 0.2;

      for (let i = 11; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000);
        const hours = String(time.getHours()).padStart(2, '0');

        let variation = 0;
        if (hours >= '06' && hours <= '09') {
          variation = 0.3;
        } else if (hours >= '11' && hours <= '14') {
          variation = 0.4;
        } else if (hours >= '17' && hours <= '20') {
          variation = 0.35;
        } else if (hours >= '22' || hours <= '05') {
          variation = -0.2;
        }

        const value = Number(
          (baseValue + variation + (Math.random() * 0.2 - 0.1)).toFixed(2)
        );
        data.push({
          time: `${hours}:00`,
          value: Math.max(0.1, Math.min(1.9, value)),
        });
      }

      const currentValue = data[data.length - 1].value.toFixed(2);

      return {
        ...sensor,
        value: currentValue,
        data,
        detailedData: generateDetailedData(Number(currentValue)),
      };
    });

    setVibrationSensors(updatedSensors);
    setLastUpdateTime(formatTime(now));
  }, [generateDetailedData, formatTime]);

  useEffect(() => {
    // 초기 데이터 로드
    updateData();

    // 1분마다 데이터 업데이트
    const interval = setInterval(updateData, 60000);
    return () => clearInterval(interval);
  }, [updateData]);

  useEffect(() => {
    // 이미지의 실제 비율 계산 (1920:357)
    const aspectRatio = 357 / 1920;
    const height = Math.floor(window.innerWidth * aspectRatio);
    setImageHeight(height);

    const handleResize = () => {
      const newHeight = Math.floor(window.innerWidth * aspectRatio);
      setImageHeight(newHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleGraphClick = (sensor: VibrationSensor) => {
    setSelectedSensor(sensor);
    setIsDetailedGraphOpen(true);
  };

  const closeDetailedGraph = () => {
    setIsDetailedGraphOpen(false);
    setSelectedSensor(null);
  };

  return (
    <Container>
      <TopBanner>
        <BannerBackground>
          <DarkOverlay />
        </BannerBackground>
        <GNB>
          <Logo>
            <LogoImageWrapper>
              <Image
                src="/images/logo.png"
                alt="Logo"
                fill
                sizes="32px"
                style={{ objectFit: 'contain' }}
                priority
              />
            </LogoImageWrapper>
            <span>HyGE&nbsp;안전모니터링_삼척&nbsp;교동&nbsp;수소스테이션</span>
          </Logo>
          <MainMenu>
            <Link href="/" passHref legacyBehavior>
              <NavLinkStyle active={pathname === '/'}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                  <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
                </svg>
                홈
              </NavLinkStyle>
            </Link>
            <Link href="/tube-trailer" passHref legacyBehavior>
              <NavLinkStyle active={pathname.includes('tube-trailer')}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 116 0h3a.75.75 0 00.75-.75V15z" />
                  <path d="M8.25 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zM15.75 6.75a.75.75 0 00-.75.75v11.25c0 .087.015.17.042.248a3 3 0 015.958.464c.853-.175 1.522-.935 1.464-1.883a18.659 18.659 0 00-3.732-10.104 1.837 1.837 0 00-1.47-.725H15.75z" />
                  <path d="M19.5 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
                </svg>
                튜브트레일러
              </NavLinkStyle>
            </Link>
            <NavLinkStyle
              as="button"
              onClick={() => router.push('/monitoring')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
                  clipRule="evenodd"
                />
              </svg>
              전단계
            </NavLinkStyle>
            <UpdateTime>업데이트: {lastUpdateTime}</UpdateTime>
          </MainMenu>
        </GNB>
        <BannerContent>
          <TitleContainer>
            <Title>{FACILITY_DETAIL.name}</Title>
          </TitleContainer>
        </BannerContent>
      </TopBanner>

      <ContentSection>
        <MapSection>
          <LeftColumn>
            <MapView>
              <Image
                src="/images/monitoring/detail/kd-map.png"
                alt="시설 위치"
                width={849}
                height={624}
                quality={90}
                style={{
                  objectFit: 'contain',
                  width: '100%',
                  height: '100%',
                  maxWidth: '849px',
                  maxHeight: '624px',
                }}
                priority
              />
            </MapView>
            <SensorCard>
              <SensorHeader></SensorHeader>
              <ListHeader>
                <span>No</span>
                <span>종류</span>
                <span>연결</span>
                <span>상태</span>
                <span>Data</span>
              </ListHeader>
              <SensorList>
                {FACILITY_DETAIL.sensors.gas.map((sensor) => (
                  <SensorItem key={sensor.id}>
                    <SensorNo>{sensor.id}</SensorNo>
                    <SensorType>{sensor.name}</SensorType>
                    <SensorConnection>연결됨</SensorConnection>
                    <SensorStatus status={sensor.status}>
                      {sensor.status === 'normal' ? '정상' : sensor.status}
                    </SensorStatus>
                    <SensorValue status={sensor.status}>
                      {sensor.value}
                      <span>{sensor.unit}</span>
                    </SensorValue>
                  </SensorItem>
                ))}
                {FACILITY_DETAIL.sensors.fire.map((sensor) => (
                  <SensorItem key={sensor.id}>
                    <SensorNo>{sensor.id}</SensorNo>
                    <SensorType>{sensor.name}</SensorType>
                    <SensorConnection>연결됨</SensorConnection>
                    <SensorStatus status={sensor.status}>
                      {sensor.status === 'normal' ? '정상' : sensor.status}
                    </SensorStatus>
                    <SensorValue status={sensor.status}>
                      {sensor.value}
                      <span>{sensor.unit}</span>
                    </SensorValue>
                  </SensorItem>
                ))}
                {vibrationSensors.map((sensor) => (
                  <SensorItem key={sensor.id}>
                    <SensorNo>{sensor.id}</SensorNo>
                    <SensorType>{sensor.name}</SensorType>
                    <SensorConnection>연결됨</SensorConnection>
                    <SensorStatus status={sensor.status}>
                      {sensor.status === 'normal' ? '정상' : sensor.status}
                    </SensorStatus>
                    <SensorValue status={sensor.status}>
                      {sensor.value || '--'}
                      <span>{sensor.unit}</span>
                    </SensorValue>
                  </SensorItem>
                ))}
              </SensorList>
            </SensorCard>
          </LeftColumn>
          <VibrationGraphContainer>
            {vibrationSensors.map((sensor) => (
              <VibrationGraphCard
                key={sensor.id}
                onClick={() => handleGraphClick(sensor)}
                style={{ cursor: 'pointer' }}
              >
                <h4>
                  {sensor.name}
                  <span className="status">정상</span>
                </h4>
                <div className="graph-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={sensor.data}
                      margin={{
                        top: 5,
                        right: 10,
                        left: -20,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#E9ECEF"
                      />
                      <XAxis
                        dataKey="time"
                        tick={{ fontSize: 10, fill: '#666666' }}
                        tickLine={false}
                        axisLine={{ stroke: '#E9ECEF' }}
                        ticks={[
                          sensor.data[0]?.time,
                          sensor.data[5]?.time,
                          sensor.data[11]?.time,
                        ]}
                      />
                      <YAxis
                        tick={{ fontSize: 10, fill: '#666666' }}
                        tickLine={false}
                        axisLine={{ stroke: '#E9ECEF' }}
                        domain={[0, 2]}
                        ticks={[0, 0.5, 1.0, 1.5, 2.0]}
                        tickFormatter={(value) => value.toFixed(1)}
                      />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <CustomTooltip>
                                <div className="time">{label}</div>
                                <div className="value">
                                  {Number(payload[0].value).toFixed(2)}g
                                </div>
                              </CustomTooltip>
                            );
                          }
                          return null;
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#0066FF"
                        strokeWidth={2}
                        dot={{ fill: '#0066FF', r: 2 }}
                        activeDot={{
                          r: 4,
                          fill: '#0066FF',
                          stroke: 'white',
                          strokeWidth: 2,
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </VibrationGraphCard>
            ))}
          </VibrationGraphContainer>
        </MapSection>
      </ContentSection>

      <PopupOverlay isOpen={isDetailedGraphOpen} onClick={closeDetailedGraph} />
      <DetailedGraphPopup isOpen={isDetailedGraphOpen}>
        {selectedSensor && (
          <>
            <PopupHeader>
              <PopupLogo>
                <div className="logo-wrapper">
                  <Image
                    src="/images/logo.png"
                    alt="Logo"
                    fill
                    sizes="36px"
                    style={{ objectFit: 'contain' }}
                    priority
                  />
                </div>
                <span>HyGE</span>
              </PopupLogo>
              <h2>{selectedSensor.name} 상세 그래프</h2>
              <CloseButton onClick={closeDetailedGraph}>&times;</CloseButton>
            </PopupHeader>
            <DetailedGraphContainer>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={selectedSensor.detailedData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                  />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 13, fill: '#64748b' }}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    interval={179}
                  />
                  <YAxis
                    domain={[0, 2]}
                    ticks={[0, 0.5, 1.0, 1.5, 2.0]}
                    tick={{ fontSize: 13, fill: '#64748b' }}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickFormatter={(value) => value.toFixed(1)}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <CustomTooltip>
                            <div className="time">{label}</div>
                            <div className="value">
                              {Number(payload[0].value).toFixed(2)}g
                            </div>
                          </CustomTooltip>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{
                      r: 6,
                      fill: '#2563eb',
                      stroke: 'white',
                      strokeWidth: 2,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </DetailedGraphContainer>
          </>
        )}
      </DetailedGraphPopup>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #f2f2f2;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const TopBanner = styled.div`
  position: relative;
  width: 100%;
  height: 85px;
  overflow: hidden;
  flex-shrink: 0;
  background: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const BannerBackground = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(96, 165, 250, 0.08) 0%,
    rgba(59, 130, 246, 0.12) 100%
  );
`;

const DarkOverlay = styled.div`
  display: none;
`;

const BannerContent = styled.div`
  position: relative;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 20px;
  z-index: 1;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-left: 170px;
  height: 100%;
`;

const TitleContainer = styled.div`
  padding: 8px 20px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(96, 165, 250, 0.2);
  text-align: left;
  margin-top: 8px;
`;

const Title = styled.h1`
  font-family: 'Pretendard';
  font-weight: 700;
  font-size: 24px;
  text-align: center;
  color: #1e293b;
  margin: 0;
  line-height: 1.4;
  letter-spacing: -0.02em;
`;

const Subtitle = styled.p`
  font-family: 'Pretendard';
  font-size: 15px;
  text-align: center;
  color: #60a5fa;
  margin: 4px 0 0 0;
  font-weight: 500;
  letter-spacing: -0.01em;
`;

const UpdateTime = styled.div`
  font-family: 'Pretendard';
  font-size: 13px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.9);
  padding: 6px 10px;
  border-radius: 20px;
  backdrop-filter: blur(8px);
  margin-left: 12px;
  border: 1px solid rgba(96, 165, 250, 0.2);

  &:before {
    content: '';
    display: block;
    width: 6px;
    height: 6px;
    background: #2563eb;
    border-radius: 50%;
    box-shadow: 0 0 12px rgba(37, 99, 235, 0.5);
  }
`;

const ContentSection = styled.div`
  max-width: 1920px;
  margin: 0 auto;
  padding: 16px 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const MapSection = styled.div`
  width: 100%;
  display: flex;
  gap: 20px;
  flex: 1;
  overflow: hidden;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

const LeftColumn = styled.div`
  flex: 0.45;
  min-width: 760px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (max-width: 1600px) {
    min-width: 680px;
  }

  @media (max-width: 1440px) {
    min-width: 620px;
  }

  @media (max-width: 1280px) {
    min-width: 580px;
  }
`;

const MapView = styled.div`
  width: 100%;
  height: 640px;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 30px;

  img {
    max-width: 100%;
    height: auto;
  }
`;

const VibrationGraphContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 250px);
  grid-template-rows: repeat(3, 1fr);
  gap: 12px;
  flex: 0.55;
  min-height: 0;
  min-width: 0;
  justify-content: center;
  overflow: hidden;
`;

const VibrationGraphCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.05);
  width: 250px;

  h4 {
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 15px;
    color: #000000;
    margin: 0 0 6px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .status {
      font-size: 12px;
      padding: 3px 8px;
      background: #e8f5e9;
      color: #2e7d32;
      border-radius: 8px;
    }
  }

  .graph-container {
    flex-grow: 1;
    background: #f8f9fa;
    border-radius: 8px;
    height: 180px;
  }
`;

const SensorSection = styled.div`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-family: 'Pretendard';
  font-weight: 600;
  font-size: 24px;
  color: #000000;
  margin: 0 0 24px 0;
`;

const SensorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SensorCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 10px;
  width: 100%;
  height: 308px;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.05);
`;

const SensorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const ListHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 8px;
  font-family: 'Pretendard';
  font-size: 13px;
  color: #666666;
  font-weight: 600;

  span {
    text-align: center;
  }

  @media (max-width: 1600px) {
    font-size: 12px;
    gap: 6px;
    padding: 6px;
  }
`;

const SensorList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 8px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f8f9fa;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #dde2e6;
    border-radius: 3px;
  }

  @media (max-width: 1600px) {
    font-size: 12px;
  }
`;

const SensorItem = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid #f8f9fa;

  &:last-child {
    border-bottom: none;
  }

  > * {
    text-align: center;
  }

  @media (max-width: 1600px) {
    gap: 6px;
    padding: 6px;
  }
`;

const SensorNo = styled.span`
  font-family: 'Pretendard';
  font-size: 13px;
  color: #666666;
  text-align: center;

  @media (max-width: 1600px) {
    font-size: 12px;
  }
`;

const SensorType = styled.span`
  font-family: 'Pretendard';
  font-size: 13px;
  color: #666666;
  text-align: center;

  @media (max-width: 1600px) {
    font-size: 12px;
  }
`;

const SensorConnection = styled.span`
  font-family: 'Pretendard';
  font-size: 13px;
  color: #2e7d32;
  font-weight: 600;
  text-align: center;

  @media (max-width: 1600px) {
    font-size: 12px;
  }
`;

const SensorStatus = styled.div<{ status?: string }>`
  font-family: 'Pretendard';
  font-size: 13px;
  color: #2e7d32;
  font-weight: 600;
  text-align: center;
  display: flex;
  justify-content: center;

  ${(props) =>
    props.status &&
    `
    padding: 4px 12px;
    background: ${
      props.status === 'normal'
        ? '#E8F5E9'
        : props.status === 'warning'
        ? '#FFF3E0'
        : '#FFEBEE'
    };
    color: ${
      props.status === 'normal'
        ? '#2E7D32'
        : props.status === 'warning'
        ? '#EF6C00'
        : '#C62828'
    };
    border-radius: 12px;
    margin: 0 auto;
  `}

  @media (max-width: 1600px) {
    font-size: 12px;
    ${(props) =>
      props.status &&
      `
      padding: 3px 8px;
    `}
  }
`;

const SensorValue = styled.div<{ status?: string }>`
  font-family: 'Pretendard';
  font-weight: 600;
  font-size: 13px;
  color: ${({ status }) =>
    status === 'normal'
      ? '#000000'
      : status === 'warning'
      ? '#EF6C00'
      : '#C62828'};
  text-align: center;

  span {
    font-size: 12px;
    color: #999999;
    margin-left: 4px;
  }

  @media (max-width: 1600px) {
    font-size: 12px;

    span {
      font-size: 11px;
    }
  }
`;

const SensorTitle = styled.h3`
  font-family: 'Pretendard';
  font-weight: 600;
  font-size: 18px;
  color: #000000;
  margin: 0;
`;

const GNB = styled.nav`
  width: 100%;
  height: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 20px 20px 20px;
  user-select: none;
  position: relative;
  z-index: 1;
  max-width: 1280px;
  margin: 0 auto;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  user-select: none;
  height: 36px;
  padding: 0 16px;
  border-radius: 8px;

  span {
    font-family: 'Pretendard';
    font-weight: 700;
    font-size: 24px;
    color: #1e293b;
    line-height: 36px;
    letter-spacing: -0.02em;
  }

  @media (max-width: 768px) {
    gap: 8px;
  }
`;

const LogoImageWrapper = styled.div`
  position: relative;
  width: 36px;
  height: 36px;
`;
