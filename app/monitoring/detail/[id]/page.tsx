'use client';
import useWebSocket from '@/hooks/useWebSocket'; // ← 추가
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  ReferenceArea,
  ReferenceLine,
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
  FilterDropdown,
  FilterMenu,
  FilterMenuItem,
  PopupButton,
  GraphStatsBar,
} from './styles';
import { colors } from '@/app/styles/colors';
import { ChevronDown } from 'lucide-react';
import ThemeToggleButton from '@/app/components/ThemeToggleButton';
import { ThemeProvider } from '@/app/contexts/ThemeContext';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import styled from '@emotion/styled';

interface SensorBase {
  id: number;
  name: string;
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
  timestamp: number;
  value: number;
}

interface VibrationDataPoint {
  time: string;
  value: number;
}

interface VibrationSensor extends SensorBase {
  value: string;
  status: string;
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
  { id: 'gas-7', x: 128, y: 85, name: '가스감지기7' },
  { id: 'gas-3', x: 263, y: 95, name: '가스감지기3' },
  { id: 'gas-4', x: 333, y: 95, name: '가스감지기4' },
  { id: 'gas-1', x: 263, y: 258, name: '가스감지기1' },
  { id: 'gas-2', x: 333, y: 258, name: '가스감지기2' },
  { id: 'gas-9', x: 448, y: 258, name: '가스감지기9' },
  { id: 'gas-8', x: 448, y: 95, name: '가스감지기8' },
  { id: 'gas-11', x: 522, y: 98, name: '가스감지기11' },
  { id: 'gas-10', x: 522, y: 238, name: '가스감지기10' },
  { id: 'gas-13', x: 559, y: 113, name: '가스감지기13' },
  { id: 'gas-12', x: 559, y: 225, name: '가스감지기12' },
  { id: 'gas-15', x: 612, y: 168, name: '가스감지기15' },
  { id: 'gas-14', x: 662, y: 168, name: '가스감지기14' },
  { id: 'gas-5', x: 328, y: 339, name: '가스감지기5' },
  { id: 'gas-6', x: 458, y: 339, name: '가스감지기6' },
];

// 화재 감지기 정보 배열
const FIRE_SENSORS = [
  { id: 'fire-1', x: 210, y: 268, name: '화재감지기1' },
  { id: 'fire-2', x: 210, y: 380, name: '화재감지기2' },
  { id: 'fire-3', x: 485, y: 268, name: '화재감지기3' },
  { id: 'fire-4', x: 575, y: 254, name: '화재감지기4' },
  { id: 'fire-5', x: 485, y: 81, name: '화재감지기5' },
  { id: 'fire-6', x: 602, y: 81, name: '화재감지기6' },
];

// 진동 감지기 정보 배열
const VIBRATION_SENSORS = [
  { id: 'vibration-1', x: 260, y: 308, name: '진동감지기1' },
  { id: 'vibration-2', x: 277, y: 365, name: '진동감지기2' },
  { id: 'vibration-3', x: 295, y: 308, name: '진동감지기3' },
  { id: 'vibration-4', x: 390, y: 308, name: '진동감지기4' },
  { id: 'vibration-5', x: 407, y: 365, name: '진동감지기5' },
  { id: 'vibration-6', x: 427, y: 308, name: '진동감지기6' },
  { id: 'vibration-8', x: 523, y: 123, name: '진동감지기8' },
  { id: 'vibration-9', x: 523, y: 198, name: '진동감지기9' },
  { id: 'vibration-7', x: 559, y: 138, name: '진동감지기7' },
];

// 진동감지기 위험 임계값 상수
const VIBRATION_DANGER_THRESHOLD = 1000;

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
      { id: 1, name: '가스감지기1', status: '--' },
      { id: 2, name: '가스감지기2', status: '--' },
      { id: 3, name: '가스감지기3', status: '--' },
      { id: 4, name: '가스감지기4', status: '--' },
      { id: 5, name: '가스감지기5', status: '--' },
      { id: 6, name: '가스감지기6', status: '--' },
      { id: 7, name: '가스감지기7', status: '--' },
      { id: 8, name: '가스감지기8', status: '--' },
      { id: 9, name: '가스감지기9', status: '--' },
      { id: 10, name: '가스감지기10', status: '--' },
      { id: 11, name: '가스감지기11', status: '--' },
      { id: 12, name: '가스감지기12', status: '--' },
      { id: 13, name: '가스감지기13', status: '--' },
      { id: 14, name: '가스감지기14', status: '--' },
      { id: 15, name: '가스감지기15', status: '--' },
    ],
    fire: [
      { id: 16, name: '화재감지기1', status: '--' },
      { id: 17, name: '화재감지기2', status: '--' },
      { id: 18, name: '화재감지기3', status: '--' },
      { id: 19, name: '화재감지기4', status: '--' },
      { id: 20, name: '화재감지기5', status: '--' },
      { id: 21, name: '화재감지기6', status: '--' },
    ],
    vibration: [
      {
        id: 22,
        name: '진동감지기1',
        value: '',
        status: '--',
        data: [],
        detailedData: [],
      },
      {
        id: 23,
        name: '진동감지기2',
        value: '',
        status: '--',
        data: [],
        detailedData: [],
      },
      {
        id: 24,
        name: '진동감지기3',
        value: '',
        status: '--',
        data: [],
        detailedData: [],
      },
      {
        id: 25,
        name: '진동감지기4',
        value: '',
        status: '--',
        data: [],
        detailedData: [],
      },
      {
        id: 26,
        name: '진동감지기5',
        value: '',
        status: '--',
        data: [],
        detailedData: [],
      },
      {
        id: 27,
        name: '진동감지기6',
        value: '',
        status: '--',
        data: [],
        detailedData: [],
      },
      {
        id: 28,
        name: '진동감지기7',
        value: '',
        status: '--',
        data: [],
        detailedData: [],
      },
      {
        id: 29,
        name: '진동감지기8',
        value: '',
        status: '--',
        data: [],
        detailedData: [],
      },
      {
        id: 30,
        name: '진동감지기9',
        value: '',
        status: '--',
        data: [],
        detailedData: [],
      },
    ],
  },
};

