import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const title = searchParams.get('title') || 'Blog Post';
    const date = searchParams.get('date');
    const readingTime = searchParams.get('readingTime');
    const author = 'Abderrahman Cheddir';

    // Load Space Grotesk fonts
    const fontBold = await readFile(join(process.cwd(), 'app/api/og/fonts/space-grotesk-bold.ttf'));
    const fontRegular = await readFile(join(process.cwd(), 'app/api/og/fonts/space-grotesk-regular.ttf'));

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            fontFamily: '"Space Grotesk", system-ui, sans-serif',
          }}
        >
          {/* Gradient Background */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f1e 100%)',
              display: 'flex',
            }}
          />

          {/* Decorative gradient orbs */}
          <div
            style={{
              position: 'absolute',
              top: '-20%',
              right: '-10%',
              width: '600px',
              height: '600px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)',
              display: 'flex',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-20%',
              left: '-10%',
              width: '500px',
              height: '500px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(147, 51, 234, 0.2) 0%, transparent 70%)',
              display: 'flex',
            }}
          />

          {/* Author name - top left */}
          <div
            style={{
              position: 'absolute',
              top: 50,
              left: 60,
              fontSize: 28,
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: 700,
              display: 'flex',
              letterSpacing: '-0.02em',
            }}
          >
            {author}
          </div>

          {/* Glass Card Container */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '90%',
              maxWidth: '1000px',
              padding: '60px 70px',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.06))',
              borderRadius: '32px',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 20px 60px 0 rgba(0, 0, 0, 0.5)',
            }}
          >
            {/* Title */}
            <div
              style={{
                fontSize: 68,
                fontWeight: 700,
                color: '#ffffff',
                lineHeight: 1.15,
                display: 'flex',
                letterSpacing: '-0.03em',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
              }}
            >
              {title}
            </div>

            {/* Metadata - Date and Reading Time */}
            {(date || readingTime) && (
              <div
                style={{
                  display: 'flex',
                  gap: 32,
                  fontSize: 26,
                  color: 'rgba(255, 255, 255, 0.75)',
                  marginTop: 40,
                  fontWeight: 500,
                }}
              >
                {date && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ display: 'flex' }}>📅</span>
                    <span style={{ display: 'flex' }}>{date}</span>
                  </div>
                )}
                {readingTime && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ display: 'flex' }}>⏱️</span>
                    <span style={{ display: 'flex' }}>{readingTime} min read</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Site Name - bottom right */}
          <div
            style={{
              position: 'absolute',
              bottom: 50,
              right: 60,
              fontSize: 30,
              color: 'rgba(255, 255, 255, 0.6)',
              fontWeight: 600,
              display: 'flex',
              letterSpacing: '-0.01em',
            }}
          >
            acheddir.com
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Space Grotesk',
            data: fontBold,
            style: 'normal',
            weight: 700,
          },
          {
            name: 'Space Grotesk',
            data: fontRegular,
            style: 'normal',
            weight: 400,
          },
        ],
      }
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response(`Failed to generate image: ${error}`, { status: 500 });
  }
}
