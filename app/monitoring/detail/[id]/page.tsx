'use client';
import useWebSocket from '@/hooks/useWebSocket'; // ← 추가
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback, useMemo } from 'react';
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
  timestamp: number;
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
  { id: 'gas-1', x: 128, y: 80, name: '가스감지기1' },
  { id: 'gas-2', x: 263, y: 88, name: '가스감지기2' },
  { id: 'gas-3', x: 333, y: 88, name: '가스감지기3' },
  { id: 'gas-4', x: 263, y: 253, name: '가스감지기4' },
  { id: 'gas-5', x: 333, y: 253, name: '가스감지기5' },
  { id: 'gas-6', x: 448, y: 253, name: '가스감지기6' },
  { id: 'gas-7', x: 448, y: 88, name: '가스감지기7' },
  { id: 'gas-8', x: 522, y: 93, name: '가스감지기8' },
  { id: 'gas-9', x: 522, y: 233, name: '가스감지기9' },
  { id: 'gas-10', x: 559, y: 108, name: '가스감지기10' },
  { id: 'gas-11', x: 559, y: 220, name: '가스감지기11' },
  { id: 'gas-12', x: 612, y: 163, name: '가스감지기12' },
  { id: 'gas-13', x: 662, y: 163, name: '가스감지기13' },
  { id: 'gas-14', x: 328, y: 334, name: '가스감지기14' },
  { id: 'gas-15', x: 458, y: 334, name: '가스감지기15' },
];

// 화재 감지기 정보 배열
const FIRE_SENSORS = [
  { id: 'fire-1', x: 210, y: 263, name: '화재감지기1' },
  { id: 'fire-2', x: 210, y: 375, name: '화재감지기2' },
  { id: 'fire-3', x: 485, y: 263, name: '화재감지기3' },
  { id: 'fire-4', x: 575, y: 249, name: '화재감지기4' },
  { id: 'fire-5', x: 485, y: 76, name: '화재감지기5' },
  { id: 'fire-6', x: 602, y: 76, name: '화재감지기6' },
];

