import React from 'react';
import NavBar from "../components/molecules/NavBar";
import { AppBar, Toolbar, Button, Typography, Box, useTheme, useMediaQuery, Paper, MenuItem, Select} from '@mui/material';


const Landing : React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'mn'>('en');
  const handleLanguageChange = (event: any) => {
    setSelectedLanguage(event.target.value);
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
          <Button variant="text" color="inherit"sx={{ textTransform: 'none', fontSize: '18px', }}>
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
            }}
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


{/* Mid Section */}
<section className="w-fit h-fit flex flex-col gap-[64px] items-center bg-[#F9F9F9]">
  <p className="font-poppins font-semibold text-[24px] text-center align-middle">A product for...</p>
  <div className="flex flex-row justify-center gap-[64px]">
    {/* Herders Block */}
    <div className="flex flex-col items-center text-center max-w-[300px]">
      <div className="w-[100px] h-[100px] bg-gray-300 mb-4">[Vector]</div>
      <h3 className="font-poppins font-bold text-[28px] text-[#065143] align-middle">Herders</h3>
      <p className="font-poppins font-normal text-[20px] align-middle">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.      </p>
    </div>
    {/* Risk Analysts Block */}
    <div className="flex flex-col items-center text-center max-w-[300px]">
      <div className="w-[100px] h-[100px] bg-gray-300 mb-4">[Vector]</div>
      <h3 className="font-poppins font-bold text-[28px] text-[#065143] align-middle">Risk Analysts</h3>
      <p className="font-poppins font-normal text-[20px] align-middle">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.      </p>
    </div>
    {/* Policymakers Block */}
    <div className="flex flex-col items-center text-center max-w-[300px]">
      <div className="w-[100px] h-[100px] bg-gray-300 mb-4">[Vector]</div>
      <h3 className="font-poppins font-bold text-[28px] text-[#065143] align-middle">Policymakers</h3>
      <p className="font-poppins font-normal text-[20px] align-middle">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.      </p>
    </div>
  </div>
</section>

      {/* Final Section */}
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

        <img src="/final-image.png" alt="Final Visual" className="w-full h-auto my-12" />

        <div className="w-full flex flex-col items-center gap-8">
          <img src="/extra-image.png" alt="Extra" className="w-[400px] h-auto" />
          <p className="font-poppins font-bold text-[32px]">Data "at a glance"</p>
          <button className="w-fit h-fit rounded-[12px] px-[24px] py-[12px] border-2 border-[#061543] text-[#061543] font-poppins gap-[12px]">
            Learn more
          </button>
        </div>
      </section>

      <section className="w-full h-fit"></section>
        <div className="w-full h-fit py-[160px] bg-[#E6EEEC] flex flex-col items-center gap-[100px]">
          <div className="w-fit flex flex-col gap-[32px] items-center">
            <h2 className="font-poppins font-bold text-[32px] align-middle">Our Methodologies</h2>
            <p className="font-poppins font-normal text-[24px]">Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor. Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.</p>
            <button className="w-fit h-fit rounded-[12px] px-[24px] py-[12px] border-2 border-[#061543] text-[#061543] font-poppins gap-[12px]">
              Learn more
            </button>
          </div>
        </div>

      {/* Footer */}
      <footer className="w-full py-[48px] bg-[#061543] text-white text-center font-poppins">
      </footer>
      </div>
    </div>
  );
};

export default Landing;
function useState<T>(initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const state = React.useState<T>(initialValue);
  return state;
}
