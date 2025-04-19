import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');

  // ✅ 환경변수 로그 찍기
  console.log(
    '💡 NEXT_PUBLIC_NCP_CLIENT_ID:',
    process.env.NEXT_PUBLIC_NCP_CLIENT_ID ?? 'undefined'
  );
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

  if (
    !process.env.NEXT_PUBLIC_NCP_CLIENT_ID ||
    !process.env.NCP_CLIENT_SECRET
  ) {
    console.error('Naver Cloud Platform API 키가 설정되지 않았습니다.');
    return NextResponse.json(
      { error: 'API 키 설정이 누락되었습니다.' },
      { status: 500 }
    );
  }

  try {
    const encodedQuery = encodeURIComponent(query);
    const apiUrl = `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodedQuery}`;

    console.log('요청 URL:', apiUrl);

    const response = await fetch(apiUrl, {
      headers: {
        'X-NCP-APIGW-API-KEY-ID': process.env.NEXT_PUBLIC_NCP_CLIENT_ID,
        'X-NCP-APIGW-API-KEY': process.env.NCP_CLIENT_SECRET,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Naver API 응답 에러:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });

      return NextResponse.json(
        {
          error: 'Geocoding API 요청 실패',
          details: {
            status: response.status,
            statusText: response.statusText,
          },
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Geocoding 에러:', error);
    return NextResponse.json(
      {
        error: 'Geocoding 처리 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
