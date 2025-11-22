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
            position: 'relative',
            fontFamily: '"Space Grotesk", system-ui, sans-serif',
            background: '#0a0a0f',
          }}
        >
          {/* Grid Pattern Background */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: '#0a0a0f',
              display: 'flex',
            }}
          />
          <svg
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              height: '100%',
            }}
          >
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="rgba(6, 182, 212, 0.1)"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Gradient Overlays */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                'radial-gradient(circle at 20% 30%, rgba(6, 182, 212, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)',
              display: 'flex',
            }}
          />

          {/* Geometric Shapes */}
          <div
            style={{
              position: 'absolute',
              top: 60,
              right: 80,
              width: '120px',
              height: '120px',
              border: '3px solid rgba(6, 182, 212, 0.3)',
              transform: 'rotate(45deg)',
              display: 'flex',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 80,
              left: 100,
              width: '80px',
              height: '80px',
              border: '3px solid rgba(168, 85, 247, 0.3)',
              borderRadius: '50%',
              display: 'flex',
            }}
          />

          {/* Top Bar - Terminal Style */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '60px',
              background: 'linear-gradient(90deg, rgba(6, 182, 212, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)',
              borderBottom: '2px solid rgba(6, 182, 212, 0.4)',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '60px',
              paddingRight: '60px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: '#ef4444',
                  display: 'flex',
                }}
              />
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: '#f59e0b',
                  display: 'flex',
                }}
              />
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: '#10b981',
                  display: 'flex',
                }}
              />
            </div>
            <div
              style={{
                marginLeft: 'auto',
                fontSize: 18,
                color: 'rgba(6, 182, 212, 0.8)',
                fontWeight: 600,
                display: 'flex',
                fontFamily: 'monospace',
              }}
            >
              ~/blog/{author.toLowerCase().replace(' ', '-')}
            </div>
          </div>

          {/* Main Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              flex: 1,
              padding: '120px 80px 100px',
            }}
          >
            {/* Code Prompt Indicator */}
            <div
              style={{
                fontSize: 32,
                color: '#10b981',
                fontFamily: 'monospace',
                marginBottom: 30,
                display: 'flex',
              }}
            >
              $ cat blog-post.md
            </div>

            {/* Title */}
            <div
              style={{
                fontSize: 64,
                fontWeight: 700,
                color: '#ffffff',
                lineHeight: 1.15,
                display: 'flex',
                letterSpacing: '-0.025em',
                marginBottom: 40,
                textShadow: '0 0 40px rgba(6, 182, 212, 0.3)',
              }}
            >
              {title}
            </div>

            {/* Metadata Bar */}
            <div
              style={{
                display: 'flex',
                gap: 40,
                alignItems: 'center',
              }}
            >
              {date && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    fontSize: 22,
                    color: 'rgba(6, 182, 212, 0.9)',
                  }}
                >
                  <span
                    style={{
                      display: 'flex',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#06b6d4',
                    }}
                  />
                  <span style={{ display: 'flex' }}>{date}</span>
                </div>
              )}
              {readingTime && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    fontSize: 22,
                    color: 'rgba(168, 85, 247, 0.9)',
                  }}
                >
                  <span
                    style={{
                      display: 'flex',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#a855f7',
                    }}
                  />
                  <span style={{ display: 'flex' }}>{readingTime} min read</span>
                </div>
              )}
            </div>

            {/* Accent Line */}
            <div
              style={{
                marginTop: 50,
                height: '4px',
                width: '200px',
                background: 'linear-gradient(90deg, #06b6d4 0%, #a855f7 100%)',
                borderRadius: '2px',
                display: 'flex',
              }}
            />
          </div>

          {/* Bottom Bar - Domain */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '60px',
              background: 'linear-gradient(90deg, rgba(6, 182, 212, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)',
              borderTop: '2px solid rgba(6, 182, 212, 0.3)',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '80px',
              paddingRight: '80px',
            }}
          >
            <div
              style={{
                fontSize: 24,
                color: 'rgba(255, 255, 255, 0.7)',
                fontWeight: 600,
                display: 'flex',
              }}
            >
              acheddir.com
            </div>
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
