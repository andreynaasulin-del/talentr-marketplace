import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Talentr - Event Marketplace';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
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
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                    fontFamily: 'system-ui, sans-serif',
                }}
            >
                {/* Background Pattern */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                    }}
                />

                {/* Logo Circle */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 120,
                        height: 120,
                        borderRadius: 60,
                        background: 'white',
                        marginBottom: 40,
                        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                    }}
                >
                    <span style={{ fontSize: 60, fontWeight: 900, color: '#667eea' }}>T</span>
                </div>

                {/* Title */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <h1
                        style={{
                            fontSize: 72,
                            fontWeight: 900,
                            color: 'white',
                            margin: 0,
                            textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                        }}
                    >
                        Talentr
                    </h1>
                    <p
                        style={{
                            fontSize: 28,
                            color: 'rgba(255,255,255,0.9)',
                            marginTop: 16,
                        }}
                    >
                        Find the Best Event Professionals in Israel
                    </p>
                </div>

                {/* Stats */}
                <div
                    style={{
                        display: 'flex',
                        gap: 60,
                        marginTop: 60,
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span style={{ fontSize: 36, fontWeight: 800, color: 'white' }}>500+</span>
                        <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)' }}>Verified Pros</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span style={{ fontSize: 36, fontWeight: 800, color: 'white' }}>10K+</span>
                        <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)' }}>Events</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span style={{ fontSize: 36, fontWeight: 800, color: 'white' }}>4.9</span>
                        <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)' }}>Avg Rating</span>
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
