const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { Resvg } = require('@resvg/resvg-js');

let satori;

const PORT = 6000;

// Load font at startup
const archivoBlack = fs.readFileSync(path.join(__dirname, 'fonts', 'ArchivoBlack-Regular.ttf'));
const courierPrime = fs.readFileSync(path.join(__dirname, 'fonts', 'CourierPrime-Regular.ttf'));

async function generateOgImage(params) {
  const title = params.get('title') || 'Aditya';
  const type = params.get('type') || 'page';
  const date = params.get('date') || '';
  const tags = params.get('tags') || '';
  const description = params.get('description') || '';

  const isPost = type === 'post';
  const tagList = tags ? tags.split(',').slice(0, 3) : [];

  const element = {
    type: 'div',
    props: {
      style: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#000',
        fontFamily: 'Courier Prime',
        position: 'relative',
        overflow: 'hidden',
      },
      children: [
        // Background watermark
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              right: '-40px',
              bottom: '-60px',
              fontSize: '320px',
              fontFamily: 'Archivo Black',
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
                          fontSize: 24,
                          fontFamily: 'Archivo Black',
                          fontWeight: 700,
                          color: '#FFF',
                          textTransform: 'uppercase',
                          letterSpacing: '4px',
                          marginBottom: '20px',
                          background: '#FF0000',
                          padding: '12px 28px',
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
                    fontSize: isPost ? 80 : 84,
                    fontFamily: 'Archivo Black',
                    fontWeight: 900,
                    color: '#FFF',
                    textTransform: 'uppercase',
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
                          fontSize: 32,
                          color: '#F2F0EB',
                          opacity: 0.7,
                          lineHeight: 1.4,
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
                          flexWrap: 'wrap',
                        },
                        children: [
                          ...(date
                            ? [
                                {
                                  type: 'div',
                                  props: {
                                    style: {
                                      fontSize: 26,
                                      color: '#F2F0EB',
                                      opacity: 0.5,
                                      letterSpacing: '2px',
                                      textTransform: 'uppercase',
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
                          ...tagList.map((tag) => ({
                            type: 'div',
                            props: {
                              style: {
                                fontSize: 24,
                                fontFamily: 'Archivo Black',
                                color: '#FF0000',
                                border: '2px solid rgba(255, 0, 0, 0.4)',
                                padding: '6px 16px',
                                textTransform: 'uppercase',
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
                    fontSize: 28,
                    fontFamily: 'Archivo Black',
                    fontWeight: 900,
                    color: '#FFF',
                    textTransform: 'uppercase',
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
  };

  const svg = await satori(element, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: 'Archivo Black',
        data: archivoBlack,
        weight: 900,
        style: 'normal',
      },
      {
        name: 'Courier Prime',
        data: courierPrime,
        weight: 400,
        style: 'normal',
      },
    ],
  });

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 },
  });
  return resvg.render().asPng();
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (url.pathname !== '/api/og') {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  try {
    const png = await generateOgImage(url.searchParams);
    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    });
    res.end(png);
  } catch (err) {
    console.error('OG generation error:', err);
    res.writeHead(500);
    res.end('Internal server error');
  }
});

async function start() {
  satori = (await import('satori')).default;
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`OG image server running on port ${PORT}`);
  });
}

start();
