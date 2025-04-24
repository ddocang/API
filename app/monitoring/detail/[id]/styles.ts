import styled from '@emotion/styled';
import { colors } from '@/app/styles/colors';

export const CustomTooltip = styled.div`
  background: rgba(17, 25, 40, 0.95);
  border-radius: 12px;
  padding: 12px 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);

  .time {
    font-family: 'Pretendard';
    font-size: 13px;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 4px;
  }

  .value {
    font-family: 'Pretendard';
    font-size: 16px;
    color: #ffffff;
    font-weight: 600;
  }
`;

export const DetailedGraphPopup = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${colors.background.primary};
  border-radius: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  width: 95vw;
  height: 85vh;
  max-width: 1800px;
  max-height: 1000px;
  display: flex;
  flex-direction: column;
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
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
  grid-template-columns: 1fr auto;
  align-items: center;
  padding: 24px 32px;
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  gap: 24px;

  h2 {
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 24px;
    color: #ffffff;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:before {
      content: '';
      display: block;
      width: 8px;
      height: 8px;
      background: #2563eb;
      border-radius: 50%;
      box-shadow: 0 0 12px rgba(37, 99, 235, 0.5);
      flex-shrink: 0;
    }
  }

  .button-group {
    display: flex;
    gap: 8px;
    flex-shrink: 0;
  }
