'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import {
  Container,
  TopBanner,
  BannerBackground,
  DarkOverlay,
  BannerContent,
  TitleContainer,
  Title,
  Subtitle,
  UpdateTime,
  ContentSection,
  MapSection,
  LeftColumn,
  MapView,
  SensorIcon,
  SensorCard,
  ListHeader,
  SensorList,
  SensorItem,
  SensorNo,
  SensorType,
  SensorConnection,
  SensorStatus,
  SensorValue,
  SensorTitle,
  GNB,
  Logo,
  LogoImageWrapper,
  MainMenu,
  NavLinkStyle,
  BackButton,
  SensorHeader,
  FilterButton,
  VibrationGraphContainer,
  VibrationGraphCard,
  CustomTooltip,
  DetailedGraphPopup,
  PopupOverlay,
  PopupHeader,
  PopupLogo,
  CloseButton,
  DetailedGraphContainer,
} from './styles';

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

interface VibrationDataPoint {
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
        name: '가스감지기1',
        unit: '--',
        status: 'normal',
      },
      {
        id: 2,
        name: '가스감지기2',
        unit: '--',
        status: 'normal',
      },
      {
        id: 3,
        name: '가스감지기3',
        unit: '--',
        status: 'normal',
      },
      {
        id: 4,
        name: '가스감지기4',
        unit: '--',
        status: 'normal',
      },
      {
        id: 5,
        name: '가스감지기5',
        unit: '--',
        status: 'normal',
      },
      {
        id: 6,
        name: '가스감지기6',
        unit: '--',
        status: 'normal',
      },
      {
        id: 7,
        name: '가스감지기7',
        unit: '--',
        status: 'normal',
      },
      {
        id: 8,
        name: '가스감지기8',
        unit: '--',
        status: 'normal',
      },
      {
        id: 9,
        name: '가스감지기9',
        unit: '--',
        status: 'normal',
      },
      {
        id: 10,
        name: '가스감지기10',
        unit: '--',
        status: 'normal',
      },
      {
        id: 11,
        name: '가스감지기11',
        unit: '--',
        status: 'normal',
      },
      {
        id: 12,
        name: '가스감지기12',
        unit: '--',
        status: 'normal',
      },
      {
        id: 13,
        name: '가스감지기13',
        unit: '--',
        status: 'normal',
      },
      {
        id: 14,
        name: '가스감지기14',
        unit: '--',
        status: 'normal',
      },
      {
        id: 15,
        name: '가스감지기15',
        unit: '--',
        status: 'normal',
      },
    ],
    fire: [
      { id: 16, name: '화재감지1', unit: '--', status: 'normal' },
      { id: 17, name: '화재감지2', unit: '--', status: 'normal' },
      { id: 18, name: '화재감지3', unit: '--', status: 'normal' },
      { id: 19, name: '화재감지4', unit: '--', status: 'normal' },
      { id: 20, name: '화재감지5', unit: '--', status: 'normal' },
      { id: 21, name: '화재감지6', unit: '--', status: 'normal' },
    ],
    vibration: [
      {
        id: 22,
        name: '진동감지기1',
        value: '0.85',
        unit: 'g',
        status: 'normal',
        data: [],
        detailedData: [],
      },
      {
        id: 23,
        name: '진동감지기2',
        value: '0.92',
        unit: 'g',
        status: 'normal',
        data: [],
        detailedData: [],
      },
      {
        id: 24,
        name: '진동감지기3',
        value: '0.78',
        unit: 'g',
        status: 'normal',
        data: [],
        detailedData: [],
      },
      {
        id: 25,
        name: '진동감지기4',
        value: '0.88',
        unit: 'g',
        status: 'normal',
        data: [],
        detailedData: [],
      },
      {
        id: 26,
        name: '진동감지기5',
        value: '0.95',
        unit: 'g',
        status: 'normal',
        data: [],
        detailedData: [],
      },
      {
        id: 27,
        name: '진동감지기6',
        value: '0.82',
        unit: 'g',
        status: 'normal',
        data: [],
        detailedData: [],
      },
      {
        id: 28,
        name: '진동감지기7',
        value: '0.87',
        unit: 'g',
        status: 'normal',
        data: [],
        detailedData: [],
      },
      {
        id: 29,
        name: '진동감지기8',
        value: '0.91',
        unit: 'g',
        status: 'normal',
        data: [],
        detailedData: [],
      },
      {
        id: 30,
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
  const [selectedSensorType, setSelectedSensorType] = useState<
    'all' | 'gas' | 'fire' | 'vibration'
  >('all');

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

  const filteredSensors = useMemo(() => {
    if (selectedSensorType === 'all') {
      return [
        ...FACILITY_DETAIL.sensors.gas,
        ...FACILITY_DETAIL.sensors.fire,
        ...vibrationSensors,
      ];
    }
    if (selectedSensorType === 'gas') return FACILITY_DETAIL.sensors.gas;
    if (selectedSensorType === 'fire') return FACILITY_DETAIL.sensors.fire;
    return vibrationSensors;
  }, [selectedSensorType, vibrationSensors]);

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
            <span>
              HyGE&nbsp;안전모니터링_삼척&nbsp;교동&nbsp;수소&nbsp;스테이션
            </span>
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
                src="/images/monitoring/detail/kd_map.png"
                alt="시설 위치"
                width={828}
                height={672}
                quality={90}
                style={{
                  objectFit: 'contain',
                  width: '100%',
                  height: '100%',
                  maxWidth: '100%',
                  maxHeight: '100%',
                }}
                priority
              />
              {/* Gas Sensors */}
              <SensorIcon type="gas" x={15} y={15}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M8 4.5C9.1 4.5 10 5.2 10.3 6.2C10.4 6.19 10.5 6.18 10.6 6.18C12.1 6.18 13.4 7.4 13.4 9C13.4 10.6 12.1 11.8 10.6 11.8H4.4C5.8 11.2 6.8 10.2 7.4 9C6.7 9.8 5.2 10.6 4.1 10.6C3.1 10.6 2.2 9.8 2.2 8.8C2.2 7.8 3.1 7 4.1 7C4.2 7 4.3 7 4.4 7C4.5 5.4 6.1 4.5 8 4.5Z" />
                </svg>
              </SensorIcon>
              <SensorIcon type="gas" x={35} y={20}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M8 4.5C9.1 4.5 10 5.2 10.3 6.2C10.4 6.19 10.5 6.18 10.6 6.18C12.1 6.18 13.4 7.4 13.4 9C13.4 10.6 12.1 11.8 10.6 11.8H4.4C5.8 11.2 6.8 10.2 7.4 9C6.7 9.8 5.2 10.6 4.1 10.6C3.1 10.6 2.2 9.8 2.2 8.8C2.2 7.8 3.1 7 4.1 7C4.2 7 4.3 7 4.4 7C4.5 5.4 6.1 4.5 8 4.5Z" />
                </svg>
              </SensorIcon>
              <SensorIcon type="gas" x={55} y={25}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M8 4.5C9.1 4.5 10 5.2 10.3 6.2C10.4 6.19 10.5 6.18 10.6 6.18C12.1 6.18 13.4 7.4 13.4 9C13.4 10.6 12.1 11.8 10.6 11.8H4.4C5.8 11.2 6.8 10.2 7.4 9C6.7 9.8 5.2 10.6 4.1 10.6C3.1 10.6 2.2 9.8 2.2 8.8C2.2 7.8 3.1 7 4.1 7C4.2 7 4.3 7 4.4 7C4.5 5.4 6.1 4.5 8 4.5Z" />
                </svg>
              </SensorIcon>

              {/* Fire Sensors */}
              <SensorIcon type="fire" x={25} y={45}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <ellipse cx="9.9601" cy="11.1764" rx="1.87224" ry="1.90443" />
                  <path d="M8.3231 2.6665C11.0456 4.438 10.5046 6.9591 9.10445 8.419C8.43214 9.1205 7.87034 9.692 7.44381 10.2269C7.30456 10.3883 7.17597 10.5731 7.07989 10.7765C7.02674 10.8848 6.98041 10.9951 6.94627 11.0589C6.94273 11.0761 6.93958 11.0934 6.93656 11.1106C6.92717 11.157 6.91815 11.2032 6.90959 11.2503C6.84069 11.4595 6.80614 11.6869 6.80614 11.9263C6.80614 12.7594 7.16275 13.5227 7.72641 14.0659C7.72996 14.0716 7.73349 14.078 7.73706 14.0835C4.7566 13.4097 3.6407 11.653 3.7346 9.47879C3.8266 7.34816 5.5802 6.1102 6.9432 4.7253C8.0636 3.5873 8.1842 2.691 8.3231 2.6665Z" />
                </svg>
              </SensorIcon>
              <SensorIcon type="fire" x={45} y={45}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <ellipse cx="9.9601" cy="11.1764" rx="1.87224" ry="1.90443" />
                  <path d="M8.3231 2.6665C11.0456 4.438 10.5046 6.9591 9.10445 8.419C8.43214 9.1205 7.87034 9.692 7.44381 10.2269C7.30456 10.3883 7.17597 10.5731 7.07989 10.7765C7.02674 10.8848 6.98041 10.9951 6.94627 11.0589C6.94273 11.0761 6.93958 11.0934 6.93656 11.1106C6.92717 11.157 6.91815 11.2032 6.90959 11.2503C6.84069 11.4595 6.80614 11.6869 6.80614 11.9263C6.80614 12.7594 7.16275 13.5227 7.72641 14.0659C7.72996 14.0716 7.73349 14.078 7.73706 14.0835C4.7566 13.4097 3.6407 11.653 3.7346 9.47879C3.8266 7.34816 5.5802 6.1102 6.9432 4.7253C8.0636 3.5873 8.1842 2.691 8.3231 2.6665Z" />
                </svg>
              </SensorIcon>
              <SensorIcon type="fire" x={65} y={45}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <ellipse cx="9.9601" cy="11.1764" rx="1.87224" ry="1.90443" />
                  <path d="M8.3231 2.6665C11.0456 4.438 10.5046 6.9591 9.10445 8.419C8.43214 9.1205 7.87034 9.692 7.44381 10.2269C7.30456 10.3883 7.17597 10.5731 7.07989 10.7765C7.02674 10.8848 6.98041 10.9951 6.94627 11.0589C6.94273 11.0761 6.93958 11.0934 6.93656 11.1106C6.92717 11.157 6.91815 11.2032 6.90959 11.2503C6.84069 11.4595 6.80614 11.6869 6.80614 11.9263C6.80614 12.7594 7.16275 13.5227 7.72641 14.0659C7.72996 14.0716 7.73349 14.078 7.73706 14.0835C4.7566 13.4097 3.6407 11.653 3.7346 9.47879C3.8266 7.34816 5.5802 6.1102 6.9432 4.7253C8.0636 3.5873 8.1842 2.691 8.3231 2.6665Z" />
                </svg>
              </SensorIcon>

              {/* Vibration Sensors */}
              <SensorIcon type="vibration" x={35} y={65}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2c5.5 0 10 4.5 10 10s-4.5 10-10 10S2 17.5 2 12 6.5 2 12 2zm0 2c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 3c2.8 0 5 2.2 5 5s-2.2 5-5 5-5-2.2-5-5 2.2-5 5-5z" />
                </svg>
              </SensorIcon>
              <SensorIcon type="vibration" x={55} y={65}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2c5.5 0 10 4.5 10 10s-4.5 10-10 10S2 17.5 2 12 6.5 2 12 2zm0 2c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 3c2.8 0 5 2.2 5 5s-2.2 5-5 5-5-2.2-5-5 2.2-5 5-5z" />
                </svg>
              </SensorIcon>
              <SensorIcon type="vibration" x={75} y={65}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2c5.5 0 10 4.5 10 10s-4.5 10-10 10S2 17.5 2 12 6.5 2 12 2zm0 2c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 3c2.8 0 5 2.2 5 5s-2.2 5-5 5-5-2.2-5-5 2.2-5 5-5z" />
                </svg>
              </SensorIcon>
            </MapView>
            <SensorCard>
              <SensorHeader>
                <FilterButton
                  active={selectedSensorType === 'all'}
                  onClick={() => setSelectedSensorType('all')}
                >
                  전체
                  <span className="count">
                    {FACILITY_DETAIL.sensors.gas.length +
                      FACILITY_DETAIL.sensors.fire.length +
                      vibrationSensors.length}
                  </span>
                </FilterButton>
                <FilterButton
                  active={selectedSensorType === 'gas'}
                  onClick={() => setSelectedSensorType('gas')}
                >
                  가스감지기
                  <span className="count">
                    {FACILITY_DETAIL.sensors.gas.length}
                  </span>
                </FilterButton>
                <FilterButton
                  active={selectedSensorType === 'fire'}
                  onClick={() => setSelectedSensorType('fire')}
                >
                  화재감지기
                  <span className="count">
                    {FACILITY_DETAIL.sensors.fire.length}
                  </span>
                </FilterButton>
                <FilterButton
                  active={selectedSensorType === 'vibration'}
                  onClick={() => setSelectedSensorType('vibration')}
                >
                  진동감지기
                  <span className="count">{vibrationSensors.length}</span>
                </FilterButton>
              </SensorHeader>
              <ListHeader>
                <span>No</span>
                <span>종류</span>
                <span>연결</span>
                <span>상태</span>
                <span>Data</span>
              </ListHeader>
              <SensorList>
                {filteredSensors.map((sensor, index) => (
                  <SensorItem key={sensor.id}>
                    <SensorNo>{index + 1}</SensorNo>
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
