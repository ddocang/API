import styled from '@emotion/styled';

export const CustomTooltip = styled.div`
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

export const DetailedGraphPopup = styled.div<{ isOpen: boolean }>`
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

export const PopupOverlay = styled.div<{ isOpen: boolean }>`
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

export const PopupHeader = styled.div`
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

export const PopupLogo = styled.div`
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

export const CloseButton = styled.button`
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

export const DetailedGraphContainer = styled.div`
  width: 100%;
  height: calc(100% - 80px);
  background: #f8fafc;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #e2e8f0;
`;

export const MainMenu = styled.div`
  display: flex;
  gap: 12px;
  user-select: none;
  align-items: center;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    justify-content: center;
  }
`;

export const NavLinkStyle = styled.a<{ active?: boolean }>`
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

export const BackButton = styled.button`
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

export const SensorHeader = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 16px;
  gap: 8px;
`;

export const FilterButton = styled.button<{ active: boolean }>`
  font-family: 'Pretendard';
  font-size: 13px;
  font-weight: ${({ active }) => (active ? '600' : '500')};
  color: ${({ active }) => (active ? '#2563eb' : '#64748b')};
  background: ${({ active }) => (active ? '#eff6ff' : '#ffffff')};
  border: 1px solid ${({ active }) => (active ? '#93c5fd' : '#e2e8f0')};
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    color: #2563eb;
    border-color: #93c5fd;
    background: #eff6ff;
  }

  .count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: ${({ active }) => (active ? '#2563eb' : '#f1f5f9')};
    color: ${({ active }) => (active ? '#ffffff' : '#64748b')};
    font-size: 12px;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 4px;
    min-width: 20px;
  }
`;

export const MapSection = styled.div`
  width: 100%;
  display: flex;
  gap: 15px;
  height: 100%;
  min-height: 0;
  align-items: stretch;

  @media (max-width: 1024px) {
    flex-direction: column;
    height: auto;
    gap: 15px;
    overflow: visible;
  }
`;

export const LeftColumn = styled.div`
  width: 42%;
  display: flex;
  flex-direction: column;
  gap: 15px;
  min-height: 0;
  height: 100%;

  @media (max-width: 1024px) {
    width: 100%;
    height: auto;
    min-height: auto;
  }
`;

export const MapView = styled.div`
  flex: 0.682;
  width: 100%;
  min-height: 0;
  position: relative;
  background: white;
  border-radius: 16px;
  padding: 15px;
  aspect-ratio: 828 / 672;

  @media (max-width: 1024px) {
    min-height: 300px;
    aspect-ratio: auto;
    height: 300px;
    flex: none;
  }

  svg {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .sensor-icon {
    cursor: pointer;
    transition: all 0.2s ease;

    &[data-type='gas'] {
      fill: #22c576;
    }

    &[data-type='fire'] {
      fill: #d81159;
    }

    &[data-type='vibration'] {
      fill: #f2c035;
    }
  }
`;

export const MapContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const SensorIcon = styled.div<{
  type: 'gas' | 'fire' | 'vibration';
  x: number;
  y: number;
}>`
  position: absolute;
  width: clamp(16px, 2vw, 24px);
  height: clamp(16px, 2vw, 24px);
  border-radius: 50%;
  background-color: ${({ type }) =>
    type === 'gas' ? '#22c576' : type === 'fire' ? '#d81159' : '#f2c035'};
  display: flex;
  align-items: center;
  justify-content: center;
  left: ${({ x }) => x}%;
  top: ${({ y }) => y}%;
  transform: translate(-50%, -50%);
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 1;

  &:hover {
    transform: translate(-50%, -50%) scale(1.1);
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.15);
  }

  svg {
    width: clamp(12px, 1.5vw, 20px);
    height: clamp(12px, 1.5vw, 20px);
    color: white;
  }

  @media (max-width: 768px) {
    width: clamp(12px, 4vw, 20px);
    height: clamp(12px, 4vw, 20px);

    svg {
      width: clamp(8px, 3vw, 16px);
      height: clamp(8px, 3vw, 16px);
    }
  }
`;

export const SensorCard = styled.div`
  flex: 0.318;
  min-height: 0;
  background: white;
  border-radius: 16px;
  padding: 15px;
  width: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.05);

  @media (max-width: 1024px) {
    height: 300px;
    min-height: 300px;
    flex: none;
  }
