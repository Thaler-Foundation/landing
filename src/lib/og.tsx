import config from '@/config';
import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const ogSize = { width: 1200, height: 630 };

const asset = (path: string) => readFile(join(process.cwd(), path));
const dataUri = async (path: string, type: string) =>
  `data:${type};base64,${(await asset(path)).toString('base64')}`;

export async function renderOg({ title, description }: { title: string[]; description: string }) {
  const [medium, semibold, logo, arrow, texture] = await Promise.all([
    asset('src/assets/og/Poppins-Medium.ttf'),
    asset('src/assets/og/Poppins-SemiBold.ttf'),
    dataUri('public/logo.svg', 'image/svg+xml'),
    dataUri('public/cta-arrow.svg', 'image/svg+xml'),
    dataUri('src/assets/og/texture.png', 'image/png'),
  ]);

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: config.background,
        color: 'white',
        fontFamily: 'Poppins',
        fontWeight: 500,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '64px 80px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <img src={logo} width={187} height={44} alt="" />
          <span style={{ fontSize: 24, color: 'rgba(255,255,255,0.5)', letterSpacing: '-0.5px' }}>
            {config.domainName}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 'auto' }}>
          {title.map((line) => (
            <span key={line} style={{ fontSize: 104, lineHeight: 0.92, letterSpacing: '-6px' }}>
              {line}
            </span>
          ))}
          <span
            style={{
              marginTop: 28,
              fontSize: 32,
              color: 'rgba(255,255,255,0.6)',
              letterSpacing: '-1px',
            }}
          >
            {description}
          </span>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          position: 'relative',
          alignItems: 'center',
          height: 132,
          marginTop: 56,
          padding: '0 80px',
          gap: 20,
        }}
      >
        <img
          src={texture}
          width={1200}
          height={175}
          alt=""
          style={{ position: 'absolute', top: 0, left: 0 }}
        />
        <img src={arrow} width={36} height={36} alt="" />
        <span style={{ fontSize: 38, fontWeight: 600, letterSpacing: '-2px' }}>
          Join Early Access
        </span>
      </div>
    </div>,
    {
      ...ogSize,
      fonts: [
        { name: 'Poppins', data: medium, weight: 500, style: 'normal' },
        { name: 'Poppins', data: semibold, weight: 600, style: 'normal' },
      ],
    }
  );
}
