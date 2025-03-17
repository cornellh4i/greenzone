import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const InsightsDesc: React.FC = () => {
  return (
    <Box sx={{ backgroundColor: '#F3F4F6', pt: 8 }}>
      <Container maxWidth="xl">
        <Box
          sx={{
            borderRadius: 2,
            p: { xs: 3, md: 6 },
          }}
        >
          <Box
            sx={{
              display: { xs: 'flex', md: 'none' },
              flexDirection: 'column',
              gap: 3,
            }}
          >
            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  color: '#6B7280',
                  fontWeight: 500,
                  mb: 1,
                }}
              >
                content
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  color: '#111827',
                  fontWeight: 800,
                  mb: 2,
                }}
              >
                Insights
              </Typography>
            </Box>

            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Box
                component="img"
                src="/mountain.png"
                alt="Mountain Scene"
                onError={(e) => {
                  console.error('Image failed to load');
                  console.log('Image path:', e.currentTarget.src);
                }}
                sx={{
                  width: '100%',
                  maxWidth: '500px',
                  height: 'auto',
                  borderRadius: 2,
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                }}
              />
            </Box>

            <Box>
              <Typography
                variant="h5"
                sx={{
                  color: '#111827',
                  fontWeight: 600,
                  mb: 3,
                }}
              >
                How to interpret our data
              </Typography>
              <Typography
                sx={{
                  color: '#4B5563',
                  fontSize: '1.125rem',
                  lineHeight: 1.7,
                }}
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'row',
              gap: 8,
              alignItems: 'center',
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  color: '#6B7280',
                  fontWeight: 500,
                  mb: 1,
                }}
              >
                content
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  color: '#111827',
                  fontWeight: 800,
                  mb: 2,
                }}
              >
                Insights
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: '#111827',
                  fontWeight: 600,
                  mb: 3,
                }}
              >
                How to interpret our data
              </Typography>
              <Typography
                sx={{
                  color: '#4B5563',
                  fontSize: '1.125rem',
                  lineHeight: 1.7,
                }}
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.
              </Typography>
            </Box>

            <Box
              sx={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Box
                component="img"
                src="/mountain.png"
                alt="Mountain Scene"
                onError={(e) => {
                  console.error('Image failed to load');
                  console.log('Image path:', e.currentTarget.src);
                }}
                sx={{
                  width: '100%',
                  maxWidth: '500px',
                  height: 'auto',
                  borderRadius: 2,
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                }}
              />
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default InsightsDesc;