`;

export const ListHeader = styled.div`
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

export const SensorList = styled.div`
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  padding: 0 8px;

  @media (max-width: 1024px) {
    height: calc(100% - 90px);
    overflow-y: auto;
  }

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
`;

export const SensorItem = styled.div`
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

export const SensorNo = styled.span`
  font-family: 'Pretendard';
  font-size: 13px;
  color: #666666;
  text-align: center;

  @media (max-width: 1600px) {
    font-size: 12px;
  }
`;

export const SensorType = styled.span`
  font-family: 'Pretendard';
  font-size: 13px;
  color: #666666;
  text-align: center;

  @media (max-width: 1600px) {
    font-size: 12px;
  }
`;

export const SensorConnection = styled.span`
  font-family: 'Pretendard';
  font-size: 13px;
  color: #2e7d32;
  font-weight: 600;
  text-align: center;

  @media (max-width: 1600px) {
    font-size: 12px;
  }
`;

export const SensorStatus = styled.div<{ status?: string }>`
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

export const SensorValue = styled.div<{ status?: string }>`
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

export const SensorTitle = styled.h3`
  font-family: 'Pretendard';
  font-weight: 600;
  font-size: 18px;
  color: #000000;
  margin: 0;
`;

export const GNB = styled.nav`
  width: 100%;
  height: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px 20px 32px;
  user-select: none;
  position: relative;
  z-index: 1;
  max-width: 1920px;
  margin: 0 auto;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    padding: 24px 20px 20px 20px;
  }
`;

export const Logo = styled.div`
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

export const LogoImageWrapper = styled.div`
  position: relative;
  width: 36px;
  height: 36px;
`;

export const VibrationGraphContainer = styled.div`
  width: 58%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 15px;
  height: 100%;
  min-height: 0;

  @media (max-width: 1024px) {
    width: 100%;
    height: auto;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(9, minmax(200px, auto));
    gap: 15px;
    margin-top: 15px;
  }
`;

export const VibrationGraphCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.05);
  width: 100%;
  height: 100%;
  min-height: 0;

  h4 {
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 16px;
    color: #000000;
    margin: 0 0 15px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .status {
      font-size: 13px;
      padding: 4px 10px;
      background: #e8f5e9;
      color: #2e7d32;
      border-radius: 8px;
    }
  }

  .graph-container {
    flex: 1;
    background: #f8f9fa;
    border-radius: 12px;
    padding: 15px;
    min-height: 0;
    height: calc(100% - 46px);
  }

  @media (max-width: 1024px) {
    min-height: 250px;
  }
`;

export const Container = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #f2f2f2;
  display: flex;
  flex-direction: column;

  @media (max-width: 1024px) {
    height: auto;
    min-height: 100vh;
  }
`;

export const TopBanner = styled.div`
  position: relative;
  width: 100%;
  height: 85px;
  overflow: hidden;
  flex-shrink: 0;
  background: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const BannerBackground = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(96, 165, 250, 0.08) 0%,
    rgba(59, 130, 246, 0.12) 100%
  );
`;

export const DarkOverlay = styled.div`
  display: none;
`;

export const BannerContent = styled.div`
  position: relative;
  max-width: 1920px;
  margin: 0 auto;
  padding: 0 32px;
  z-index: 1;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-left: 200px;
  height: 100%;

  @media (max-width: 768px) {
    padding: 0 20px;
    align-items: center;
  }
`;

export const TitleContainer = styled.div`
  padding: 8px 20px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(96, 165, 250, 0.2);
  text-align: left;
  margin-top: 8px;
`;

export const Title = styled.h1`
  font-family: 'Pretendard';
  font-weight: 700;
  font-size: 24px;
  text-align: center;
  color: #1e293b;
  margin: 0;
  line-height: 1.4;
  letter-spacing: -0.02em;
`;

export const Subtitle = styled.p`
  font-family: 'Pretendard';
  font-size: 15px;
  text-align: center;
  color: #60a5fa;
  margin: 4px 0 0 0;
  font-weight: 500;
  letter-spacing: -0.01em;
`;

export const UpdateTime = styled.div`
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

export const ContentSection = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 15px;
  flex: 1;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 85px);

  @media (max-width: 1024px) {
    height: auto;
    min-height: 100vh;
    padding: 15px;
  }
`;
