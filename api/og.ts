import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

const ALLOWED_DOMAINS = [
  'adityan.dev',
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
  const title = searchParams.get('title') || 'Aditya';
  const type = searchParams.get('type') || 'page';
  const date = searchParams.get('date') || '';
  const tags = searchParams.get('tags') || '';
  const description = searchParams.get('description') || '';

  const isPost = type === 'post';
  const tagList = tags ? tags.split(',').slice(0, 3) : [];

  return new ImageResponse(
    {
      type: 'div',
      props: {
        style: {
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#000',
          fontFamily: 'monospace',
          position: 'relative',
          overflow: 'hidden',
        },
        children: [
          // Large background watermark
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                right: '-40px',
                bottom: '-60px',
                fontSize: '320px',
                fontWeight: 900,
                color: 'rgba(255, 0, 0, 0.06)',
                lineHeight: 0.8,
                letterSpacing: '-10px',
              },
              children: 'AD',
            },
          },
          // Red accent bar at top
          {
            type: 'div',
            props: {
              style: {
                width: '100%',
                height: '8px',
                background: '#FF0000',
              },
            },
          },
          // Main content
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                flex: 1,
                padding: '60px 80px',
              },
              children: [
                // Post badge
                ...(isPost
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: {
                            fontSize: 14,
                            fontWeight: 700,
                            color: '#FFF',
                            textTransform: 'uppercase' as const,
                            letterSpacing: '4px',
                            marginBottom: '20px',
                            background: '#FF0000',
                            padding: '8px 20px',
                            alignSelf: 'flex-start',
                          },
                          children: 'Blog Post',
                        },
                      },
                    ]
                  : []),
                // Title
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: isPost ? 52 : 72,
                      fontWeight: 900,
                      color: '#FFF',
                      textTransform: 'uppercase' as const,
                      lineHeight: 0.95,
                      letterSpacing: '-2px',
                      marginBottom: '24px',
                    },
                    children: title,
                  },
                },
                // Description (for blog posts)
                ...(isPost && description
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: {
                            fontSize: 20,
                            color: '#F2F0EB',
                            opacity: 0.7,
                            lineHeight: 1.5,
                            maxWidth: '700px',
                            borderLeft: '4px solid #FF0000',
                            paddingLeft: '16px',
                            marginBottom: '24px',
                          },
                          children: description.length > 120 ? description.slice(0, 120) + '…' : description,
                        },
                      },
                    ]
                  : []),
                // Date + Tags row
                ...(isPost && (date || tagList.length > 0)
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            flexWrap: 'wrap' as const,
                          },
                          children: [
                            ...(date
                              ? [
                                  {
                                    type: 'div',
                                    props: {
                                      style: {
                                        fontSize: 16,
                                        color: '#F2F0EB',
                                        opacity: 0.5,
                                        letterSpacing: '2px',
                                        textTransform: 'uppercase' as const,
                                      },
                                      children: date,
                                    },
                                  },
                                ]
                              : []),
                            ...(date && tagList.length > 0
                              ? [
                                  {
                                    type: 'div',
                                    props: {
                                      style: {
                                        width: '3px',
                                        height: '3px',
                                        borderRadius: '50%',
                                        background: '#FF0000',
                                      },
                                    },
                                  },
                                ]
                              : []),
                            ...tagList.map((tag: string) => ({
                              type: 'div',
                              props: {
                                style: {
                                  fontSize: 14,
                                  color: '#FF0000',
                                  border: '2px solid rgba(255, 0, 0, 0.4)',
                                  padding: '4px 12px',
                                  textTransform: 'uppercase' as const,
                                  letterSpacing: '2px',
                                },
                                children: tag.trim(),
                              },
                            })),
                          ],
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
          // Bottom bar
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px 80px',
                borderTop: '4px solid #FF0000',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: 22,
                      fontWeight: 900,
                      color: '#FFF',
                      textTransform: 'uppercase' as const,
                      letterSpacing: '4px',
                    },
                    children: 'adityan.dev',
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
    }
  );
}
