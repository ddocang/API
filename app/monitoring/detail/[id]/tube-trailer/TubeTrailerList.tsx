import React from 'react';
import styled from 'styled-components';
import { colors } from '@/app/styles/colors';
import TubeTrailerMap from './TubeTrailerMap';
import { tubeTrailerMockData, getStatusType } from './tubeTrailerMockData';

// 서울 근방 랜덤 좌표 생성 함수
function getRandomLatLng() {
  const lat = 37.5 + Math.random() * 0.1; // 37.5 ~ 37.6
  const lng = 126.9 + Math.random() * 0.1; // 126.9 ~ 127.0
  return { lat, lng };
}

// 다운로드 아이콘 SVG 컴포넌트 추가
const DownloadIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9 2V12M9 12L5 8M9 12L13 8"
      stroke="#2563eb"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect x="3" y="14" width="12" height="2" rx="1" fill="#2563eb" />
  </svg>
);

const TubeTrailerList: React.FC = () => {
  return (
    <ListCard>
      <ListHeader>튜브트레일러 목록</ListHeader>
      <TubeList>
        <TubeListHeader>
          <div>No.</div>
          <div>차량번호</div>
          <div>커플링</div>
          <div>랜딩기어(L)</div>
          <div>랜딩기어(R)</div>
          <div>T/Brake</div>
          <div>가스감지기</div>
          <div>다운로드</div>
        </TubeListHeader>
        <TubeListBody>
          {tubeTrailerMockData.map((tube, idx) => (
            <TubeListItem key={tube.id}>
              <div>{idx + 1}</div>
              <div>{tube.carNo}</div>
              <StatusWrapper $status={getStatusType(tube.coupling)}>
                <StatusIndicator $status={getStatusType(tube.coupling)} />
                <StatusLabel $status={getStatusType(tube.coupling)}>
                  {tube.coupling}
                </StatusLabel>
              </StatusWrapper>
              <StatusWrapper $status={getStatusType(tube.landingGearL)}>
                <StatusIndicator $status={getStatusType(tube.landingGearL)} />
                <StatusLabel $status={getStatusType(tube.landingGearL)}>
                  {tube.landingGearL}
                </StatusLabel>
              </StatusWrapper>
              <StatusWrapper $status={getStatusType(tube.landingGearR)}>
                <StatusIndicator $status={getStatusType(tube.landingGearR)} />
                <StatusLabel $status={getStatusType(tube.landingGearR)}>
                  {tube.landingGearR}
                </StatusLabel>
              </StatusWrapper>
              <StatusWrapper $status={getStatusType(tube.tBrake)}>
                <StatusIndicator $status={getStatusType(tube.tBrake)} />
                <StatusLabel $status={getStatusType(tube.tBrake)}>
                  {tube.tBrake}
                </StatusLabel>
              </StatusWrapper>
              <StatusWrapper $status={getStatusType(tube.gasSensor)}>
                <StatusIndicator $status={getStatusType(tube.gasSensor)} />
                <StatusLabel $status={getStatusType(tube.gasSensor)}>
                  {tube.gasSensor}
                </StatusLabel>
              </StatusWrapper>
              <div>
                <DownloadIcon />
              </div>
            </TubeListItem>
          ))}
        </TubeListBody>
      </TubeList>
    </ListCard>
  );
};

const ListCard = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  padding: 20px 0 0 0;
  margin: 0px 0 0px 0px;
  display: flex;
  flex-direction: column;
  min-height: 400px;
  border: 1px solid ${colors.theme.light.border};
  font-family: 'Pretendard', sans-serif;
`;
const ListHeader = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #2563eb;
  margin: 0 0 16px 15px;
  font-family: 'Pretendard', sans-serif;
`;
const TubeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  padding: 0 8px;
  font-family: 'Pretendard', sans-serif;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }
`;
const TubeListHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  column-gap: 30px;
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  background: #f3f6fa;
  padding: 14px 24px;
  border-bottom: 1px solid ${colors.theme.light.border};
  font-family: 'Pretendard', sans-serif;
  & > div {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    & > div {
      display: inline-flex;
    }
  }
`;
const TubeListBody = styled.div`
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  font-family: 'Pretendard', sans-serif;
`;
const TubeListItem = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  column-gap: 30px;
  align-items: center;
  font-size: 14px;
  color: #222;
  padding: 14px 24px;
  border-bottom: 1px solid ${colors.theme.light.border};
  background: #fff;
  transition: background 0.15s;
  font-family: 'Pretendard', sans-serif;
  &:hover {
    background: rgba(255, 255, 255, 0.03);
  }
  &:last-child {
    border-bottom: none;
  }
  & > div {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    & > div {
      display: inline-flex;
    }
  }
`;
const StatusWrapper = styled.div<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 15px;
  padding: 4px 6px;
  border-radius: 20px;
  background: #f8f8f8;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    width: 30%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.8),
      transparent
    );
    animation: scan 3s ease-in-out infinite;
    pointer-events: none;
    transform: skewX(-20deg);
    opacity: ${({ $status }) => ($status === 'inactive' ? 0 : 1)};
    display: ${({ $status }) => ($status === 'inactive' ? 'none' : 'block')};
  }

  @keyframes scan {
    0% {
      left: -50%;
      opacity: 0;
    }
    25% {
      opacity: 0.5;
    }
    50% {
      opacity: 1;
    }
    75% {
      opacity: 0.5;
    }
    100% {
      left: 150%;
      opacity: 0;
    }
  }
`;

const StatusIndicator = styled.div<{ $status: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  position: relative;
  flex-shrink: 0;
  background-color: ${({ $status }) => {
    switch ($status) {
      case 'normal':
        return '#34C759';
      case 'warning':
        return '#FF3B30';
      case 'inactive':
        return '#999999';
      default:
        return '#999999';
    }
  }};
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 200%;
    height: 200%;
    border-radius: 50%;
    border: 1px solid currentColor;
    transform: translate(-50%, -50%);
  }
`;

const StatusLabel = styled.span<{ $status: string }>`
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  color: ${({ $status }) => {
    switch ($status) {
      case 'normal':
        return '#34C759';
      case 'warning':
        return '#FF3B30';
      case 'inactive':
        return '#999999';
      default:
        return '#999999';
    }
  }};
  position: relative;
  z-index: 1;
`;

console.log('TubeTrailerMap:', TubeTrailerMap);

export default TubeTrailerList;
