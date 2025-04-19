'use client';

import Image from 'next/image';
import styled from '@emotion/styled';

interface FacilityInfoCardProps {
  name: string;
  type: string;
  address: string;
  status: 'open' | 'closed';
  phone: string;
  imageUrl: string;
}

export default function FacilityInfoCard({
  name,
  type,
  address,
  status,
  phone,
  imageUrl,
}: FacilityInfoCardProps) {
  return (
    <Container>
      <ImageContainer>
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(max-width: 378px) 100vw, 378px"
          style={{ objectFit: 'cover' }}
          priority
        />
      </ImageContainer>

      <InfoContent>
        <TypeText>{type}</TypeText>
        <FacilityName>{name}</FacilityName>

        <Divider />

        <InfoRow>
          <LocationIcon />
          <AddressText>{address}</AddressText>
        </InfoRow>

        <InfoRow>
          <StatusDot status={status} />
          <StatusText status={status}>
            {status === 'open' ? '영업 중' : '영업 종료'}
          </StatusText>
        </InfoRow>

        <InfoRow>
          <PhoneIcon />
          <PhoneText>{phone}</PhoneText>
        </InfoRow>
      </InfoContent>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 36px;
  overflow: hidden;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 358px;
`;

const InfoContent = styled.div`
  padding: 30px;
`;

const TypeText = styled.p`
  font-family: 'Pretendard';
  font-size: 16px;
  color: #767676;
  margin-bottom: 5px;
`;

const FacilityName = styled.h2`
  font-family: 'Pretendard';
  font-weight: 600;
  font-size: 32px;
  color: #111111;
  margin-bottom: 20px;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: #767676;
  margin: 20px 0;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
`;

const LocationIcon = styled.div`
  width: 12px;
  height: 16px;
  background: #111111;
  // 실제 아이콘으로 교체 필요
`;

const AddressText = styled.p`
  font-family: 'Pretendard';
  font-size: 16px;
  color: #111111;
`;

const StatusDot = styled.div<{ status: 'open' | 'closed' }>`
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: ${(props) => (props.status === 'open' ? '#00AB75' : '#FF4D4D')};
`;

const StatusText = styled.p<{ status: 'open' | 'closed' }>`
  font-family: 'Pretendard';
  font-weight: 600;
  font-size: 16px;
  color: ${(props) => (props.status === 'open' ? '#00AB75' : '#FF4D4D')};
`;

const PhoneIcon = styled.div`
  width: 13px;
  height: 13px;
  background: #111111;
  // 실제 아이콘으로 교체 필요
`;

const PhoneText = styled.p`
  font-family: 'Pretendard';
  font-size: 16px;
  color: #111111;
`;
