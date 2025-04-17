import React from 'react';
import styled from 'styled-components';

const Container = styled.section`
  width: 100%;
  height: 968px;
  background-color: #f2f2f2;
  padding: 120px 320px;
`;

const SectionTitle = styled.div`
  margin-bottom: 48px;

  span {
    font-family: 'Pretendard';
    font-size: 16px;
    color: #767676;
    display: block;
    margin-bottom: 4px;
  }

  h2 {
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 44px;
    color: #000000;
    margin: 0;
  }
`;

const NewsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
`;

const NewsCard = styled.div`
  background: #ffffff;
  border-radius: 24px;
  overflow: hidden;
`;

const NewsImage = styled.div`
  width: 100%;
  height: 240px;
  background-color: #e0e0e0;
`;

const NewsContent = styled.div`
  padding: 24px;
`;

const NewsDate = styled.span`
  font-family: 'Pretendard';
  font-size: 14px;
  color: #767676;
  display: block;
  margin-bottom: 8px;
`;

const NewsTitle = styled.h3`
  font-family: 'Pretendard';
  font-weight: 600;
  font-size: 24px;
  color: #000000;
  margin: 0;
  margin-bottom: 16px;
`;

const NewsDescription = styled.p`
  font-family: 'Pretendard';
  font-size: 16px;
  line-height: 24px;
  color: #767676;
  margin: 0;
`;

const NewsSection: React.FC = () => {
  return (
    <Container>
      <SectionTitle>
        <span>News</span>
        <h2>지이 소식</h2>
      </SectionTitle>

      <NewsGrid>
        <NewsCard>
          <NewsImage />
          <NewsContent>
            <NewsDate>2024.03.15</NewsDate>
            <NewsTitle>수소충전소 안전관리 시스템 고도화 완료</NewsTitle>
            <NewsDescription>
              지이는 전국 수소충전소의 안전관리 시스템을 고도화하여 더욱
              안전하고 효율적인 운영이 가능해졌습니다.
            </NewsDescription>
          </NewsContent>
        </NewsCard>

        <NewsCard>
          <NewsImage />
          <NewsContent>
            <NewsDate>2024.03.10</NewsDate>
            <NewsTitle>강원도 수소 모빌리티 확대 사업 참여</NewsTitle>
            <NewsDescription>
              강원도의 수소 모빌리티 인프라 구축 사업에 참여하여 친환경 교통
              체계 구축에 기여하게 되었습니다.
            </NewsDescription>
          </NewsContent>
        </NewsCard>

        <NewsCard>
          <NewsImage />
          <NewsContent>
            <NewsDate>2024.03.05</NewsDate>
            <NewsTitle>수소 에너지 기술 혁신 포럼 개최</NewsTitle>
            <NewsDescription>
              수소 에너지 산업의 발전 방향과 기술 혁신에 대한 논의의 장을
              마련했습니다.
            </NewsDescription>
          </NewsContent>
        </NewsCard>
      </NewsGrid>
    </Container>
  );
};

export default NewsSection;
