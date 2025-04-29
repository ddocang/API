// 서울 근방 랜덤 좌표 생성 함수
function getRandomLatLng() {
  const lat = 37.5 + Math.random() * 0.1; // 37.5 ~ 37.6
  const lng = 126.9 + Math.random() * 0.1; // 126.9 ~ 127.0
  return { lat, lng };
}

// 상태값 매핑 함수 (정상, 경고, 비활성만)
export function getStatusType(value: string) {
  if (value === '정상') return 'normal';
  if (value === '경고') return 'warning';
  if (value === '비활성') return 'inactive';
  return '';
}

export const tubeTrailerMockData = [
  {
    id: 1,
    carNo: '12가3456',
    coupling: '정상',
    landingGearL: '정상',
    landingGearR: '정상',
    tBrake: '정상',
    gasSensor: '정상',
    ...getRandomLatLng(),
  },
  {
    id: 2,
    carNo: '34나5678',
    coupling: '경고',
    landingGearL: '정상',
    landingGearR: '경고',
    tBrake: '정상',
    gasSensor: '정상',
    ...getRandomLatLng(),
  },
  {
    id: 3,
    carNo: '56다7890',
    coupling: '정상',
    landingGearL: '정상',
    landingGearR: '정상',
    tBrake: '비활성',
    gasSensor: '경고',
    ...getRandomLatLng(),
  },
  {
    id: 4,
    carNo: '78라1234',
    coupling: '정상',
    landingGearL: '경고',
    landingGearR: '정상',
    tBrake: '정상',
    gasSensor: '정상',
    ...getRandomLatLng(),
  },
  {
    id: 5,
    carNo: '90마5678',
    coupling: '비활성',
    landingGearL: '정상',
    landingGearR: '정상',
    tBrake: '정상',
    gasSensor: '경고',
    ...getRandomLatLng(),
  },
];
