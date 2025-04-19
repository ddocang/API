import type { Metadata } from 'next';
import Script from 'next/script';
import StyledComponentsRegistry from '@/lib/registry';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'HyGE',
  description: 'Hydrogen platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <Script
          src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NCP_CLIENT_ID}&submodules=geocoder`}
          strategy="beforeInteractive"
        />
      </head>
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
