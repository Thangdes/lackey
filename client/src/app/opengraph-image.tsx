import { ImageResponse } from 'next/og';
import { siteConfig } from '@/constant/site';

export const runtime = 'edge';

export const alt = siteConfig.name;
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 80,
          background: 'linear-gradient(135deg, #229090 0%, #1a7070 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 'bold',
          padding: '60px',
        }}
      >
        <div style={{ fontSize: 100, marginBottom: 20 }}>
          {siteConfig.name}
        </div>
        <div
          style={{
            fontSize: 40,
            fontWeight: 'normal',
            textAlign: 'center',
            maxWidth: '80%',
            opacity: 0.9,
          }}
        >
          {siteConfig.slogan}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
