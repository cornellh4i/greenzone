import React from 'react';
import NavBar from "../components/molecules/NavBar";
import {Button, Typography, Box, useTheme, useMediaQuery, Paper, Link} from '@mui/material';
import { useRouter } from 'next/router'; 
import Footer from '@/components/molecules/Footer';

const Landing : React.FC = () => {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <div>
    <NavBar />
      <div className="w-full flex flex-col gap-[300px]">
      {/* Hero Section */}
    <section className="w-[1600px] mx-auto flex flex-col gap-[140px]">
    <Box sx={{ backgroundColor: 'grey.100', py: { xs: 6, md: 10 } }}>
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
            Visualizing Mongolian rangeland health
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.
          </Typography>
          <Button
            variant="contained"
            sx={{
              bgcolor: '#065143',
              borderRadius: '12px',
              '&:hover': { bgcolor: '#043F33' },
              color: 'white',
              textTransform: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 1, 
              paddingX: 2,
              paddingY: 1,
              width: '40%',
              
            }} onClick = {() => handleNavigate('/monitoring-platform')}
            >
              Launch Platform
            <img
              src="/launch_icon.png"
              alt="icon"
              style={{ width: 20, height: 20 }}
            />
          </Button>
        </Box>

        <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
          <Box component="img"
            src="/countrymap.png"
            alt="country map"
            sx={{ width: '100%', height: 'auto', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}/>
        </Paper>
      </Box>
    </Box>
    </section>

    {/* A Product For Section */}
    <Box sx={{ py: 10, backgroundColor: 'white' }}>
  <Box
    sx={{
      maxWidth: '1200px',
      mx: 'auto',
      px: 2,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8,
    }}
  >
    <Typography
      variant="h6"
      sx={{
        fontSize: '24px',
        fontWeight: '600',
        color: '#000000',
        textAlign: 'center',
      }}
    >
      A product for...
    </Typography>

    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'center',
        gap: { xs: 6, md: 8 },
        width: '100%',
        flexWrap: 'wrap',
      }}
    >
      {/* Herders */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: 300,
          mx: 'auto',
        }}
      >
        <Box
          component="img"
          src="/cow.png"
          alt="Herders"
          sx={{ width: 64, height: 64, mb: 2 }}
        />
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#065143' }}>
          Herders
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.
        </Typography>
      </Box>

      {/* Risk Analysts */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: 300,
          mx: 'auto',
        }}
      >
        <Box
          component="img"
          src="/graph.png"
          alt="Risk Analysts"
          sx={{ width: 64, height: 64, mb: 2 }}
        />
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#065143' }}>
          Risk Analysts
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.
        </Typography>
      </Box>

      {/* Policymakers */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: 300,
          mx: 'auto',
        }}
      >
        <Box
          component="img"
          src="/pencil.png"
          alt="Policymakers"
          sx={{ width: 64, height: 64, mb: 2 }}
        />
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#065143' }}>
          Policymakers
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.
        </Typography>
      </Box>
    </Box>
  </Box>
</Box>
    {/* About Section */}
    <section className="w-full h-fit">
      <Box sx={{ py: 8, backgroundColor: '#E6EEEC' }}>
      <Box sx={{ mx: 'auto', px: 2, maxWidth: 'lg', display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4, alignItems: 'center' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h4" fontWeight="bold">
            About Us
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor. Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.
          </Typography>
          <Button variant="outlined" color="success" sx={{ width: '150px', borderRadius: '12px', textTransform: 'none' }} onClick = {() => handleNavigate('/about')}>
            Learn more
          </Button>
        </Box>
        <Paper elevation={0} sx={{ bgcolor: 'transparent' }}>
        <Box sx={{ width: { xs: '100%', sm: '100%', md: '90%' }, mx: 'auto' }}>
            <Box
              component="img"
              src="/landscape.png"
              alt="mongolian landscape"
              sx={{
                width: '100%',
                aspectRatio: '16 / 9',
                objectFit: 'cover',
                objectPosition: 'center',
                borderRadius: 3,
              }}
            />
          </Box>
        </Paper>
      </Box>
      </Box>
    </section>

        
    <section className="w-full h-fit">
      <Box sx={{ py: 8, backgroundColor: '#065143' }}>
        <Box
          sx={{
            mx: 'auto',
            px: 2,
            maxWidth: 'lg',
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 4,
            alignItems: 'center',
          }}
        >

          <Paper elevation={0} sx={{ bgcolor: 'transparent' }}>
            <Box sx={{ width: { xs: '100%', sm: '100%', md: '90%' }, mx: 'auto' }}>
              <Box
                component="img"
                src="/mountain.png"
                alt="mongolian mountains"
                sx={{
                  width: '100%',
                  aspectRatio: '16 / 9', // ensures clean scaling on all screen sizes
                  objectFit: 'cover',
                  objectPosition: 'center',
                  borderRadius: 3,
                }}
              />
            </Box>
          </Paper>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h4" fontWeight="bold" sx={{ color: 'white' }}>
              Data “at a glance”
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ color: 'white' }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor. Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.
            </Typography>
            <Button
              variant="outlined"
              color="success"
              sx={{ width: '150px', borderRadius: '12px', textTransform: 'none', color: 'white', borderColor: 'white'}} onClick = {() => handleNavigate('/summary-stats')}
            >
              Learn More
            </Button>
          </Box>

        </Box>
      </Box>
    </section>

      {/* Methodologies Section */}
      <section className="w-full h-fit">
      <Box sx={{ py: 8, backgroundColor: '#FFFFFF' }}>
      <Box sx={{ mx: 'auto', px: 2, maxWidth: 'lg', display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4, alignItems: 'center' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h4" fontWeight="bold">
            Our Methodologies
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor. Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.
          </Typography>
          <Button variant="outlined" color="success" sx={{ width: '150px', borderRadius: '12px', textTransform: 'none' }} onClick = {() => handleNavigate('/methodology')}>
            Learn More
          </Button>
        </Box>

        <Paper elevation={0} sx={{ bgcolor: 'transparent' }}>
          <Box sx={{ width: { xs: '100%', sm: '100%', md: '90%' }, mx: 'auto' }}>
            <Box
              component="img"
              src="/horse.png"
              alt="mongolians with horses"
              sx={{
                width: '100%',
                aspectRatio: '16 / 9',
                objectFit: 'cover',
                objectPosition: 'center',
                borderRadius: 3,
              }}
            />
          </Box>
      </Paper>
      </Box>
      </Box>
    </section>
    <Footer />
    </div>
    </div>
  );
};

export default Landing;
function useState<T>(initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const state = React.useState<T>(initialValue);
  return state;
}
