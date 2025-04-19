'use client';

export const runtime = 'edge';

import { useParams } from 'next/navigation';
import styled from '@emotion/styled';

export default function DetailPage() {
  const params = useParams();
  const id = params.id;

  return (
    <Container>
      <h1>시설 상세 정보 - ID: {id}</h1>
      {/* 상세 정보 컴포넌트들이 여기에 추가될 예정입니다 */}
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #f2f2f2;
  padding: 40px;
`;
