import styled from '@emotion/styled';

interface FacilityListItemProps {
  name: string;
  address: string;
  gasStatus: 'normal' | 'warning' | 'danger';
  fireStatus: 'normal' | 'warning' | 'danger';
  vibrationStatus: 'normal' | 'warning' | 'danger';
}

export default function FacilityListItem({
  name,
  address,
  gasStatus,
  fireStatus,
  vibrationStatus,
}: FacilityListItemProps) {
  const getStatusIcon = (status: 'normal' | 'warning' | 'danger') => {
    switch (status) {
      case 'normal':
        return '●';
      case 'warning':
        return '▲';
      case 'danger':
        return '■';
    }
  };

  const getStatusColor = (status: 'normal' | 'warning' | 'danger') => {
    switch (status) {
      case 'normal':
        return '#00AB75';
      case 'warning':
        return '#FFB800';
      case 'danger':
        return '#FF4D4D';
    }
  };

  return (
    <Container>
      <Item flex={1.5}>{name}</Item>
      <Item flex={2}>{address}</Item>
      <Item flex={1}>
        <StatusIcon color={getStatusColor(gasStatus)}>
          {getStatusIcon(gasStatus)}
        </StatusIcon>
      </Item>
      <Item flex={1}>
        <StatusIcon color={getStatusColor(fireStatus)}>
          {getStatusIcon(fireStatus)}
        </StatusIcon>
      </Item>
      <Item flex={1}>
        <StatusIcon color={getStatusColor(vibrationStatus)}>
          {getStatusIcon(vibrationStatus)}
        </StatusIcon>
      </Item>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #c5c5c5;

  &:last-child {
    border-bottom: none;
  }
`;

const Item = styled.div<{ flex: number }>`
  flex: ${(props) => props.flex};
  text-align: center;
  font-family: 'Pretendard';
  font-size: 16px;
  color: #111111;
`;

const StatusIcon = styled.span<{ color: string }>`
  color: ${(props) => props.color};
  font-size: 19px;
`;
