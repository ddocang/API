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
  MapContainer,
  SensorTooltip,
  LogButton,
  LogPopup,
  LogHeader,
  LogContent,
  LogItem,
  BannerTitle,
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

// 가스 감지기 정보 배열
const GAS_SENSORS = [
  { id: 'gas-1', x: 128, y: 82, name: '가스감지기1' },
  { id: 'gas-2', x: 263, y: 90, name: '가스감지기2' },
  { id: 'gas-3', x: 333, y: 90, name: '가스감지기3' },
  { id: 'gas-4', x: 263, y: 255, name: '가스감지기4' },
  { id: 'gas-5', x: 333, y: 255, name: '가스감지기5' },
  { id: 'gas-6', x: 448, y: 255, name: '가스감지기6' },
  { id: 'gas-7', x: 448, y: 90, name: '가스감지기7' },
  { id: 'gas-8', x: 525, y: 95, name: '가스감지기8' },
  { id: 'gas-9', x: 525, y: 235, name: '가스감지기9' },
  { id: 'gas-10', x: 562, y: 110, name: '가스감지기10' },
  { id: 'gas-11', x: 562, y: 222, name: '가스감지기11' },
  { id: 'gas-12', x: 615, y: 165, name: '가스감지기12' },
  { id: 'gas-13', x: 665, y: 165, name: '가스감지기13' },
  { id: 'gas-14', x: 328, y: 336, name: '가스감지기14' },
  { id: 'gas-15', x: 458, y: 336, name: '가스감지기15' },
];

// 화재 감지기 정보 배열
const FIRE_SENSORS = [
  { id: 'fire-1', x: 210, y: 265, name: '화재감지기1' },
  { id: 'fire-2', x: 210, y: 377, name: '화재감지기2' },
  { id: 'fire-3', x: 485, y: 265, name: '화재감지기3' },
  { id: 'fire-4', x: 575, y: 251, name: '화재감지기4' },
  { id: 'fire-5', x: 485, y: 78, name: '화재감지기5' },
  { id: 'fire-6', x: 602, y: 78, name: '화재감지기6' },
];