`;

export const PopupButton = styled.button<{ $active?: boolean }>`
  background: ${({ $active }) =>
    $active ? 'rgba(37, 99, 235, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
  color: ${({ $active }) => ($active ? '#60a5fa' : 'rgba(255, 255, 255, 0.7)')};
  border: 1px solid
    ${({ $active }) =>
      $active ? 'rgba(37, 99, 235, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
  padding: 10px 20px;
  border-radius: 12px;
  font-family: 'Pretendard';
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background: ${({ $active }) =>
      $active ? 'rgba(37, 99, 235, 0.25)' : 'rgba(255, 255, 255, 0.08)'};
    color: ${({ $active }) => ($active ? '#93c5fd' : '#ffffff')};
    border-color: ${({ $active }) =>
      $active ? 'rgba(37, 99, 235, 0.4)' : 'rgba(255, 255, 255, 0.2)'};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const CloseButton = styled(PopupButton)`
  && {
    padding: 10px;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    background: rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.1);

    &:hover {
      background: rgba(239, 68, 68, 0.15);
      color: #ef4444;
      border-color: rgba(239, 68, 68, 0.2);
    }
  }
`;

export const DetailedGraphContainer = styled.div`
  flex: 1;
  width: 100%;
  padding: 24px 32px;
  overflow-x: auto;
  overflow-y: hidden;
  position: relative;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }

  .recharts-wrapper {
    width: 100% !important;
    height: 100% !important;
  }

  .recharts-surface {
    width: 100%;
    height: 100%;
  }

  .recharts-cartesian-grid-horizontal line,
  .recharts-cartesian-grid-vertical line {
    stroke: rgba(255, 255, 255, 0.1);
  }

  .recharts-cartesian-axis-line {
    stroke: rgba(255, 255, 255, 0.2);
  }

  .recharts-cartesian-axis-tick-value {
    font-family: 'Pretendard';
    font-size: 12px;
    fill: rgba(255, 255, 255, 0.7);
  }

  .recharts-tooltip-wrapper {
    filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
  }
`;

export const MainMenu = styled.div`
  display: flex;
  gap: 16px;
  user-select: none;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const NavLinkStyle = styled.a<{ active?: boolean }>`
  && {
    font-family: 'Pretendard';
    font-size: 15px;
    font-weight: 400;
    color: ${({ active }) => (active ? '#ffffff' : 'rgba(255, 255, 255, 0.7)')};
    text-decoration: none;
    position: relative;
    padding: 8px 16px;
    border-radius: 8px;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    background: ${({ active }) =>
      active ? 'rgba(255, 255, 255, 0.15)' : 'transparent'};
    backdrop-filter: blur(8px);
    border: 1px solid
      ${({ active }) =>
        active ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)'};

    &:hover {
      color: #ffffff;
      border-color: rgba(255, 255, 255, 0.3);
      background: rgba(255, 255, 255, 0.1);

      svg {
        color: #ffffff;
      }
    }

    svg {
      width: 18px;
      height: 18px;
      transition: all 0.2s ease;
      color: ${({ active }) =>
        active ? '#ffffff' : 'rgba(255, 255, 255, 0.7)'};
    }
  }
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 4px 8px;
  border-radius: 8px;
  font-family: 'Pretendard';
  font-size: 15px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(8px);

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
    color: #ffffff;

    svg {
      color: #ffffff;
    }
  }

  svg {
    width: 18px;
    height: 18px;
    color: rgba(255, 255, 255, 0.7);
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

export const ListHeader = styled.div`
  display: grid;
  grid-template-columns: 120px repeat(4, 1fr) 80px;
  gap: 8px;
  padding: 12px 16px;
  background: ${colors.background.light};
  border: 1px solid ${colors.border.color};
  border-radius: 12px;
  margin-bottom: 12px;
  font-family: 'Pretendard';
  font-size: 13px;
  color: ${colors.text.white};
  font-weight: 600;
  box-shadow: inset 0 0 20px rgba(29, 56, 120, 0.15);
  backdrop-filter: blur(8px);
  align-items: center;

  span {
    text-align: center;
    padding: 0 8px;
  }

  > * {
    text-align: center;
  }

  > *:last-child {
    text-align: right;
    padding-right: 0;
  }

  @media (max-width: 1600px) {
    font-size: 12px;
    gap: 6px;
    padding: 10px 12px;
    grid-template-columns: 100px repeat(4, 1fr) 70px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 50px 100px repeat(2, 1fr);
    padding: 8px 10px;
    font-size: 11px;
    gap: 4px;

    > *:nth-of-type(5),
    > *:last-child {
      display: none;
    }
  }
`;

export const FilterDropdown = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
  text-align: right;
`;

export const FilterButton = styled.button<{ isOpen?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0;
  background: transparent;
  border: none;
  font-family: 'Pretendard';
  font-size: 13px;
  font-weight: 600;
  color: ${colors.text.white};
  cursor: pointer;
  transition: all 0.2s ease;

  svg {
    width: 14px;
    height: 14px;
    color: ${colors.text.white};
    transition: all 0.2s ease;
    transform: ${({ isOpen }) => (isOpen ? 'rotate(180deg)' : 'rotate(0)')};
  }

  &:hover {
    color: #ffffff;

    svg {
      color: #ffffff;
    }
  }

  @media (max-width: 1600px) {
    font-size: 12px;

    svg {
      width: 12px;
      height: 12px;
    }
  }
`;

export const FilterMenu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: ${colors.background.primary};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 8px;
  min-width: 130px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(12px);
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  z-index: 100;
`;

export const FilterMenuItem = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 12px;
  border: none;
  background: ${({ $active }) =>
    $active ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
  border-radius: 8px;
  font-family: 'Pretendard';
  font-size: 14px;
  color: ${({ $active }) => ($active ? '#ffffff' : 'rgba(255, 255, 255, 0.7)')};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;
  }

  .count {
    font-size: 12px;
    font-weight: 500;
    padding: 2px 8px;
    border-radius: 12px;
    background: ${({ $active }) =>
      $active ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
    color: ${({ $active }) =>
      $active ? '#ffffff' : 'rgba(255, 255, 255, 0.7)'};
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
  flex: 0.684;
  width: 100%;
  min-height: 0;
  position: relative;
  background: ${colors.background.primary};
  border-radius: ${colors.borderPreset.card.radius};
  padding: 15px;
  aspect-ratio: 828 / 672;
  border: ${colors.borderPreset.card.width} ${colors.borderPreset.card.style}
    ${colors.borderPreset.card.color};
  box-shadow: ${colors.borderPreset.card.glow};

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
    transition: all 0.3s ease;

    @keyframes pulse {
      0% {
        filter: brightness(1) drop-shadow(0 0 3px rgba(255, 255, 255, 0.1));
      }
      50% {
        filter: brightness(1.5) drop-shadow(0 0 8px rgba(255, 255, 255, 0.3));
      }
      100% {
        filter: brightness(1) drop-shadow(0 0 3px rgba(255, 255, 255, 0.1));
      }
    }

    &[data-type='gas'] {
      fill: #04a777;
      filter: drop-shadow(0 0 5px rgba(4, 167, 119, 0.5));
      animation: pulse 2s infinite ease-in-out;
    }

    &[data-type='fire'] {
      fill: #d90368;
      filter: drop-shadow(0 0 5px rgba(217, 3, 104, 0.5));
      animation: pulse 2s infinite ease-in-out;
    }

    &[data-type='vibration'] {
      fill: #fb8b24;
      filter: drop-shadow(0 0 5px rgba(251, 139, 36, 0.5));
      animation: pulse 2s infinite ease-in-out;
    }

    &:hover {
      &[data-type='gas'] {
        filter: drop-shadow(0 0 8px rgba(4, 167, 119, 0.8));
      }

      &[data-type='fire'] {
        filter: drop-shadow(0 0 8px rgba(217, 3, 104, 0.8));
      }

      &[data-type='vibration'] {
        filter: drop-shadow(0 0 8px rgba(251, 139, 36, 0.8));
      }
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
  overflow: visible;
`;

export const SensorIcon = styled.g`
  cursor: pointer;
  transition: all 0.3s ease;

  @keyframes pulse {
    0% {
      filter: brightness(1) drop-shadow(0 0 3px rgba(255, 255, 255, 0.1));
    }
    50% {
      filter: brightness(1.5) drop-shadow(0 0 8px rgba(255, 255, 255, 0.3));
    }
    100% {
      filter: brightness(1) drop-shadow(0 0 3px rgba(255, 255, 255, 0.1));
    }
  }

  &[data-type='gas'] {
    fill: #04a777;
    filter: drop-shadow(0 0 5px rgba(4, 167, 119, 0.5));
    animation: pulse 2s infinite ease-in-out;
  }

  &[data-type='fire'] {
    fill: #d90368;
    filter: drop-shadow(0 0 5px rgba(217, 3, 104, 0.5));
    animation: pulse 2s infinite ease-in-out;
  }

  &[data-type='vibration'] {
    fill: #fb8b24;
    filter: drop-shadow(0 0 5px rgba(251, 139, 36, 0.5));
    animation: pulse 2s infinite ease-in-out;
  }

  &:hover {
    &[data-type='gas'] {
      filter: drop-shadow(0 0 8px rgba(4, 167, 119, 0.8));
    }

    &[data-type='fire'] {
      filter: drop-shadow(0 0 8px rgba(217, 3, 104, 0.8));
    }

    &[data-type='vibration'] {
      filter: drop-shadow(0 0 8px rgba(251, 139, 36, 0.8));
    }
  }
`;

export const SensorCard = styled.div`
  flex: 0.316;
  min-height: 0;
  background: ${colors.background.primary};
  border-radius: ${colors.borderPreset.card.radius};
  padding: 15px;
  width: 100%;
  display: flex;
  flex-direction: column;
  border: ${colors.borderPreset.card.width} ${colors.borderPreset.card.style}
    ${colors.borderPreset.card.color};
  box-shadow: ${colors.borderPreset.card.glow};

  @media (max-width: 1024px) {
    height: 300px;
    min-height: 300px;
    flex: none;
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
    background: ${colors.background.secondary};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${colors.border.color};
    border-radius: 3px;
  }
`;

export const SensorItem = styled.div`
  display: grid;
  grid-template-columns: 120px repeat(4, 1fr) 80px;
  gap: 8px;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid ${colors.background.secondary};
  transition: background-color 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.03);
  }

  &:last-child {
    border-bottom: none;
  }

  > * {
    text-align: center;
    padding: 0 8px;
  }

  > *:last-child {
    text-align: right;
    padding-right: 0;
  }

  @media (max-width: 1600px) {
    gap: 6px;
    padding: 10px 12px;
    grid-template-columns: 100px repeat(4, 1fr) 70px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 50px 100px repeat(2, 1fr);
    padding: 8px 10px;
    gap: 4px;

    > *:nth-of-type(5),
    > *:last-child {
      display: none;
    }
  }
`;

export const SensorNo = styled.span`
  font-family: 'Pretendard';
  font-size: 13px;
  color: ${colors.text.secondary};
  text-align: center;

  @media (max-width: 768px) {
    font-size: 11px;
  }
`;

export const SensorType = styled.span`
  font-family: 'Pretendard';
  font-size: 13px;
  color: ${colors.text.secondary};
  text-align: center;

  @media (max-width: 768px) {
    font-size: 11px;

    .sensor-name {
      &:after {
        content: attr(data-short-name);
      }
    }

    .sensor-name-full {
      display: none;
    }
  }

  @media (min-width: 769px) {
    .sensor-name {
      &:after {
        content: attr(data-full-name);
      }
    }

    .sensor-name-short {
      display: none;
    }
  }
`;

export const SensorConnection = styled.span`
  font-family: 'Pretendard';
  font-size: 13px;
  color: #2e7d32;
  font-weight: 600;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 11px;
  }
`;

export const SensorStatus = styled.div<{ status?: string }>`
  font-family: 'Pretendard';
  font-size: 13px;
  color: ${colors.status.normal.text};
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
        ? colors.status.normal.background
        : props.status === 'warning'
        ? colors.status.warning.background
        : colors.status.danger.background
    };
    color: ${
      props.status === 'normal'
        ? colors.status.normal.text
        : props.status === 'warning'
        ? colors.status.warning.text
        : colors.status.danger.text
    };
    border-radius: 12px;
    margin: 0 auto;
  `}

  @media (max-width: 768px) {
    font-size: 11px;
    ${(props) =>
      props.status &&
      `
      padding: 2px 8px;
      border-radius: 8px;
    `}
  }
`;

export const SensorValue = styled.div<{ status?: string }>`
  font-family: 'Pretendard';
  font-weight: 600;
  font-size: 13px;
  color: ${({ status }) =>
    status === 'normal'
      ? '#ffffff'
      : status === 'warning'
      ? colors.status.warning.text
      : colors.status.danger.text};
  text-align: center;

  span {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
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
    font-weight: 400;
    font-size: 32px;
    color: #ffffff;
    line-height: 32px;
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
  background: transparent;
  border-radius: ${colors.borderPreset.card.radius};
  padding: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 0;

  h4 {
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 15px;
    color: ${colors.chart.title.text};
    margin: 0 0 15px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: ${colors.chart.title.background};
    padding: 8px 16px;
    border-radius: 8px;
    border: 1px solid ${colors.chart.title.border};
    position: relative;

    .status {
      position: absolute;
      right: 8px;
      font-size: 13px;
      padding: 4px 10px;
      background: ${colors.chart.title.status.background};
      color: ${colors.chart.title.status.text};
      border-radius: 8px;
      border: 1px solid ${colors.chart.title.status.border};
    }
  }

  .graph-container {
    flex: 1;
    background: ${colors.background.secondary};
    border-radius: 12px;
    padding: 15px;
    min-height: 0;
    height: calc(100% - 46px);
    border: 1px solid ${colors.border.color};
  }

  @media (max-width: 1024px) {
    min-height: 250px;
  }
`;

export const Container = styled.div`
  width: 100%;
  height: 100vh;
  background: linear-gradient(
    to bottom right,
    ${colors.gradient.main.from},
    ${colors.gradient.main.to}
  );
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
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  z-index: 1;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.15);

  @media (max-width: 768px) {
    height: 60px;
    padding: 0 16px;
    justify-content: center;
  }
`;

export const BannerBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('/images/monitoring/detail/noisy-gradients.svg');
    background-size: cover;
    background-position: center;
    filter: drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.15));
  }

  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.85) 0%,
      rgba(0, 0, 0, 0) 71.79%
    );
    mix-blend-mode: multiply;
  }
`;

export const DarkOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.03) 0%,
    rgba(0, 0, 0, 0) 100%
  );
  mix-blend-mode: multiply;
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
    padding: 0;
    align-items: center;
    justify-content: center;
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
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.1);
  padding: 8px 16px;
  border-radius: 8px;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);

  &:before {
    content: '';
    display: block;
    width: 6px;
    height: 6px;
    background: #ffffff;
    border-radius: 50%;
    box-shadow: 0 0 12px rgba(255, 255, 255, 0.5);
  }

  @media (max-width: 768px) {
    display: none;
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

  @media (max-width: 768px) {
    height: 100vh;
    padding: 10px;
  }
`;

export const SensorTooltip = styled.div<{
  status: 'normal' | 'warning' | 'danger';
}>`
  position: absolute;
  background: rgba(26, 32, 44, 0.95);
  border: 1px solid
    ${({ status }) =>
      status === 'normal'
        ? 'rgba(16, 185, 129, 0.5)'
        : status === 'warning'
        ? 'rgba(245, 158, 11, 0.5)'
        : 'rgba(239, 68, 68, 0.5)'};
  border-radius: 8px;
  padding: 12px;
  min-width: 200px;
  backdrop-filter: blur(8px);
  box-shadow: ${({ status }) =>
    status === 'normal'
      ? '0 0 15px rgba(16, 185, 129, 0.3), inset 0 0 20px rgba(16, 185, 129, 0.1)'
      : status === 'warning'
      ? '0 0 15px rgba(245, 158, 11, 0.3), inset 0 0 20px rgba(245, 158, 11, 0.1)'
      : '0 0 15px rgba(239, 68, 68, 0.3), inset 0 0 20px rgba(239, 68, 68, 0.1)'};
  z-index: 1000;
  margin-bottom: 15px;

  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid rgba(26, 32, 44, 0.95);
  }

  &::before {
    content: '';
    position: absolute;
    bottom: -9px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 9px solid transparent;
    border-right: 9px solid transparent;
    border-top: 9px solid
      ${({ status }) =>
        status === 'normal'
          ? 'rgba(16, 185, 129, 0.5)'
          : status === 'warning'
          ? 'rgba(245, 158, 11, 0.5)'
          : 'rgba(239, 68, 68, 0.5)'};
  }

  .tooltip-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid
      ${({ status }) =>
        status === 'normal'
          ? 'rgba(16, 185, 129, 0.2)'
          : status === 'warning'
          ? 'rgba(245, 158, 11, 0.2)'
          : 'rgba(239, 68, 68, 0.2)'};

    .status-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: ${({ status }) =>
        status === 'normal'
          ? '#10B981'
          : status === 'warning'
          ? '#F59E0B'
          : '#EF4444'};
      box-shadow: 0 0 12px
        ${({ status }) =>
          status === 'normal'
            ? 'rgba(16, 185, 129, 0.8)'
            : status === 'warning'
            ? 'rgba(245, 158, 11, 0.8)'
            : 'rgba(239, 68, 68, 0.8)'};
    }

    .name {
      font-size: 14px;
      font-weight: 600;
      color: #ffffff;
      flex: 1;
    }

    .status-text {
      font-size: 12px;
      padding: 2px 8px;
      border-radius: 4px;
      background-color: ${({ status }) =>
        status === 'normal'
          ? 'rgba(16, 185, 129, 0.2)'
          : status === 'warning'
          ? 'rgba(245, 158, 11, 0.2)'
          : 'rgba(239, 68, 68, 0.2)'};
      color: ${({ status }) =>
        status === 'normal'
          ? '#10B981'
          : status === 'warning'
          ? '#F59E0B'
          : '#EF4444'};
      border: 1px solid
        ${({ status }) =>
          status === 'normal'
            ? 'rgba(16, 185, 129, 0.3)'
            : status === 'warning'
            ? 'rgba(245, 158, 11, 0.3)'
            : 'rgba(239, 68, 68, 0.3)'};
    }
  }

  .tooltip-content {
    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      font-size: 13px;

      &:last-child {
        margin-bottom: 0;
      }

      .label {
        color: #94a3b8;
      }

      .value {
        color: #ffffff;
        font-weight: 500;
      }
    }
  }
