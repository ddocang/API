import React from 'react';
import styled from 'styled-components';

const Container = styled.footer`
  width: 100%;
  background-color: #111111;
  padding: clamp(40px, 4.17vw, 80px) clamp(1rem, 8.33vw, 160px);
  color: #ffffff;
  user-select: none;

  @media (max-width: 1024px) {
    padding: 2rem 1rem;
  }
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: center;
  gap: 40rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const LogoSection = styled.div`
  width: 320px;
  flex: 0 0 320px;
  .logo-wrapper {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
    height: 24px;

    img {
      width: clamp(40px, 3.125vw, 60px);
      height: auto;
      object-fit: contain;
    }

    span {
      font-family: 'Pretendard';
      font-size: clamp(14px, 0.83vw, 16px);
      font-weight: 600;
      color: #ffffff;
    }
  }

  p {
    font-family: 'Pretendard';
    font-size: clamp(12px, 0.73vw, 14px);
    line-height: 1.5;
    color: #767676;
    margin: 0;
  }
`;

const MenuSection = styled.div`
  width: 320px;
  flex: 0 0 320px;
  display: flex;
  justify-content: space-between;
  gap: clamp(24px, 2.5vw, 48px);

  @media (max-width: 768px) {
    gap: 1.5rem;
    flex-wrap: wrap;
  }
`;

const MenuColumn = styled.div`
  h3 {
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: clamp(14px, 0.83vw, 16px);
    color: #ffffff;
    margin: 0;
    margin-bottom: 1rem;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      margin-bottom: 0.75rem;

      a {
        font-family: 'Pretendard';
        font-size: clamp(12px, 0.73vw, 14px);
        color: #767676;
        text-decoration: none;
        transition: color 0.2s;

        &:hover {
          color: #ffffff;
        }
      }
    }
  }
`;

const AddressSpan = styled.span`
  white-space: nowrap;
`;

const Footer: React.FC = () => {
  return (
    <Container>
      <FooterContent>
        <LogoSection>
          <div className="logo-wrapper">
            <img src="/images/ge_logo.png" alt="GE Logo" />
            <span>(주)지이</span>
          </div>
          <p>
            <AddressSpan>
              본사 : 경기도 광명시 덕안로104번길 17 (광명역 엠클러스터 1306~7호)
            </AddressSpan>
            <br />
            <AddressSpan>
              지사 : 강원도 삼척시 언장1길 27 에너지방재지원센터 208호
            </AddressSpan>
            <br />
            전화 : 02-6335-0416
            <br />
            팩스 : 02-6335-0422
            <br />
            메일 : ge@ge-enov.com
          </p>
        </LogoSection>

        <MenuSection>
          <MenuColumn>
            <h3>회사소개</h3>
            <ul>
              <li>
                <a href="#">기업정보</a>
              </li>
              <li>
                <a href="#">연혁</a>
              </li>
              <li>
                <a href="#">오시는 길</a>
              </li>
            </ul>
          </MenuColumn>

          <MenuColumn>
            <h3>사업영역</h3>
            <ul>
              <li>
                <a href="#">수소충전소</a>
              </li>
              <li>
                <a href="#">안전관리시스템</a>
              </li>
              <li>
                <a href="#">수소 모빌리티</a>
              </li>
            </ul>
          </MenuColumn>

          <MenuColumn>
            <h3>고객지원</h3>
            <ul>
              <li>
                <a href="#">공지사항</a>
              </li>
              <li>
                <a href="#">문의하기</a>
              </li>
              <li>
                <a href="#">자료실</a>
              </li>
            </ul>
          </MenuColumn>
        </MenuSection>
      </FooterContent>
    </Container>
  );
};

export default Footer;
