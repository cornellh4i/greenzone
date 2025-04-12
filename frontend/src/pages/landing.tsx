import React from 'react';
import NavBar from "../components/molecules/NavBar";
import { AppBar, Toolbar, Button, Typography, Box, useTheme, useMediaQuery, Paper, MenuItem, Select, Link} from '@mui/material';
import { useRouter } from 'next/router'; 

const Landing : React.FC = () => {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'mn'>('en');
  const handleLanguageChange = (event: any) => {
    setSelectedLanguage(event.target.value);
  };
  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <div>
      <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{ backgroundColor: '#E6EEEC' }} 
      >
      <Toolbar sx={{ justifyContent: 'space-between'}}>
        <Typography variant="h6" component="div" sx={{
          color: '#065143', fontWeight: 'bold',
          fontSize: isMobile ? '24px' : '30px',
        }}>
          GreenZone Analytics
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: 2,
            backgroundColor: '#E6EEEC',
            padding: 1.5,
            borderRadius: 2,
            marginTop: isMobile ? 2 : 0,
            alignItems: 'center',
          }}
        >
        <Button variant="text" color="inherit"sx={{ textTransform: 'none', fontSize: '18px',}}>
            About
        </Button>
        <Button variant="text" color="inherit"sx={{ textTransform: 'none', fontSize: '18px', }} onClick={() => handleNavigate('/summary-stats')}>
          Insights
        </Button>
        <Button variant="text" color="inherit"sx={{ textTransform: 'none', fontSize: '18px',}}>
          Methodologies
        </Button>
        <Button
          variant="contained"
          sx={{
            bgcolor: '#065143',
            borderRadius: '12px',
            '&:hover': { bgcolor: '#043F33' },
            color: 'white',
            fontSize: '18px',
            textTransform: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 1, 
            paddingX: 2,
            paddingY: 1,
          }} onClick = {() => handleNavigate('/monitoring-platform')}
        >
          Launch
        <img
          src="/launch_icon.png"
          alt="icon"
          style={{ width: 20, height: 20 }}
        /> 
      </Button>
      <Box sx={{ minWidth: 160 }}>
            <Select
              value={selectedLanguage}
              onChange={handleLanguageChange}
              variant="standard"
              disableUnderline
              sx={{
                backgroundColor: '#E6EEEC',
                borderRadius: '12px',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '16px',
                paddingY: '4px',
                paddingX: '8px',
                '& .MuiSelect-icon': {
                  right: 10,
                },
              }}
              renderValue={() => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <img
                    src={`/flags_${selectedLanguage === 'en' ? 'en' : 'mn'}.png`}
                    width={20}
                    alt="flag"
                  />
                  <span>{selectedLanguage === 'en' ? 'EN' : 'MN'}</span>
                </Box>
              )}
            >
              <MenuItem value="en">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <img src="/flags_en.png" width={20} alt="EN" />
                  EN
                </Box>
              </MenuItem>
              <MenuItem value="mn">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <img src="/flags_mn.png" width={20} alt="MN" />
                  MN
                </Box>
              </MenuItem>
            </Select>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
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
            }}
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
          <Button variant="outlined" color="success" sx={{ width: '150px', borderRadius: '12px', textTransform: 'none' }}>
            Learn more
          </Button>
        </Box>

        <Paper elevation={0} sx={{ bgcolor: 'transparent' }}>
        <Box sx={{ width: { xs: '70%', sm: '70%', md: '90%' } }}>
        <Box
          component="img"
          src="/landscape.png"
          alt="mongolian landscape"
          sx={{
            width: '100%',
            height: { xs: 80, sm: 200, md: 300 },
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
          <Box sx={{ width: { xs: '70%', sm: '70%', md: '90%' } }}>
          <Box
            component="img"
            src="/mountain.png"
            alt="mongolian mountains"
            sx={{
              width: '100%',
              height: { xs: 80, sm: 200, md: 300 },
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
              sx={{ width: '150px', borderRadius: '12px', textTransform: 'none', color: 'white', borderColor: 'white'}}
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
          <Button variant="outlined" color="success" sx={{ width: '150px', borderRadius: '12px', textTransform: 'none' }}>
            Learn More
          </Button>
        </Box>

        <Paper elevation={0} sx={{ bgcolor: 'transparent' }}>
        <Box sx={{ width: { xs: '70%', sm: '70%', md: '90%' } }}>
        <Box
          component="img"
          src="/horse.png"
          alt="mongolians with horses"
          sx={{
            width: '100%',
            height: { xs: 80, sm: 200, md: 300 },
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

    {/*Footer Section*/}
    <Box component="footer" sx={{ backgroundColor: '#4E4E4E', color: 'white', py: 6 }}>
      <Box
        sx={{
          maxWidth: 'lg',
          mx: 'auto',
          px: 2,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4,
        }}
      >
        {/* Branding */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            GreenZone Analytics
          </Typography>
          <Typography variant="body2" sx={{ color: 'white' }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.
          </Typography>
        </Box>

        {/* Useful Links */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Useful Links
          </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0,}}>
              {[
                { href: '/', label: 'Home' },
                { href: '/about', label: 'About' },
                { href: '/insights', label: 'Insights' },
                { href: '/methodologies', label: 'Methodologies' },
                { href: '/platform', label: 'Launch platform' },
              ].map((item) => (
                <Box key={item.href} component="li" sx={{ mb: 1 }}>
                  <Link
                    href={item.href}
                    underline="hover"
                    sx={{ color: 'white', '&:hover': { color: 'grey-400' } }}
                  >
                    {item.label}
                  </Link>
                </Box>
              ))}
            </Box>
        </Box>

        {/* Contact */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Contact Us
          </Typography>
          <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, color: 'white' }}>
            <Box component="li" sx={{ mb: 1 }}>email@organization.com</Box>
            <Box component="li" sx={{ mb: 1 }}>123-456-7890</Box>
            <Box component="li">Location, State, 12345</Box>
          </Box>
        </Box>
      </Box>
    </Box>
      </div>
    </div>
  );
};

export default Landing;
function useState<T>(initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const state = React.useState<T>(initialValue);
  return state;
}
