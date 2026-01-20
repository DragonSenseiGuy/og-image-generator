import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

const ALLOWED_DOMAINS = [
  'dragonsenseiguy.dev',
  'dragonsenseiguydev.vercel.app',
  'localhost',
];

export default function handler(req: Request) {
  const referer = req.headers.get('referer') || '';
  const origin = req.headers.get('origin') || '';
  
  const isAllowed = ALLOWED_DOMAINS.some(domain => 
    referer.includes(domain) || origin.includes(domain)
  ) || !referer;
  
  if (!isAllowed) {
    return new Response('Unauthorized', { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') || 'DragonSenseiGuy';

  return new ImageResponse(
    {
      type: 'div',
      props: {
        style: {
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #F1915E 0%, #DDA080 40%, #DFAE79 70%, #EBE3F0 100%)',
          fontFamily: 'monospace',
        },
        children: {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#2a1a10',
              border: '6px solid #4a3020',
              borderRadius: '24px',
              padding: '60px 80px',
              maxWidth: '1000px',
              boxShadow: '0 20px 60px rgba(42, 26, 16, 0.5)',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: 64,
                    fontWeight: 700,
                    color: '#DFAE79',
                    textAlign: 'center',
                    lineHeight: 1.2,
                    marginBottom: '30px',
                  },
                  children: title,
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    width: '200px',
                    height: '4px',
                    background: 'linear-gradient(90deg, transparent, #DFAE79, transparent)',
                    marginBottom: '30px',
                  },
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: 28,
                    color: '#EBE3F0',
                    opacity: 0.9,
                  },
                  children: 'dragonsenseiguy.dev',
                },
              },
            ],
          },
        },
      },
    },
    {
      width: 1200,
      height: 630,
    }
  );
}