// 색상 세트 타입 정의
type ChartColorSet = {
  line: string;
  fill: string;
};

// 모바일 여부를 감지하는 훅
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);
  return matches;
}

export default function MonitoringDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <ThemeProvider>
      <DetailPageContent params={params} />
    </ThemeProvider>
  );
}

function DetailPageContent({ params }: { params: { id: string } }) {
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
        value: '0',
        status: '',
        data: [],
        detailedData: [],
      }))
  );
  const [gasStatus, setGasStatus] = useState<number | null>(null);
  const [fireStatus, setFireStatus] = useState<number | null>(null);
  const [gasStatusArr, setGasStatusArr] = useState<number[]>([]);
  const [fireStatusArr, setFireStatusArr] = useState<number[]>([]);

  const handleWebSocketMessage = useCallback(
    async (data: any) => {
      // 전체 데이터 구조 로깅
      console.log('📡 수신된 WebSocket 데이터:', {
        topic_id: data?.mqtt_data?.topic_id,
        last_update_time: data?.mqtt_data?.data?.last_update_time,
        barr: data?.mqtt_data?.data?.barr,
      });

      // BASE/P001 토픽 데이터만 처리
      if (data?.mqtt_data?.topic_id === 'BASE/P001') {
        try {
          const barrString = data.mqtt_data.data.barr;
          const lastUpdateTime = data.mqtt_data.data.last_update_time;

          if (!barrString) {
            console.warn('⚠️ barr 데이터가 없음');
            return;
          }

          const barrValues = barrString
            .split(',')
            .slice(0, 9)
            .map((value: string) => parseInt(value));

          if (barrValues.length !== 9) {
            console.warn('⚠️ barr 데이터 길이가 잘못됨:', barrValues.length);
            return;
          }

          // 이전 데이터와 비교를 위한 로깅
          console.log('🔄 진동 데이터 업데이트:', {
            last_update_time: lastUpdateTime,
            previous_values: vibrationSensors.map((s) => s.value),
            new_values: barrValues,
          });

          const now = new Date();
          const timeStr = now.toTimeString().split(' ')[0];

          setVibrationSensors((prevSensors) =>
            prevSensors.map((sensor, index) => {
              if (index < 9) {
                const value = barrValues[index];
                const newDataPoint = {
                  time: timeStr,
                  value: value,
                };
                const newDetailedDataPoint = {
                  time: timeStr,
                  timestamp: now.getTime(),
                  value: value,
                };
                const status =
                  value >= VIBRATION_DANGER_THRESHOLD ? 'danger' : 'normal';

                if (status === 'danger') {
                  addLogItem(sensor, status, '진동', value.toString());
                }

                return {
                  ...sensor,
                  value: value.toString(),
                  status: status,
                  data: [...sensor.data.slice(-29), newDataPoint],
                  detailedData: [
                    ...sensor.detailedData.slice(-299),
                    newDetailedDataPoint,
                  ],
                };
              }
              return sensor;
            })
          );

          setLastUpdateTime(lastUpdateTime); // 웹소켓 데이터의 last_update_time만 반영
        } catch (error) {
          console.error('❌ 진동 센서 데이터 처리 중 오류:', error);
        }
      }

      if (
        data?.mqtt_data?.topic_id?.startsWith('BASE/') &&
        data?.mqtt_data?.data?.barr
      ) {
        const vibrationValues = data.mqtt_data.data.barr
          .split(',')
          .slice(0, 9) // 진동센서 9개
          .map((val: string) => parseFloat(val));

        // 가스/화재감지기 신호 추출
        const gdet = data.mqtt_data.data.gdet;
        const fdet = data.mqtt_data.data.fdet;

        if (typeof gdet !== 'undefined') setGasStatus(gdet);
        if (typeof fdet !== 'undefined') setFireStatus(fdet);

        const gdetArr = Array.isArray(gdet)
          ? gdet
          : typeof gdet === 'string'
          ? gdet.split(',').map(Number)
          : [];

        setGasStatusArr(gdetArr);

        const fdetArr = Array.isArray(fdet)
          ? fdet
          : typeof fdet === 'string'
          ? fdet.split(',').map(Number)
          : typeof fdet === 'number'
          ? [fdet]
          : [];
        setFireStatusArr(fdetArr);
      }
    },
    [vibrationSensors]
  );

  useWebSocket(
    'wss://iwxu7qs5h3.execute-api.ap-northeast-2.amazonaws.com/dev',
    handleWebSocketMessage
  );

  const [selectedSensorType, setSelectedSensorType] = useState<
    'all' | 'gas' | 'fire' | 'vibration'
  >('all');
  const [selectedSensorId, setSelectedSensorId] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipSensor, setTooltipSensor] = useState<{
    id: string;
    name: string;
    status: '정상' | '경고' | '위험' | '--';
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
      type: '진동' | '가스' | '화재';
      status: 'warning' | 'danger';
      value?: string;
      unit?: string;
    }>
  >([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [refAreaLeft, setRefAreaLeft] = useState('');
  const [refAreaRight, setRefAreaRight] = useState('');
  const [zoomDomain, setZoomDomain] = useState<{
    x: [number, number];
    y: [number, number];
  } | null>(null);
  const [isZooming] = useState(true);
  const [aspectRatio] = useState(357 / 1920);
  const [mapHeight, setMapHeight] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  // 색상 세트를 랜덤하게 섞어서 배분
  const [colorAssignments] = useState<Record<string, ChartColorSet>>(() => {
    return vibrationSensors.reduce((acc, sensor, index) => {
      // 1-6번 차트는 #04A777
      if (index < 6) {
        acc[sensor.id.toString()] = {
          line: '#04A777',
          fill: '#04A777',
        };
      }
      // 7번(index 6)은 원래 #D90368 → #FB8B24로 변경
      else if (index === 6) {
        acc[sensor.id.toString()] = {
          line: '#FB8B24',
          fill: '#FB8B24',
        };
      }
      // 8번(index 7)은 #D90368 그대로
      else if (index === 7) {
        acc[sensor.id.toString()] = {
          line: '#D90368',
          fill: '#D90368',
        };
      }
      // 9번(index 8)은 원래 #FB8B24 → #D90368로 변경
      else {
        acc[sensor.id.toString()] = {
          line: '#D90368',
          fill: '#D90368',
        };
      }
      return acc;
    }, {} as Record<string, ChartColorSet>);
  });

  const formatTime = useCallback((date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }, []);

  const handleGraphClick = (sensor: VibrationSensor) => {
    setSelectedSensor(sensor);
    setIsDetailedGraphOpen(true);
  };

  const closeDetailedGraph = () => {
    setIsDetailedGraphOpen(false);
    setSelectedSensor(null);
  };

  // getSensorStatus를 useMemo 위로 이동
  const getSensorStatus = (
    sensorId: string
  ): 'normal' | 'warning' | 'danger' => {
    const type = sensorId.split('-')[0];
    if (type === 'vibration') {
      const sensorIndex = parseInt(sensorId.split('-')[1]) - 1;
      const sensor = vibrationSensors[sensorIndex];
      return (sensor?.status || 'normal') as 'normal' | 'warning' | 'danger';
    } else {
      // 가스, 화재 센서는 항상 'normal' 반환 (랜덤 danger 제거)
      return 'normal';
    }
  };

  const filteredSensors = useMemo(() => {
    let sensors: (GasSensor | FireSensor | VibrationSensor)[] = [];
    if (selectedSensorType === 'all') {
      sensors = [
        ...FACILITY_DETAIL.sensors.gas,
        ...FACILITY_DETAIL.sensors.fire,
        ...vibrationSensors,
      ];
    } else if (selectedSensorType === 'gas') {
      sensors = FACILITY_DETAIL.sensors.gas;
    } else if (selectedSensorType === 'fire') {
      sensors = FACILITY_DETAIL.sensors.fire;
    } else {
      sensors = vibrationSensors;
    }
    // 위험 센서가 최상단에 오도록 정렬
    return sensors.slice().sort((a, b) => {
      const aStatus = getSensorStatus(
        a.name.startsWith('가스감지기')
          ? `gas-${a.id}`
          : a.name.startsWith('화재감지기')
          ? `fire-${a.id - 15}`
          : a.name.startsWith('진동감지기')
          ? `vibration-${a.id - 21}`
          : ''
      );
      const bStatus = getSensorStatus(
        b.name.startsWith('가스감지기')
          ? `gas-${b.id}`
          : b.name.startsWith('화재감지기')
          ? `fire-${b.id - 15}`
          : b.name.startsWith('진동감지기')
          ? `vibration-${b.id - 21}`
          : ''
      );
      if (aStatus === 'danger' && bStatus !== 'danger') return -1;
      if (aStatus !== 'danger' && bStatus === 'danger') return 1;
      return 0;
    });
  }, [selectedSensorType, vibrationSensors, gasStatusArr, fireStatusArr]);

  const getSensorInfo = (sensorId: string) => {
    const type = sensorId.split('-')[0];
    if (type === 'vibration') {
      const sensorIndex = parseInt(sensorId.split('-')[1]) - 1;
      const sensor = vibrationSensors[sensorIndex];
      // 진동 신호 판정
      let signalText = '--';
      let realtimeValue = '--';
      if (
        sensor &&
        typeof sensor.value !== 'undefined' &&
        sensor.value !== null &&
        sensor.value !== ''
      ) {
        realtimeValue = sensor.value;
        const numValue = Number(sensor.value);
        if (!isNaN(numValue)) {
          if (numValue >= VIBRATION_DANGER_THRESHOLD) signalText = '위험';
          else signalText = '정상';
        }
      }
      return {
        name: sensor?.name || '',
        value: realtimeValue,
        status: signalText as '정상' | '경고' | '위험' | '--',
      };
    } else if (type === 'gas') {
      const idx = parseInt(sensorId.split('-')[1]) - 1;
      const value = gasStatusArr[idx];
      let signalText = '--';
      let realtimeValue = '--';
      if (typeof value === 'number') {
        realtimeValue = value.toString();
        signalText = value === 1 ? '위험' : value === 0 ? '정상' : '--';
      }
      return {
        name: FACILITY_DETAIL.sensors.gas[idx]?.name || '',
        value: realtimeValue,
        status: signalText as '정상' | '위험' | '--',
      };
    } else if (type === 'fire') {
      const idx = parseInt(sensorId.split('-')[1]) - 1;
      const value = fireStatusArr[idx];
      let signalText = '--';
      let realtimeValue = '--';
      if (typeof value === 'number') {
        realtimeValue = value.toString();
        signalText = value === 1 ? '위험' : value === 0 ? '정상' : '--';
      }
      return {
        name: FACILITY_DETAIL.sensors.fire[idx]?.name || '',
        value: realtimeValue,
        status: signalText as '정상' | '위험' | '--',
      };
    } else {
      return {
        name: '',
        value: '--',
        status: '--' as '정상' | '경고' | '위험' | '--',
      };
    }
  };

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

        const sensorInfo = getSensorInfo(sensorId);
        setTooltipSensor({
          id: sensorId,
          name: sensorInfo.name,
          status: sensorInfo.status,
          value: sensorInfo.value,
        });
      }
    }
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

  // 필터 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.filter-dropdown')) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 센서 타입별 개수 계산
  const sensorCounts = useMemo(() => {
    return {
      all: [...GAS_SENSORS, ...FIRE_SENSORS, ...VIBRATION_SENSORS].length,
      gas: GAS_SENSORS.length,
      fire: FIRE_SENSORS.length,
      vibration: VIBRATION_SENSORS.length,
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
      acc[sensor.id.toString()] = Math.random() * 1.5;
      return acc;
    }, {} as Record<string, number>);
    setAnimationDelays(delays);
  }, []);

  // 로그 아이템 추가 함수
  const addLogItem = useCallback(
    (
      sensor: any,
      status: 'warning' | 'danger',
      type: '진동' | '가스' | '화재',
      value: string
    ) => {
      const now = new Date();
      const time = formatTime(now);
      setLogItems((prev) => [
        {
          time,
          sensorName: sensor.name,
          type,
          status,
          value,
        },
        ...prev,
      ]);
    },
    [formatTime]
  );

  const options = {
    chart: {
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    yaxis: {
      min: 0,
      max: Math.max(
        ...vibrationSensors.map((s) => Math.max(...s.data.map((d) => d.value)))
      ),
    },
  };

  const handleMouseDown = (e: any) => {
    if (!e || !isZooming || !selectedSensor) return;
    setRefAreaLeft(e.activeLabel);
  };

  const handleMouseMove = (e: any) => {
    if (!e || !isZooming || !selectedSensor) return;
    if (refAreaLeft) {
      setRefAreaRight(e.activeLabel);
    }
  };

  const handleMouseUp = () => {
    if (!refAreaLeft || !refAreaRight || !isZooming || !selectedSensor) return;

    const leftIndex = selectedSensor.detailedData.findIndex(
      (d) => d.timestamp === Number(refAreaLeft)
    );
    const rightIndex = selectedSensor.detailedData.findIndex(
      (d) => d.timestamp === Number(refAreaRight)
    );

    if (Math.abs(leftIndex - rightIndex) < 5) {
      setRefAreaLeft('');
      setRefAreaRight('');
      return;
    }

    let [left, right] = [Number(refAreaLeft), Number(refAreaRight)].sort();
    const dataPoints = selectedSensor.detailedData.filter(
      (d) => d.timestamp >= left && d.timestamp <= right
    );

    if (dataPoints.length > 0) {
      const yMin = Math.min(...dataPoints.map((d) => d.value));
      const yMax = Math.max(...dataPoints.map((d) => d.value));

      setZoomDomain({
        x: [left, right] as [number, number],
        y: [Math.max(0, yMin - 0.1), Math.min(2, yMax + 0.1)] as [
          number,
          number
        ],
      });
    }

    setRefAreaLeft('');
    setRefAreaRight('');
  };

  useEffect(() => {
    const handleWheelEvent = (e: WheelEvent) => {
      if (!isDetailedGraphOpen || !selectedSensor || !isZooming) return;

      e.preventDefault();

      // 휠 위로(업) = 줌인, 휠 아래로(다운) = 줌아웃
      const isZoomIn = e.deltaY < 0;

      if (!zoomDomain) {
        const dataPoints = selectedSensor.detailedData;
        const initialDomain = {
          x: [
            dataPoints[0].timestamp,
            dataPoints[dataPoints.length - 1].timestamp,
          ] as [number, number],
          y: [0, 2] as [number, number],
        };
        setZoomDomain(initialDomain);
        return;
      }

      // x축 줌만 동작
      const dataPoints = selectedSensor.detailedData;
      const currentStartIdx = dataPoints.findIndex(
        (d) => d.timestamp === Number(zoomDomain.x[0])
      );
      const currentEndIdx = dataPoints.findIndex(
        (d) => d.timestamp === Number(zoomDomain.x[1])
      );

      if (currentStartIdx !== -1 && currentEndIdx !== -1) {
        const currentRange = currentEndIdx - currentStartIdx;
        // 휠 업(줌인): 0.8, 휠 다운(줌아웃): 1.2
        const zoomFactor = isZoomIn ? 0.8 : 1.2;
        const newRange = Math.round(currentRange * zoomFactor);

        const centerIdx = Math.round((currentStartIdx + currentEndIdx) / 2);
        const newStartIdx = Math.max(0, centerIdx - Math.round(newRange / 2));
        const newEndIdx = Math.min(
          dataPoints.length - 1,
          centerIdx + Math.round(newRange / 2)
        );

        if (newStartIdx >= 0 && newEndIdx < dataPoints.length) {
          const newDomain = {
            ...zoomDomain,
            x: [
              dataPoints[newStartIdx].timestamp,
              dataPoints[newEndIdx].timestamp,
            ] as [number, number],
          };
          setZoomDomain(newDomain);
        }
      }
    };

    const graphContainer = document.querySelector('.detailed-graph-container');
    if (graphContainer) {
      graphContainer.addEventListener(
        'wheel',
        handleWheelEvent as EventListener,
        { passive: false }
      );
    }

    return () => {
      if (graphContainer) {
        graphContainer.removeEventListener(
          'wheel',
          handleWheelEvent as EventListener
        );
      }
    };
  }, [isDetailedGraphOpen, selectedSensor, zoomDomain, isZooming]);

  // 줌 초기화 함수 수정
  const resetZoom = useCallback(() => {
    if (!selectedSensor) return;

    const dataPoints = selectedSensor.detailedData;
    if (dataPoints.length === 0) return;

    // Y축 범위를 데이터의 최소/최대값 기준으로 설정
    const values = dataPoints.map((d) => d.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const padding = (maxValue - minValue) * 0.1; // 10% 여유 공간

    setZoomDomain({
      x: [
        dataPoints[0].timestamp,
        dataPoints[dataPoints.length - 1].timestamp,
      ] as [number, number],
      y: [Math.max(0, minValue - padding), maxValue + padding] as [
        number,
        number
      ],
    });
  }, [selectedSensor]);

  // 상세 그래프가 열릴 때 초기 줌 도메인 설정
  useEffect(() => {
    if (isDetailedGraphOpen && selectedSensor) {
      resetZoom();
    }
  }, [isDetailedGraphOpen, selectedSensor, resetZoom]);

  // 팝업 하단 통계 계산 수정
  const graphStats = useMemo(() => {
    if (!selectedSensor?.detailedData?.length) {
      return {
        fromTime: '-',
        toTime: '-',
        maxValue: '-',
        minValue: '-',
        avgValue: '-',
      };
    }

    const data = selectedSensor.detailedData;
    const values = data.map((d) => d.value);

    return {
      fromTime: data[0]?.time || '-',
      toTime: data[data.length - 1]?.time || '-',
      maxValue: Math.max(...values).toFixed(0),
      minValue: Math.min(...values).toFixed(0),
      avgValue: (values.reduce((a, b) => a + b, 0) / values.length).toFixed(0),
    };
  }, [selectedSensor]);

  const handleSensorListItemClick = (
    sensor: GasSensor | FireSensor | VibrationSensor
  ) => {
    // 센서 ID 형식 변환 (예: 1 -> 'gas-1')
    let sensorType = '';
    if (sensor.id <= 15) sensorType = 'gas';
    else if (sensor.id <= 21) sensorType = 'fire';
    else sensorType = 'vibration';

    const sensorId = `${sensorType}-${
      sensor.id <= 15
        ? sensor.id
        : sensor.id <= 21
        ? sensor.id - 15
        : sensor.id - 21
    }`;

    // 센서 아이콘의 위치 찾기
    const sensorIcon = document.querySelector(`[data-sensor-id="${sensorId}"]`);
    const mapContainer = document.querySelector('.map-container');

    if (sensorIcon && mapContainer) {
      const rect = sensorIcon.getBoundingClientRect();
      const mapRect = mapContainer.getBoundingClientRect();

      const x = rect.left - mapRect.left + rect.width / 2;
      const y = rect.top - mapRect.top;

      setTooltipPosition({ x, y });
      setSelectedSensorId(sensorId);
      setShowTooltip(true);

      const sensorInfo = getSensorInfo(sensorId);
      setTooltipSensor({
        id: sensorId,
        name: sensorInfo.name,
        status: sensorInfo.status,
        value: sensorInfo.value,
      });

      // 아이콘이 보이도록 스크롤
      sensorIcon.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // CSV 다운로드 함수
  function handleDownloadCsv() {
    if (!selectedSensor?.detailedData?.length) return;
    const header = 'time,timestamp,value\n';
    const rows = selectedSensor.detailedData
      .map((d) => `${d.time},${d.timestamp},${d.value}`)
      .join('\n');
    const csv = header + rows;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedSensor.name}_상세그래프.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // 모바일 여부
  const isMobile = useMediaQuery('(max-width: 768px)');

  // 상세그래프 AreaChart에 넘길 데이터 가공: 데이터가 1개면 가짜 점 추가
  const chartData = useMemo(() => {
    if (!selectedSensor?.detailedData) return [];
    const data = selectedSensor.detailedData;
    if (data.length === 1) {
      // 데이터가 1개면 1초 뒤 같은 값으로 한 점 추가
      return [data[0], { ...data[0], timestamp: data[0].timestamp + 1000 }];
    }
    return data;
  }, [selectedSensor]);

  // 위험 센서가 하나라도 있는지 체크
  const hasDanger = useMemo(() => {
    return filteredSensors.some((sensor) => {
      const status = signalTextForSensor(sensor);
      return status === '위험';
    });
  }, [filteredSensors]);

  // 센서별 signalText 계산 함수(중복 로직 함수화)
  function signalTextForSensor(sensor: any) {
    let signalText = '--';
    let gIdx, fIdx;
    if (sensor.name.startsWith('가스감지기')) {
      gIdx = parseInt(sensor.name.replace('가스감지기', '')) - 1;
      if (typeof gasStatusArr[gIdx] === 'number') {
        signalText =
          gasStatusArr[gIdx] === 1
            ? '위험'
            : gasStatusArr[gIdx] === 0
            ? '정상'
            : '--';
      }
    } else if (sensor.name.startsWith('화재감지기')) {
      fIdx = parseInt(sensor.name.replace('화재감지기', '')) - 1;
      if (typeof fireStatusArr[fIdx] === 'number') {
        signalText =
          fireStatusArr[fIdx] === 1
            ? '위험'
            : fireStatusArr[fIdx] === 0
            ? '정상'
            : '--';
      }
    } else if (sensor.name.includes('진동')) {
      if (
        typeof sensor.value !== 'undefined' &&
        sensor.value !== null &&
        sensor.value !== ''
      ) {
        const numValue = Number(sensor.value);
        if (!isNaN(numValue)) {
          signalText = numValue >= VIBRATION_DANGER_THRESHOLD ? '위험' : '정상';
        }
      }
    }
    return signalText;
  }

  // 삼척 수소충전소(id=2)는 빈 페이지(준비중)로 분기
  if (params.id === '2') {
    return (
      <div
        style={{
          width: '100%',
          minHeight: '600px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24,
          color: '#888',
        }}
      >
        <div>삼척 수소충전소 상세페이지는 준비중입니다.</div>
      </div>
    );
  }

  // 위험상황일 때 danger 센서 id 배열 구하기
  const dangerSensorIds = filteredSensorIcons
    .filter((sensor) => getSensorStatus(sensor.id) === 'danger')
    .map((sensor) => sensor.id);

  const [showAlarmPermission, setShowAlarmPermission] = useState(true);
  const [alarmAllowed, setAlarmAllowed] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // 위험상황 감지 useEffect
  useEffect(() => {
    if (alarmAllowed && hasDanger && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [hasDanger, alarmAllowed]);

  return (
    <div>
      {/* 경보음 듣기 허용 팝업 */}
      {showAlarmPermission && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.45)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 16,
              padding: '36px 32px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
              textAlign: 'center',
              minWidth: 320,
            }}
          >
            <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>
              경보음 듣기 허용
            </div>
            <div style={{ fontSize: 16, color: '#555', marginBottom: 28 }}>
              위험상황 발생 시 경보음을 자동으로 들으시겠습니까?
            </div>
            <button
              style={{
                background: '#ef4444',
                color: '#fff',
                fontWeight: 600,
                fontSize: 16,
                border: 'none',
                borderRadius: 8,
                padding: '12px 32px',
                cursor: 'pointer',
              }}
              onClick={() => {
                setAlarmAllowed(true);
                setShowAlarmPermission(false);
              }}
            >
              허용
            </button>
          </div>
        </div>
      )}
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
          {!isMobile && (
            <MainMenu>
              <ThemeToggleButton />
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
              <Link
                href={`/monitoring/detail/${params.id}/tube-trailer`}
                passHref
                legacyBehavior
              >
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
          )}
        </GNB>
      </TopBanner>

      <ContentSection>
        <MapSection>
          <LeftColumn>
            <MapView
              className={hasDanger ? 'danger' : ''}
              style={{ height: isMounted ? `${mapHeight}px` : 'auto' }}
            >
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
                  {filteredSensorIcons.map((sensor) => {
                    const isDanger = getSensorStatus(sensor.id) === 'danger';
                    const isDimmed = dangerSensorIds.length > 0 && !isDanger;
                    // 센서별 위치 정보
                    const { x, y } = sensor;
                    return (
                      <g
                        key={sensor.id}
                        data-type={sensor.id.split('-')[0]}
                        data-sensor-id={sensor.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSensorClick(sensor.id, e);
                        }}
                        className={`sensor-icon${isDanger ? ' danger' : ''}${
                          isDimmed ? ' dimmed' : ''
                        }`}
                        style={{ cursor: 'pointer' }}
                        transform={`translate(${x},${y})`}
                      >
                        <image
                          href={`/images/monitoring/detail/${
                            sensor.id.split('-')[0]
                          }_box.svg`}
                          width="60"
                          height="60"
                          x={-30}
                          y={-30}
                        />
                      </g>
                    );
                  })}
                </svg>
                {/* 툴팁 등은 svg 바깥에서 렌더링 */}
                {showTooltip && tooltipSensor && (
                  <SensorTooltip
                    status={
                      tooltipSensor.status === '정상'
                        ? 'normal'
                        : tooltipSensor.status === '경고'
                        ? 'warning'
                        : tooltipSensor.status === '위험'
                        ? 'danger'
                        : 'normal'
                    }
                    style={{
                      position: 'absolute',
                      left: `${tooltipPosition.x}px`,
                      top: `${tooltipPosition.y}px`,
                      transform: 'translate(-50%, -100%)',
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="tooltip-header">
                      <div className="status-indicator" />
                      <span className="name">{tooltipSensor.name}</span>
                      <span className="status-text">
                        {tooltipSensor.status}
                      </span>
                    </div>
                    <div className="tooltip-content">
                      <div className="info-row" data-role="value">
                        <span className="label">데이터</span>
                        <span className="value">{tooltipSensor.value}</span>
                      </div>
                      <div className="info-row" data-role="status">
                        <span className="label">상태</span>
                        <span className="value">
                          {tooltipSensor.status === '정상' ||
                          tooltipSensor.status === '경고' ||
                          tooltipSensor.status === '위험'
                            ? '연결됨'
                            : '연결안됨'}
                        </span>
                      </div>
                      <div className="info-row" data-role="updated">
                        <span className="label">업데이트</span>
                        <span className="value">
                          {lastUpdateTime
                            ? (() => {
                                const d = new Date(lastUpdateTime);
                                if (isNaN(d.getTime())) return lastUpdateTime;
                                const MM = String(d.getMonth() + 1).padStart(
                                  2,
                                  '0'
                                );
                                const DD = String(d.getDate()).padStart(2, '0');
                                const hh = String(d.getHours()).padStart(
                                  2,
                                  '0'
                                );
                                const mm = String(d.getMinutes()).padStart(
                                  2,
                                  '0'
                                );
                                const ss = String(d.getSeconds()).padStart(
                                  2,
                                  '0'
                                );
                                return `${MM}/${DD} ${hh}:${mm}:${ss}`;
                              })()
                            : ''}
                        </span>
                      </div>
                    </div>
                  </SensorTooltip>
                )}
              </MapContainer>
            </MapView>
            <SensorCard>
              <ListHeader>
                <span>번호</span>
                <span>종류</span>
                <span>연결상태</span>
                <span>신호</span>
                <span>데이터</span>
                <FilterDropdown className="filter-dropdown">
                  <FilterButton
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    isOpen={isFilterOpen}
                  >
                    필터
                    <ChevronDown />
                  </FilterButton>
                  <FilterMenu isOpen={isFilterOpen}>
                    <FilterMenuItem
                      $active={selectedSensorType === 'all'}
                      onClick={() => {
                        setSelectedSensorType('all');
                        setIsFilterOpen(false);
                      }}
                    >
                      전체
                      <span className="count">{sensorCounts.all}</span>
                    </FilterMenuItem>
                    <FilterMenuItem
                      $active={selectedSensorType === 'gas'}
                      onClick={() => {
                        setSelectedSensorType('gas');
                        setIsFilterOpen(false);
                      }}
                    >
                      가스 센서
                      <span className="count">{sensorCounts.gas}</span>
                    </FilterMenuItem>
                    <FilterMenuItem
                      $active={selectedSensorType === 'fire'}
                      onClick={() => {
                        setSelectedSensorType('fire');
                        setIsFilterOpen(false);
                      }}
                    >
                      화재 센서
                      <span className="count">{sensorCounts.fire}</span>
                    </FilterMenuItem>
                    <FilterMenuItem
                      $active={selectedSensorType === 'vibration'}
                      onClick={() => {
                        setSelectedSensorType('vibration');
                        setIsFilterOpen(false);
                      }}
                    >
                      진동 센서
                      <span className="count">{sensorCounts.vibration}</span>
                    </FilterMenuItem>
                  </FilterMenu>
                </FilterDropdown>
              </ListHeader>
              <SensorList>
                {filteredSensors.map((sensor, index) => {
                  let realtimeValue = '--';
                  let signalText = '--';
                  let connectionText = '연결안됨';
                  let gIdx: number | undefined;
                  let fIdx: number | undefined;
                  if (sensor.name.startsWith('진동감지기')) {
                    const vIdx =
                      parseInt(sensor.name.replace('진동감지기', '')) - 1;
                    if (
                      vibrationSensors[vIdx] &&
                      vibrationSensors[vIdx].value !== undefined &&
                      vibrationSensors[vIdx].value !== null &&
                      vibrationSensors[vIdx].value !== ''
                    ) {
                      connectionText = '연결됨';
                    }
                  } else if (sensor.name.startsWith('가스감지기')) {
                    gIdx = parseInt(sensor.name.replace('가스감지기', '')) - 1;
                    if (typeof gasStatusArr[gIdx] === 'number') {
                      connectionText = '연결됨';
                    }
                  } else if (sensor.name.startsWith('화재감지기')) {
                    fIdx = parseInt(sensor.name.replace('화재감지기', '')) - 1;
                    if (typeof fireStatusArr[fIdx] === 'number') {
                      connectionText = '연결됨';
                    }
                  }
                  if (sensor.name.startsWith('가스감지기')) {
                    const idx =
                      gIdx !== undefined
                        ? gIdx
                        : parseInt(sensor.name.replace('가스감지기', '')) - 1;
                    if (typeof gasStatusArr[idx] === 'number') {
                      realtimeValue = gasStatusArr[idx].toString();
                      signalText =
                        gasStatusArr[idx] === 1
                          ? '위험'
                          : gasStatusArr[idx] === 0
                          ? '정상'
                          : '--';
                    }
                  } else if (sensor.name.startsWith('화재감지기')) {
                    const idx =
                      fIdx !== undefined
                        ? fIdx
                        : parseInt(sensor.name.replace('화재감지기', '')) - 1;
                    if (typeof fireStatusArr[idx] === 'number') {
                      realtimeValue = fireStatusArr[idx].toString();
                      signalText =
                        fireStatusArr[idx] === 1
                          ? '위험'
                          : fireStatusArr[idx] === 0
                          ? '정상'
                          : '--';
                    }
                  } else if (sensor.name.includes('진동')) {
                    if (
                      typeof sensor.value !== 'undefined' &&
                      sensor.value !== null &&
                      sensor.value !== ''
                    ) {
                      realtimeValue = sensor.value;
                      const numValue = Number(sensor.value);
                      if (!isNaN(numValue)) {
                        if (numValue >= VIBRATION_DANGER_THRESHOLD)
                          signalText = '위험';
                        else signalText = '정상';
                      }
                    } else {
                      realtimeValue = '--';
                    }
                  }
                  return (
                    <SensorItem
                      key={sensor.id}
                      onClick={() => handleSensorListItemClick(sensor)}
                      style={{ cursor: 'pointer' }}
                      className={(() => {
                        const status = getSensorStatus(
                          sensor.name.startsWith('가스감지기')
                            ? `gas-${sensor.id}`
                            : sensor.name.startsWith('화재감지기')
                            ? `fire-${sensor.id - 15}`
                            : sensor.name.startsWith('진동감지기')
                            ? `vibration-${sensor.id - 21}`
                            : ''
                        );
                        return status === 'danger' ? 'danger' : '';
                      })()}
                    >
                      <SensorNo>{index + 1}</SensorNo>
                      <SensorType>
                        <span
                          className="sensor-name"
                          style={{
                            color: sensor.name.startsWith('가스감지기')
                              ? '#04A777'
                              : sensor.name.startsWith('화재감지기')
                              ? '#D90368'
                              : sensor.name.startsWith('진동감지기')
                              ? '#FB8B24'
                              : undefined,
                            fontWeight: 700,
                          }}
                        >
                          {sensor.name}
                        </span>
                      </SensorType>
                      <SensorConnection>{connectionText}</SensorConnection>
                      <SensorStatus
                        status={signalText === '위험' ? 'danger' : 'normal'}
                      >
                        {signalText}
                      </SensorStatus>
                      <SensorValue
                        status={signalText === '위험' ? 'danger' : 'normal'}
                        style={{ textAlign: 'center', width: '100%' }}
                      >
                        {realtimeValue}
                      </SensorValue>
                      <span></span>
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
                style={{ cursor: 'pointer', position: 'relative' }}
              >
                <h4
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    height: 40,
                  }}
                >
                  <span style={{ fontWeight: 700 }}>{sensor.name}</span>
                  <span
                    style={{
                      fontWeight: 700,
                      color: colorAssignments[sensor.id.toString()].line,
                      fontSize: '1.1em',
                      lineHeight: 1,
                      textAlign: 'center',
                      flex: 1,
                      marginLeft: 4,
                    }}
                  >
                    {sensor.data.length > 0
                      ? sensor.data[sensor.data.length - 1].value
                      : '--'}
                  </span>
                  <span className="status">정상</span>
                </h4>
                <div
                  className="graph-container"
                  style={{ borderTop: '1px solid #e0e7ef' }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={sensor.data}
                      margin={{
                        top: 5,
                        right: 10,
                        left: -20,
                        bottom: 0,
                      }}
                    >
                      <defs>
                        <linearGradient
                          id={`gradient-${sensor.id}`}
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor={
                              colorAssignments[sensor.id.toString()].line
                            }
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor={
                              colorAssignments[sensor.id.toString()].line
                            }
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke={colors.chart.grid.line}
                        opacity={colors.chart.grid.opacity}
                      />
                      <XAxis
                        dataKey="time"
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={{ stroke: colors.chart.axis.line }}
                      />
                      <YAxis
                        domain={[
                          0,
                          Math.max(...sensor.data.map((d) => d.value)),
                        ]}
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={{ stroke: colors.chart.axis.line }}
                        tickFormatter={(value) => value.toFixed(0)}
                      />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (
                            active &&
                            payload &&
                            payload.length &&
                            payload[0].value !== undefined
                          ) {
                            return (
                              <CustomTooltip>
                                <div className="time">{label}</div>
                                <div className="value">
                                  {parseInt(payload[0].value as any)}
                                </div>
                              </CustomTooltip>
                            );
                          }
                          return null;
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke={colorAssignments[sensor.id.toString()].line}
                        strokeWidth={2}
                        fill={`url(#gradient-${sensor.id})`}
                        fillOpacity={1}
                        isAnimationActive={false}
                      />
                    </AreaChart>
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
              <h2>{selectedSensor.name} 상세 그래프</h2>
              <div className="button-group">
                <PopupButton onClick={handleDownloadCsv}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <path
                      d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16"
                      stroke="#2563eb"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  다운로드
                </PopupButton>
                {zoomDomain && (
                  <PopupButton onClick={resetZoom}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z"
                        clipRule="evenodd"
                      />
                    </svg>
                    초기화
                  </PopupButton>
                )}
                <CloseButton onClick={closeDetailedGraph}>&times;</CloseButton>
              </div>
            </PopupHeader>
            <DetailedGraphContainer className="detailed-graph-container">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                >
                  <defs>
                    <linearGradient
                      id={`gradient-detailed`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={
                          colorAssignments[selectedSensor.id.toString()].line
                        }
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor={
                          colorAssignments[selectedSensor.id.toString()].line
                        }
                        stopOpacity={0}
                      />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <filter id="areaGlow">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feFlood
                        floodColor={
                          colorAssignments[selectedSensor.id.toString()].line
                        }
                        floodOpacity="0.2"
                      />
                      <feComposite in2="blur" operator="in" />
                      <feMerge>
                        <feMergeNode />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="rgba(255, 255, 255, 0.1)"
                    opacity={0.5}
                  />
                  <XAxis
                    dataKey="timestamp"
                    type="number"
                    domain={zoomDomain?.x || ['dataMin', 'dataMax']}
                    allowDataOverflow
                    tickFormatter={(unixTime) => {
                      const date = new Date(unixTime);
                      return date.toLocaleTimeString('ko-KR', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false,
                      });
                    }}
                    stroke="rgba(255, 255, 255, 0.5)"
                    interval="preserveStartEnd"
                    minTickGap={50}
                  />
                  <YAxis
                    domain={
                      zoomDomain?.y ||
                      (() => {
                        const values = selectedSensor.detailedData.map(
                          (d) => d.value
                        );
                        if (values.length === 0) return [0, 1];
                        const min = Math.min(...values);
                        const max = Math.max(...values);
                        if (min === max) {
                          // 값이 모두 같으면 위아래로 1씩 여유
                          return [min - 1, max + 1];
                        }
                        return [min, max];
                      })()
                    }
                    allowDataOverflow
                    tickFormatter={(value) => value.toFixed(0)}
                    stroke="rgba(255, 255, 255, 0.5)"
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (
                        active &&
                        payload &&
                        payload.length &&
                        payload[0].value !== undefined
                      ) {
                        const date = new Date(label);
                        return (
                          <CustomTooltip>
                            <div className="time">
                              {date.toLocaleTimeString('ko-KR', {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: false,
                              })}
                            </div>
                            <div className="value">
                              {parseInt(payload[0].value as any)}
                            </div>
                          </CustomTooltip>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={colorAssignments[selectedSensor.id.toString()].line}
                    strokeWidth={3}
                    fill="url(#gradient-detailed)"
                    fillOpacity={1}
                    isAnimationActive={false}
                    dot={true}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    style={{
                      filter: 'url(#areaGlow)',
                    }}
                  />
                  {isZooming && refAreaLeft && refAreaRight && (
                    <ReferenceArea
                      x1={refAreaLeft}
                      x2={refAreaRight}
                      strokeOpacity={0.3}
                      fill={colorAssignments[selectedSensor.id.toString()].line}
                      fillOpacity={0.1}
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </DetailedGraphContainer>
            <GraphStatsBar>
              <span className="stat">From: {graphStats.fromTime}</span>
              <span className="stat">To: {graphStats.toTime}</span>
              <span className="stat">최대: {graphStats.maxValue}</span>
              <span className="stat">최소: {graphStats.minValue}</span>
              <span className="stat">평균: {graphStats.avgValue}</span>
              <span className="legend">
                <span className="dot normal" /> 정상
                <span className="dot danger" /> 위험 (500 이상)
              </span>
            </GraphStatsBar>
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
              <span className="content">{item.sensorName}</span>
              <span className="status">
                {item.status === 'warning' ? '경고' : '위험'}
              </span>
              {item.value !== undefined && (
                <span className="value">{item.value}</span>
              )}
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

      {/* 경보음 */}
      <audio ref={audioRef} src="/alarm.mp3" loop style={{ display: 'none' }} />
    </div>
  );
}
