import React from 'react';
import NavBar from "../components/molecules/NavBar";
import Footer from "../components/molecules/Footer";
import {Button, Typography, Box, useTheme, useMediaQuery, Paper, Link} from '@mui/material';

const Methodology = () => {
  return (
    <div>
    <NavBar/>
      <section className="w-[1600px] mx-auto flex flex-col gap-[140px]">
          <Box sx={{ backgroundColor: 'white', py: { xs: 6, md: 10 } }}>
            <Box
              sx={{
                mx: 'auto',
                px: 2,
                maxWidth: 'lg',
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 18,
                alignItems: 'center',
              }}
            >
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h4" fontWeight="bold">
                  Methodologies
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  About our data
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.
                </Typography>
              </Box>
      
              <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                <Box component="img"
                  src="/horse.png"
                  alt="People riding a horse with birds on their hands"
                  sx={{ width: '100%', height: 'auto', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}/>
              </Paper>
            </Box>
          </Box>
          </section>


      <section className="w-[1600px] mx-auto flex flex-col gap-[140px]">
          <Box sx={{ mx: 'auto', px: 2, maxWidth: 'lg' }}>
            <Typography variant="h5" fontWeight="bold" sx={{ py: 2 }}>
              Additional Information
            </Typography>
          </Box>
        <section className="w-full h-fit">
          <Box sx={{ py: 1, backgroundColor: 'white' }}>
            <Box
              sx={{
                mx: 'auto',
                px: 2,
                maxWidth: 'lg',
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 3fr' },
                gap: 4,
                alignItems: 'center',
              }}
            >
              <Paper elevation={0} sx={{ bgcolor: 'transparent' }}>
                <Box
                  component="img"
                  src="/camel.png"
                  alt="a camel"
                  sx={{
                    width: '100%',
                    height: { xs: 80, sm: 150, md: 150 },
                    objectFit: 'cover',
                    objectPosition: 'center',
                    borderRadius: 3,
                  }}
                />
              </Paper>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="subtitle2" fontWeight="medium" sx={{ color: 'black', mb: -1 }}>
                  Nov. 20, 2024
                </Typography>
                <Typography variant="h6" fontWeight="bold" sx={{ color: 'black' }}>
                  Article Title
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor. Dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.
                </Typography>
                <Button
                  variant="outlined"
                  color="success"
                  sx={{ width: '120px', borderRadius: '12px', textTransform: 'none', color: 'success.main', borderColor: 'success.main', mt: 1 }}
                >
                  Read more
                </Button>
              </Box>
            </Box>
          </Box>
        </section>


        <section className="w-full h-fit">
          <Box sx={{ py: 3, backgroundColor: 'white' }}>
            <Box
              sx={{
                mx: 'auto',
                px: 2,
                maxWidth: 'lg',
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 3fr' },
                gap: 4,
                alignItems: 'center',
              }}
            >
              <Paper elevation={0} sx={{ bgcolor: 'transparent' }}>
                <Box
                  component="img"
                  src="/camel.png"
                  alt="a camel"
                  sx={{
                    width: '100%',
                    height: { xs: 80, sm: 150, md: 150 },
                    objectFit: 'cover',
                    objectPosition: 'center',
                    borderRadius: 3,
                  }}
                />
              </Paper>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="subtitle2" fontWeight="medium" sx={{ color: 'black', mb: -1 }}>
                  Nov. 20, 2024
                </Typography>
                <Typography variant="h6" fontWeight="bold" sx={{ color: 'black' }}>
                  Article Title
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor. Dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.
                </Typography>
                <Button
                  variant="outlined"
                  color="success"
                  sx={{ width: '120px', borderRadius: '12px', textTransform: 'none', color: 'success.main', borderColor: 'success.main', mt: 1 }}
                >
                  Read more
                </Button>
              </Box>
            </Box>
          </Box>
        </section>
        <section className="w-full h-fit">
          <Box sx={{ py: 3, backgroundColor: 'white'}}>
            <Box
              sx={{
                mx: 'auto',
                px: 2,
                maxWidth: 'lg',
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 3fr' },
                gap: 4,
                alignItems: 'center',
              }}
            >
              <Paper elevation={0} sx={{ bgcolor: 'transparent' }}>
                <Box
                  component="img"
                  src="/camel.png"
                  alt="a camel"
                  sx={{
                    width: '100%',
                    height: { xs: 80, sm: 150, md: 150 },
                    objectFit: 'cover',
                    objectPosition: 'center',
                    borderRadius: 3,
                  }}
                />
              </Paper>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1,}}>
                <Typography variant="subtitle2" fontWeight="medium" sx={{ color: 'black', mb: -1 }}>
                  Nov. 20, 2024
                </Typography>
                <Typography variant="h6" fontWeight="bold" sx={{ color: 'black' }}>
                  Article Title
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor. Dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.
                </Typography>
                <Button
                  variant="outlined"
                  color="success"
                  sx={{ width: '120px', borderRadius: '12px', textTransform: 'none', color: 'success.main', borderColor: 'success.main', mt: 1 }}
                >
                  Read more
                </Button>
              </Box>
            </Box>
          </Box>
        </section>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mt: 4, mb: 20}}>
          <Typography variant="body2" color="text.primary">
            &#8249;
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Page 1 of 3
          </Typography>
          <Typography variant="body2" color="text.primary">
            &#8250;
          </Typography>
        </Box>
      </section>
    <Footer />
    </div>

  );
};

export default Methodology;