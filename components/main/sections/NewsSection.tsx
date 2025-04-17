import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';

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
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-4px);
  }
`;

const NewsImageContainer = styled.div`
  width: 100%;
  height: 240px;
  position: relative;
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
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const NewsDescription = styled.p`
  font-family: 'Pretendard';
  font-size: 16px;
  line-height: 24px;
  color: #767676;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const NewsSection: React.FC = () => {
  return (
    <Container>
      <SectionTitle>
        <span>News</span>
        <h2>지이 소식</h2>
      </SectionTitle>

      <NewsGrid>
        <NewsCard
          onClick={() =>
            window.open(
              'http://www.engjournal.co.kr/news/articleView.html?idxno=3220',
              '_blank'
            )
          }
        >
          <NewsImageContainer>
            <Image
              src="/images/news/news1.png"
              alt="수소안전플랫폼"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              style={{
                objectFit: 'cover',
                objectPosition: 'top center',
                backgroundColor: '#ffffff',
              }}
              priority
            />
          </NewsImageContainer>
          <NewsContent>
            <NewsDate>2025.04.11</NewsDate>
            <NewsTitle>
              '수소안전플랫폼' 통해, 실시간 감시·예지보전으로 수소 안전성
              강화한다
            </NewsTitle>
            <NewsDescription>
              지이(GE)는 강원테크노파크와 함께 차세대 수소안전플랫폼 개발에
              착수했다. 단순한 모니터링을 넘어 데이터를 기반으로 실시간 감시와
              예지보전을 가능하게 한 이 플랫폼은 수소 설비의 고장 위험을 사전에
              파악하고, 주민의 불안감을 해소하는 데 핵심 역할을 하게 될
              전망이다.
            </NewsDescription>
          </NewsContent>
        </NewsCard>

        <NewsCard
          onClick={() =>
            window.open(
              'https://www.energy-news.co.kr/news/articleView.html?idxno=212859',
              '_blank'
            )
          }
        >
          <NewsImageContainer>
            <Image
              src="/images/news/news2.png"
              alt="수소 트레일러 안전 모니터링"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              style={{
                objectFit: 'cover',
                objectPosition: 'top center',
                backgroundColor: '#ffffff',
              }}
              loading="lazy"
            />
          </NewsImageContainer>
          <NewsContent>
            <NewsDate>2025.04.17</NewsDate>
            <NewsTitle>수소 트레일러, 폭발 대신 '안전'을 싣는다</NewsTitle>
            <NewsDescription>
              강원테크노파크 에너지센터에서는 수소트레일러 안전장치 모니터링
              실증사업을 진행, 수소 튜브트레일러 사고 발생 미연 방지를 위한 방안
              모색에 나섰다. 충전-운송-활용 시 안전 모니터링 실증을 통해
              안전불감증 해소가 기대된다.
            </NewsDescription>
          </NewsContent>
        </NewsCard>

        <NewsCard
          onClick={() =>
            window.open(
              'http://www.engjournal.co.kr/news/articleView.html?idxno=3224',
              '_blank'
            )
          }
        >
          <NewsImageContainer>
            <Image
              src="/images/news/news3.png"
              alt="삼척시 CCUS 전략"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              style={{
                objectFit: 'cover',
                objectPosition: 'top center',
                backgroundColor: '#ffffff',
              }}
              priority
            />
          </NewsImageContainer>
          <NewsContent>
            <NewsDate>2025.04.15</NewsDate>
            <NewsTitle>
              삼척시, 수소산업 견인할 CCUS 전략 실행 모드 돌입
            </NewsTitle>
            <NewsDescription>
              삼척시는 CCUS 산업을 수소산업을 견인할 전략산업으로 판단하고
              본격적인 인프라 구축과 실증사업에 나서며 청정에너지 도시로의
              전환에 박차를 가하고 있다. 과학기술정보통신부의 'CCU 메가프로젝트'
              사업지로 선정되어 예비타당성조사 대상사업으로 확정되었다.
            </NewsDescription>
          </NewsContent>
        </NewsCard>
      </NewsGrid>
    </Container>
  );
};

export default NewsSection;