// 진동 감지기 정보 배열
const VIBRATION_SENSORS = [
  { id: 'vibration-1', x: 260, y: 303, name: '진동감지기1' },
  { id: 'vibration-2', x: 277, y: 360, name: '진동감지기2' },
  { id: 'vibration-3', x: 295, y: 303, name: '진동감지기3' },
  { id: 'vibration-4', x: 390, y: 303, name: '진동감지기4' },
  { id: 'vibration-5', x: 407, y: 360, name: '진동감지기5' },
  { id: 'vibration-6', x: 427, y: 303, name: '진동감지기6' },
  { id: 'vibration-7', x: 523, y: 118, name: '진동감지기7' },
  { id: 'vibration-8', x: 523, y: 193, name: '진동감지기8' },
  { id: 'vibration-9', x: 559, y: 133, name: '진동감지기9' },
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
        unit: '',
        data: [],
        detailedData: [],
      }))
  );
  useWebSocket(
    'wss://iwxu7qs5h3.execute-api.ap-northeast-2.amazonaws.com/dev',
    (data) => {
      console.log(
        '📡 수신된 전체 WebSocket 데이터:',
        JSON.stringify(data, null, 2)
      );

      // BASE/P001 토픽 데이터만 처리
      if (data?.mqtt_data?.topic_id === 'BASE/P001') {
        try {
          // barr 데이터 파싱
          const barrString = data.mqtt_data.data.barr;
          if (!barrString) return;

          const barrValues = barrString
            .split(',')
            .slice(0, 9) // 앞 9개 값만 사용
            .map((value: string) => parseInt(value)); // 정수로 변환

          if (barrValues.length !== 9) return; // 9개가 아니면 무시

          console.log('🌟 BASE/P001 진동 데이터:', barrValues);

          const now = new Date();
          const timeStr = now.toTimeString().split(' ')[0];

          // 진동 센서 데이터 업데이트
          setVibrationSensors((prevSensors) =>
            prevSensors.map((sensor, index) => {
              if (index < 9) {
                const value = barrValues[index];

                // 새로운 데이터 포인트 생성
                const newDataPoint: VibrationDataPoint = {
                  time: timeStr,
                  value: value,
                };

                const newDetailedDataPoint: DetailedVibrationDataPoint = {
                  time: timeStr,
                  timestamp: now.getTime(),
                  value: value,
                };

                // 상태 결정 (500 기준)
                const status = value >= 500 ? 'danger' : 'normal';

                // 위험 상태일 때만 로그 추가
                if (status === 'danger') {
                  setLogItems((prevLogs) => [
                    {
                      time: timeStr,
                      sensorName: sensor.name,
                      status: status,
                      value: value.toString(), // 정수로 표시
                      unit: '', // 단위 제거
                    },
                    ...prevLogs,
                  ]);
                }

                return {
                  ...sensor,
                  value: value.toString(), // 정수로 표시
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

          // 마지막 업데이트 시간 갱신
          setLastUpdateTime(new Date().toLocaleTimeString());
        } catch (error) {
          console.error('진동 센서 데이터 처리 중 오류:', error);
        }
      }
    }
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
  const [colorAssignments] = useState<Record<number, ChartColorSet>>(() => {
    return vibrationSensors.reduce((acc, sensor, index) => {
      // 1-6번 차트는 #04A777
      if (index < 6) {
        acc[sensor.id] = {
          line: '#04A777',
          fill: '#04A777',
        };
      }
      // 7-8번 차트는 #D90368
      else if (index < 8) {
        acc[sensor.id] = {
          line: '#D90368',
          fill: '#D90368',
        };
      }
      // 9번 차트는 #FB8B24
      else {
        acc[sensor.id] = {
          line: '#FB8B24',
          fill: '#FB8B24',
        };
      }
      return acc;
    }, {} as Record<number, ChartColorSet>);
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

  const getSensorInfo = (sensorId: string) => {
    const type = sensorId.split('-')[0];
    if (type === 'vibration') {
      const sensorIndex = parseInt(sensorId.split('-')[1]) - 1;
      const sensor = vibrationSensors[sensorIndex];
      return {
        name: sensor?.name || '',
        value: sensor?.value || '0',
        unit: '',
        status: (sensor?.status || 'normal') as 'normal' | 'warning' | 'danger',
      };
    } else {
      return {
        name:
          FACILITY_DETAIL.sensors[type as 'gas' | 'fire'].find(
            (s) => s.id.toString() === sensorId.split('-')[1]
          )?.name || '',
        value: '--',
        unit: '--',
        status: 'normal' as const,
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
          unit: sensorInfo.unit,
        });
      }
    }
  };

  const getSensorStatus = (
    sensorId: string
  ): 'normal' | 'warning' | 'danger' => {
    const type = sensorId.split('-')[0];
    if (type === 'vibration') {
      const sensorIndex = parseInt(sensorId.split('-')[1]) - 1;
      const sensor = vibrationSensors[sensorIndex];
      return (sensor?.status || 'normal') as 'normal' | 'warning' | 'danger';
    } else {
      // 가스, 화재 센서는 기존 로직 유지
      return Math.random() < 0.5 ? 'normal' : 'danger';
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
    yaxis: {
      min: 0,
      max: 1000, // Y축 범위를 0-1000으로 조정
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
    setZoomDomain({
      x: [
        dataPoints[0].timestamp,
        dataPoints[dataPoints.length - 1].timestamp,
      ] as [number, number],
      y: [0, 2] as [number, number],
    });
  }, [selectedSensor]);

  // 상세 그래프가 열릴 때 초기 줌 도메인 설정
  useEffect(() => {
    if (isDetailedGraphOpen && selectedSensor) {
      resetZoom();
    }
  }, [isDetailedGraphOpen, selectedSensor, resetZoom]);

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

      setTooltipSensor({
        id: sensorId,
        name: sensor.name,
        status: getSensorStatus(sensorId),
        value: sensor.value || '--',
        unit: sensor.unit || '--',
      });

      // 아이콘이 보이도록 스크롤
      sensorIcon.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // 팝업 하단 통계 계산 및 다운로드 함수 추가
  const fromTime = selectedSensor?.detailedData?.[0]?.time || '-';
  const toTime =
    selectedSensor?.detailedData?.[selectedSensor.detailedData.length - 1]
      ?.time || '-';
  const values = selectedSensor?.detailedData?.map((d) => d.value) || [];
  const maxValue = values.length ? Math.max(...values).toFixed(2) : '-';
  const minValue = values.length ? Math.min(...values).toFixed(2) : '-';
  const avgValue = values.length
    ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2)
    : '-';

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

  return (
    <div>
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
            <MapView style={{ height: isMounted ? `${mapHeight}px` : 'auto' }}>
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
                      data-sensor-id={sensor.id}
                      transform={`translate(${sensor.x}, ${sensor.y})`}
                      onClick={(e) => {
                        e.stopPropagation();
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
                        {tooltipSensor.id.split('-')[0] === 'vibration'
                          ? tooltipSensor.status === 'normal'
                            ? '정상'
                            : tooltipSensor.status === 'warning'
                            ? '경고'
                            : '위험'
                          : tooltipSensor.status === 'normal'
                          ? '정상'
                          : '위험'}
                      </span>
                    </div>
                    <div className="tooltip-content">
                      <div className="info-row" data-role="value">
                        <span className="label">데이터</span>
                        <span className="value">
                          {tooltipSensor.value} {tooltipSensor.unit}
                        </span>
                      </div>
                      <div className="info-row" data-role="status">
                        <span className="label">상태</span>
                        <span className="value">연결됨</span>
                      </div>
                      <div className="info-row" data-role="updated">
                        <span className="label">업데이트</span>
                        <span className="value">{lastUpdateTime}</span>
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
                  const shortName = sensor.name.replace(/감지기(\d+)$/, '#$1');
                  return (
                    <SensorItem
                      key={sensor.id}
                      onClick={() => handleSensorListItemClick(sensor)}
                      style={{ cursor: 'pointer' }}
                    >
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
                style={{ cursor: 'pointer' }}
              >
                <h4>
                  {sensor.name}
                  <span className="status">정상</span>
                </h4>
                <div className="graph-container">
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
                            stopColor={colorAssignments[sensor.id].line}
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor={colorAssignments[sensor.id].line}
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
                      <ReferenceLine
                        y={0.5}
                        stroke="#04A777"
                        strokeWidth={1}
                        strokeDasharray="4 2"
                      />
                      <ReferenceLine
                        y={1.0}
                        stroke="#FFD600"
                        strokeWidth={1}
                        strokeDasharray="4 2"
                      />
                      <ReferenceLine
                        y={1.5}
                        stroke="#D90429"
                        strokeWidth={1}
                        strokeDasharray="4 2"
                      />
                      <XAxis
                        dataKey="time"
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={{ stroke: colors.chart.axis.line }}
                      />
                      <YAxis
                        domain={[0, 2]}
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={{ stroke: colors.chart.axis.line }}
                        tickFormatter={(value) => value.toFixed(1)}
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
                        stroke={colorAssignments[sensor.id].line}
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
                  data={selectedSensor.detailedData}
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
                          colorAssignments[selectedSensor.id || 0].line
                        }
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor={
                          colorAssignments[selectedSensor.id || 0].line
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
                          colorAssignments[selectedSensor.id || 0].line
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
                  <ReferenceLine
                    y={0.5}
                    stroke="#04A777"
                    strokeWidth={1}
                    strokeDasharray="4 2"
                  />
                  <ReferenceLine
                    y={1.0}
                    stroke="#FFD600"
                    strokeWidth={1}
                    strokeDasharray="4 2"
                  />
                  <ReferenceLine
                    y={1.5}
                    stroke="#D90429"
                    strokeWidth={1}
                    strokeDasharray="4 2"
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
                    domain={zoomDomain?.y || [0, 2]}
                    allowDataOverflow
                    tickFormatter={(value) => value.toFixed(2)}
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
                    stroke={colorAssignments[selectedSensor.id || 0].line}
                    strokeWidth={2}
                    fill="url(#gradient-detailed)"
                    fillOpacity={1}
                    isAnimationActive={false}
                    dot={false}
                    activeDot={{
                      r: 6,
                      fill: colorAssignments[selectedSensor.id || 0].line,
                      stroke: '#ffffff',
                      strokeWidth: 2,
                      style: {
                        filter: 'url(#glow)',
                      },
                    }}
                    style={{
                      filter: 'url(#areaGlow)',
                    }}
                  />
                  {isZooming && refAreaLeft && refAreaRight && (
                    <ReferenceArea
                      x1={refAreaLeft}
                      x2={refAreaRight}
                      strokeOpacity={0.3}
                      fill={colorAssignments[selectedSensor.id || 0].line}
                      fillOpacity={0.1}
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </DetailedGraphContainer>
            <GraphStatsBar>
              <span className="stat">From: {fromTime}</span>
              <span className="stat">To: {toTime}</span>
              <span className="stat">최대: {maxValue}g</span>
              <span className="stat">최소: {minValue}g</span>
              <span className="stat">평균: {avgValue}g</span>
              <span className="legend">
                <span className="dot normal" /> 정상
                <span className="dot warning" /> 경고
                <span className="dot danger" /> 위험
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
    </div>
  );
}