// 진동 감지기 정보 배열
const VIBRATION_SENSORS = [
  { id: 'vibration-1', x: 260, y: 305, name: '진동감지기1' },
  { id: 'vibration-2', x: 277, y: 362, name: '진동감지기2' },
  { id: 'vibration-3', x: 295, y: 305, name: '진동감지기3' },
  { id: 'vibration-4', x: 390, y: 305, name: '진동감지기4' },
  { id: 'vibration-5', x: 407, y: 362, name: '진동감지기5' },
  { id: 'vibration-6', x: 427, y: 305, name: '진동감지기6' },
  { id: 'vibration-7', x: 525, y: 120, name: '진동감지기7' },
  { id: 'vibration-8', x: 525, y: 195, name: '진동감지기8' },
  { id: 'vibration-9', x: 561, y: 135, name: '진동감지기9' },
];

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
      { id: 16, name: '화재감지기1', unit: '--', status: 'normal' },
      { id: 17, name: '화재감지기2', unit: '--', status: 'normal' },
      { id: 18, name: '화재감지기3', unit: '--', status: 'normal' },
      { id: 19, name: '화재감지기4', unit: '--', status: 'normal' },
      { id: 20, name: '화재감지기5', unit: '--', status: 'normal' },
      { id: 21, name: '화재감지기6', unit: '--', status: 'normal' },
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
  const [selectedSensorId, setSelectedSensorId] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipSensor, setTooltipSensor] = useState<{
    id: string;
    name: string;
    status: 'normal' | 'warning' | 'danger';
    value?: string;
    unit?: string;
  } | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [animationDelays, setAnimationDelays] = useState<
    Record<string, number>
  >({});
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [logItems, setLogItems] = useState<
    Array<{
      time: string;
      sensorName: string;
      status: 'warning' | 'danger';
      value?: string;
      unit?: string;
    }>
  >([]);

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

  const updateData = useEffect(() => {
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

  const handleSensorClick = (sensorId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const target = event.currentTarget as Element;
    const rect = target.getBoundingClientRect();
    const mapContainer = document.querySelector('.map-container');
    const mapRect = mapContainer?.getBoundingClientRect();

    if (mapRect) {
      const x = rect.left - mapRect.left + rect.width / 2;
      const y = rect.top - mapRect.top;

      setTooltipPosition({ x, y });

      if (selectedSensorId === sensorId) {
        setSelectedSensorId(null);
        setShowTooltip(false);
        setTooltipSensor(null);
      } else {
        setSelectedSensorId(sensorId);
        setShowTooltip(true);

        // Find the sensor from the arrays based on sensorId
        const sensorType = sensorId.split('-')[0];
        const sensor = [
          ...GAS_SENSORS,
          ...FIRE_SENSORS,
          ...VIBRATION_SENSORS,
        ].find((s) => s.id === sensorId);

        if (sensor) {
          setTooltipSensor({
            id: sensorId,
            name: sensor.name,
            status: getSensorStatus(sensorId),
            value:
              sensorType === 'vibration'
                ? FACILITY_DETAIL.sensors.vibration.find(
                    (s) => s.id === parseInt(sensorId.split('-')[1])
                  )?.value
                : '--',
            unit: sensorType === 'vibration' ? 'g' : '--',
          });
        }
      }
    }
  };

  const getSensorStatus = (
    sensorId: string
  ): 'normal' | 'warning' | 'danger' => {
    // 임시로 랜덤 상태 반환 (실제로는 센서 데이터에 따라 결정되어야 함)
    const statuses: Array<'normal' | 'warning' | 'danger'> = [
      'normal',
      'warning',
      'danger',
    ];
    return statuses[Math.floor(Math.random() * 3)];
  };

  const getSensorInfo = (sensorId: string) => {
    const type = sensorId.split('-')[0];
    const sensor =
      type === 'vibration'
        ? vibrationSensors.find(
            (s) => s.id.toString() === sensorId.split('-')[1]
          )
        : FACILITY_DETAIL.sensors[type as 'gas' | 'fire'].find(
            (s) => s.id.toString() === sensorId.split('-')[1]
          );

    return {
      name: sensor?.name || '',
      value: sensor?.value || '--',
      unit: sensor?.unit || '',
      status: sensor?.status || 'normal',
    };
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setSelectedSensorId(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // 필터링된 센서 아이콘 계산
  const filteredSensorIcons = useMemo(() => {
    if (selectedSensorType === 'all') {
      return [...GAS_SENSORS, ...FIRE_SENSORS, ...VIBRATION_SENSORS];
    }
    if (selectedSensorType === 'gas') return GAS_SENSORS;
    if (selectedSensorType === 'fire') return FIRE_SENSORS;
    return VIBRATION_SENSORS;
  }, [selectedSensorType]);

  // 컴포넌트가 마운트될 때 한 번만 애니메이션 딜레이 계산
  useEffect(() => {
    const delays = filteredSensorIcons.reduce((acc, sensor) => {
      acc[sensor.id] = Math.random() * 1.5;
      return acc;
    }, {} as Record<string, number>);
    setAnimationDelays(delays);
  }, []);

  // 로그 아이템 추가 함수
  const addLogItem = useCallback(
    (sensor: any, status: 'warning' | 'danger') => {
      const now = new Date();
      const time = formatTime(now);

      setLogItems((prev) => [
        {
          time,
          sensorName: sensor.name,
          status,
          value: sensor.value,
          unit: sensor.unit,
        },
        ...prev,
      ]);
    },
    [formatTime]
  );

  // 센서 상태 변경 시 로그 추가
  useEffect(() => {
    const allSensors = [
      ...FACILITY_DETAIL.sensors.gas,
      ...FACILITY_DETAIL.sensors.fire,
      ...vibrationSensors,
    ];

    allSensors.forEach((sensor) => {
      const status = getSensorStatus(sensor.id.toString());
      if (status === 'warning' || status === 'danger') {
        addLogItem(sensor, status);
      }
    });
  }, [addLogItem, vibrationSensors]);

  const options = {
    chart: {
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    stroke: {
      curve: 'smooth',
      width: 2,
      colors: ['#4D7298'],
    },
    markers: {
      size: 0,
      hover: {
        size: 5,
        sizeOffset: 3,
      },
    },
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
            <span>HyGE&nbsp;Safety&nbsp;Monitoring</span>
          </Logo>
          <BannerTitle>삼척 교동 수소 스테이션</BannerTitle>
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
            <LogButton as="button" onClick={() => setIsLogOpen(true)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z"
                  clipRule="evenodd"
                />
              </svg>
              경고 로그
            </LogButton>
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
      </TopBanner>

      <ContentSection>
        <MapSection>
          <LeftColumn>
            <MapView>
              <MapContainer
                className="map-container"
                onClick={() => {
                  setShowTooltip(false);
                  setSelectedSensorId(null);
                  setTooltipSensor(null);
                }}
              >
                <svg
                  viewBox="0 0 828 672"
                  preserveAspectRatio="xMidYMid meet"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <image
                    href="/images/monitoring/detail/map.svg"
                    width="828"
                    height="672"
                    preserveAspectRatio="xMidYMid meet"
                  />
                  {filteredSensorIcons.map((sensor) => (
                    <g
                      key={sensor.id}
                      className="sensor-icon"
                      data-type={sensor.id.split('-')[0]}
                      transform={`translate(${sensor.x}, ${sensor.y})`}
                      onClick={(e) => {
                        e.stopPropagation(); // 이벤트 버블링 방지
                        handleSensorClick(sensor.id, e);
                      }}
                      style={
                        animationDelays[sensor.id]
                          ? {
                              animationDelay: `${animationDelays[sensor.id]}s`,
                            }
                          : undefined
                      }
                    >
                      <image
                        href={`/images/monitoring/detail/${
                          sensor.id.split('-')[0]
                        }_box.svg`}
                        x="-30"
                        y="-23"
                        width="60"
                        height="60"
                      />
                    </g>
                  ))}
                </svg>
                {showTooltip && tooltipSensor && (
                  <SensorTooltip
                    status={tooltipSensor.status}
                    style={{
                      position: 'absolute',
                      left: `${tooltipPosition.x}px`,
                      top: `${tooltipPosition.y}px`,
                      transform: 'translate(-50%, -100%)',
                    }}
                    onClick={(e) => e.stopPropagation()} // 툴큭 클릭 시 이벤트 버블링 방지
                  >
                    <div className="tooltip-header">
                      <div className="status-indicator" />
                      <span className="name">{tooltipSensor.name}</span>
                      <span className="status-text">
                        {tooltipSensor.status === 'normal'
                          ? '정상'
                          : tooltipSensor.status === 'warning'
                          ? '경고'
                          : '위험'}
                      </span>
                    </div>
                    <div className="tooltip-content">
                      <div className="info-row">
                        <span className="label">측정값</span>
                        <span className="value">
                          {tooltipSensor.value} {tooltipSensor.unit}
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="label">상태</span>
                        <span className="value">연결됨</span>
                      </div>
                      <div className="info-row">
                        <span className="label">업데이트</span>
                        <span className="value">{lastUpdateTime}</span>
                      </div>
                    </div>
                  </SensorTooltip>
                )}
              </MapContainer>
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
                  <span
                    className="sensor-name"
                    data-full-name="가스감지기"
                    data-short-name="가스"
                  />
                  <span className="count">
                    {FACILITY_DETAIL.sensors.gas.length}
                  </span>
                </FilterButton>
                <FilterButton
                  active={selectedSensorType === 'fire'}
                  onClick={() => setSelectedSensorType('fire')}
                >
                  <span
                    className="sensor-name"
                    data-full-name="화재감지기"
                    data-short-name="화재"
                  />
                  <span className="count">
                    {FACILITY_DETAIL.sensors.fire.length}
                  </span>
                </FilterButton>
                <FilterButton
                  active={selectedSensorType === 'vibration'}
                  onClick={() => setSelectedSensorType('vibration')}
                >
                  <span
                    className="sensor-name"
                    data-full-name="진동감지기"
                    data-short-name="진동"
                  />
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
                {filteredSensors.map((sensor, index) => {
                  const shortName = sensor.name.replace(/감지기(\d+)$/, '#$1');
                  return (
                    <SensorItem key={sensor.id}>
                      <SensorNo>{index + 1}</SensorNo>
                      <SensorType>
                        <span
                          className="sensor-name"
                          data-full-name={sensor.name}
                          data-short-name={shortName}
                        />
                      </SensorType>
                      <SensorConnection>연결됨</SensorConnection>
                      <SensorStatus status={sensor.status}>
                        {sensor.status === 'normal' ? '정상' : sensor.status}
                      </SensorStatus>
                      <SensorValue status={sensor.status}>
                        {sensor.value || '--'}
                        <span>{sensor.unit}</span>
                      </SensorValue>
                    </SensorItem>
                  );
                })}
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
                        stroke="#4D7298"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{
                          r: 4,
                          fill: '#4D7298',
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
                    stroke="#4D7298"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{
                      r: 6,
                      fill: '#4D7298',
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

      <LogPopup isOpen={isLogOpen}>
        <LogHeader>
          <h2>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z"
                clipRule="evenodd"
              />
            </svg>
            경고 로그
          </h2>
          <CloseButton onClick={() => setIsLogOpen(false)}>&times;</CloseButton>
        </LogHeader>
        <LogContent>
          {logItems.map((item, index) => (
            <LogItem key={index} severity={item.status}>
              <span className="time">{item.time}</span>
              <span className="content">
                {item.sensorName}
                {item.value && item.unit && ` (${item.value}${item.unit})`}
              </span>
              <span className="status">
                {item.status === 'warning' ? '경고' : '위험'}
              </span>
            </LogItem>
          ))}
          {logItems.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                color: '#64748b',
                padding: '40px 0',
              }}
            >
              경고 또는 위험 상태의 센서가 없습니다.
            </div>
          )}
        </LogContent>
      </LogPopup>

      <PopupOverlay isOpen={isLogOpen} onClick={() => setIsLogOpen(false)} />
    </Container>
  );
}