`;

export const LogButton = styled(NavLinkStyle)`
  && {
    svg {
      color: ${({ active }) =>
        active ? '#ffffff' : 'rgba(255, 255, 255, 0.7)'};
    }
    &:hover {
      svg {
        color: #ffffff;
      }
    }
  }
`;

export const LogPopup = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  max-height: 80vh;
  background: ${colors.background.primary};
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  z-index: 1000;
  display: ${(props) => (props.isOpen ? 'flex' : 'none')};
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);

  @media (max-width: 900px) {
    width: 90%;
    max-height: 70vh;
  }
`;

export const LogHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.02);

  h2 {
    font-family: 'Pretendard';
    font-size: 24px;
    font-weight: 600;
    color: #ffffff;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 12px;

    svg {
      width: 24px;
      height: 24px;
      color: ${colors.status.danger.text};
    }
  }

  @media (max-width: 768px) {
    padding: 20px 24px;

    h2 {
      font-size: 20px;

      svg {
        width: 20px;
        height: 20px;
      }
    }
  }
`;

export const LogContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px 32px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }

  @media (max-width: 768px) {
    padding: 20px 24px;
  }
`;

export const LogItem = styled.div<{ severity: 'warning' | 'danger' }>`
  display: flex;
  align-items: center;
  padding: 16px 20px;
  background: ${(props) =>
    props.severity === 'warning'
      ? 'rgba(242, 192, 53, 0.1)'
      : 'rgba(216, 17, 89, 0.1)'};
  border: 1px solid
    ${(props) =>
      props.severity === 'warning'
        ? 'rgba(242, 192, 53, 0.2)'
        : 'rgba(216, 17, 89, 0.2)'};
  border-radius: 12px;
  margin-bottom: 12px;
  backdrop-filter: blur(8px);
  transition: all 0.2s ease;

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px
      ${(props) =>
        props.severity === 'warning'
          ? 'rgba(242, 192, 53, 0.15)'
          : 'rgba(216, 17, 89, 0.15)'};
  }

  .time {
    font-family: 'Pretendard';
    font-size: 14px;
    color: rgba(255, 255, 255, 0.5);
    margin-right: 20px;
    white-space: nowrap;
  }

  .content {
    flex: 1;
    font-family: 'Pretendard';
    font-size: 15px;
    color: #ffffff;
    font-weight: 500;
  }

  .status {
    font-family: 'Pretendard';
    font-size: 13px;
    font-weight: 600;
    padding: 6px 12px;
    border-radius: 20px;
    background: ${(props) =>
      props.severity === 'warning'
        ? 'rgba(242, 192, 53, 0.2)'
        : 'rgba(216, 17, 89, 0.2)'};
    color: ${(props) =>
      props.severity === 'warning'
        ? colors.sensor.vibration
        : colors.sensor.fire};
    margin-left: 16px;
    white-space: nowrap;
    border: 1px solid
      ${(props) =>
        props.severity === 'warning'
          ? 'rgba(242, 192, 53, 0.3)'
          : 'rgba(216, 17, 89, 0.3)'};
  }

  @media (max-width: 768px) {
    padding: 12px 16px;
    flex-wrap: wrap;
    gap: 8px;

    .time {
      font-size: 12px;
      margin-right: 12px;
    }

    .content {
      font-size: 14px;
      width: 100%;
      order: -1;
      margin-bottom: 4px;
    }

    .status {
      font-size: 12px;
      padding: 4px 10px;
      margin-left: auto;
    }
  }
`;

export const BannerTitle = styled.div`
  font-family: 'Pretendard';
  font-size: 15px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.9);
  padding: 8px 16px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 24px;
  margin-right: auto;

  &:before {
    content: '';
    display: block;
    width: 6px;
    height: 6px;
    background: #ffffff;
    border-radius: 50%;
    box-shadow: 0 0 12px rgba(255, 255, 255, 0.5);
  }

  @media (max-width: 768px) {
    margin: 0;
    padding: 6px 12px;
    font-size: 13px;

    &:before {
      width: 4px;
      height: 4px;
    }
  }
`;
