import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');

  // ✅ 환경변수 로그 찍기
  console.log('💡 NCP_CLIENT_ID:', process.env.NCP_CLIENT_ID ?? 'undefined');
  console.log(
    '💡 NCP_CLIENT_SECRET:',
    process.env.NCP_CLIENT_SECRET ?? 'undefined'
  );

  if (!query) {
    return NextResponse.json(
      { error: '검색어가 필요합니다.' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodeURIComponent(
        query
      )}`,
      {
        headers: {
          'X-NCP-APIGW-API-KEY-ID': process.env.NCP_CLIENT_ID!,
          'X-NCP-APIGW-API-KEY': process.env.NCP_CLIENT_SECRET!,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Geocoding API 요청 실패');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Geocoding 에러:', error);
    return NextResponse.json(
      { error: 'Geocoding 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
