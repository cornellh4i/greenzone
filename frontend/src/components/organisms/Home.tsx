import NavBar from "../molecules/NavBar";
import LeftRightSection from "../molecules/HomeInfo";
import { Typography, Box, Paper } from "@mui/material";
import React from "react";
import Footer from "@/components/molecules/Footer";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";

const Home: React.FC = () => {
  const router = useRouter();
  const handleNavigate = (path: string) => {
    router.push(path);
  };
  const { t: th } = useTranslation("landing");
  return (
    <div>
      <NavBar />
      <div className="w-full flex flex-col gap-[0px]">
        <div className="w-full h-fit">
          <LeftRightSection
            bgColor="#F0F5F0"
            paddingY={10}
            maxWidth="none"
            containerSx={{ px: { xs: 2, md: 8 } }}
            left={
              <Box>
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  mb={2}
                  sx={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#000000",
                  }}
                >
                  {th("landingtitle")}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "15px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "143%",
                    letterSpacing: "0.17px",
                    color: "#000000",
                  }}
                >
                  {th("landingsubtitle")}
                </Typography>
              </Box>
            }
            right={
              <Paper elevation={0} sx={{ bgcolor: "transparent" }}>
                <Box
                  component="img"
                  src="/countrymap.png"
                  alt="…"
                  sx={{
                    width: "100%",
                    aspectRatio: "16 / 9",
                    objectFit: "cover",
                    objectPosition: "center",
                    borderRadius: 3,
                  }}
                ></Box>
              </Paper>
            }
            buttonText={th("launch_platform")}
            onButtonClick={() => handleNavigate("/monitoring-platform")}
            buttonVariant="text"
            buttonColor="success"
            buttonSx={{
              bgcolor: "#065143",
              borderRadius: "12px",
              "&:hover": { bgcolor: "#043F33" },
              color: "white",
              fontFamily: "'Poppins', sans-serif",

              paddingX: 2,
              paddingY: 1,
              width: "40%",
            }}
            buttonSide="left"
          />
        </div>

        <Box sx={{ py: 10, backgroundColor: "white" }}>
          <Box
            sx={{
              maxWidth: "1200px",
              mx: "auto",
              px: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "24px",
                fontWeight: "bold",
                color: "#000000",
                textAlign: "center",
              }}
            >
              {th("sb1title")}
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "center",
                gap: { xs: 6, md: 8 },
                width: "100%",
                flexWrap: "wrap",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  maxWidth: 300,
                  mx: "auto",
                }}
              >
                <Box
                  component="img"
                  src="/cow.png"
                  alt="Herders"
                  sx={{ width: 64, height: 64, mb: 2 }}
                />
                <Typography
                  variant="h6"
                  mb={2}
                  sx={{
                    color: "#065143",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "24px",
                    fontStyle: "normal",
                    fontWeight: 700,
                  }}
                >
                  {th("sb1titlea")}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mt: 1,
                    color: "#000000",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  {th("sb1texta")}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  maxWidth: 300,
                  mx: "auto",
                }}
              >
                <Box
                  component="img"
                  src="/graph.png"
                  alt="Risk Analysts"
                  sx={{ width: 64, height: 64, mb: 2 }}
                />
                <Typography
                  variant="h6"
                  mb={2}
                  sx={{
                    color: "#065143",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "24px",
                    fontStyle: "normal",
                    fontWeight: 700,
                  }}
                >
                  {th("sb1titleb")}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mt: 1,
                    color: "#000000",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  {th("sb1textb")}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  maxWidth: 300,
                  mx: "auto",
                }}
              >
                <Box
                  component="img"
                  src="/pencil.png"
                  alt="Policymakers"
                  sx={{ width: 64, height: 64, mb: 2 }}
                />
                <Typography
                  variant="h6"
                  mb={2}
                  sx={{
                    color: "#065143",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "24px",
                    fontStyle: "normal",
                    fontWeight: 700,
                  }}
                >
                  {th("sb1titlec")}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mt: 1,
                    color: "#000000",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  {th("sb1textc")}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        <div className="w-full h-fit">
          <LeftRightSection
            bgColor="#F0F5F0"
            paddingY={10}
            maxWidth="none"
            containerSx={{ px: { xs: 2, md: 8 } }}
            left={
              <Box>
                <Typography
                  mb={2}
                  sx={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "32px",
                    fontStyle: "normal",
                    fontWeight: 700,
                  }}
                >
                  {th("sb2title")}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "15px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    color: "#000000",
                  }}
                >
                  {th("sb2text")}
                </Typography>
              </Box>
            }
            right={
              <Paper elevation={0} sx={{ bgcolor: "transparent" }}>
                <Box
                  component="img"
                  src="/horse.png"
                  alt="…"
                  sx={{
                    width: "100%",
                    aspectRatio: "16 / 9",
                    objectFit: "cover",
                    objectPosition: "center",
                    borderRadius: 3,
                  }}
                ></Box>
              </Paper>
            }
            buttonText={th("buttontext")}
            onButtonClick={() => handleNavigate("/test")}
            buttonVariant="outlined"
            buttonColor="success"
            buttonSx={{
              width: 150,
              borderRadius: 2,
            }}
            buttonSide="left"
          />
        </div>
        <section className="w-full h-full">
          <LeftRightSection
            bgColor="#065143"
            paddingY={10}
            maxWidth="none"
            containerSx={{ px: { xs: 2, md: 8 } }}
            left={
              <Paper elevation={0} sx={{ bgcolor: "transparent" }}>
                <Box
                  component="img"
                  src="/mountain.png"
                  alt="…"
                  sx={{
                    width: "100%",
                    aspectRatio: "16 / 9",
                    objectFit: "cover",
                    objectPosition: "center",
                    borderRadius: 3,
                  }}
                ></Box>
              </Paper>
            }
            right={
              <Box>
                <Typography
                  mb={2}
                  sx={{
                    color: "#FFF",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "32px",
                    fontStyle: "normal",
                    fontWeight: 700,
                  }}
                >
                  {th("sb3title")}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "15px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    color: "#FFF",
                  }}
                >
                  {th("sb3text")}
                </Typography>
              </Box>
            }
            buttonText={th("buttontext")}
            onButtonClick={() => handleNavigate("/test")}
            buttonVariant="outlined"
            buttonColor="success"
            buttonSx={{
              width: 150,
              borderRadius: 2,
              color: "#FFF",
              borderColor: "#FFF",
            }}
            buttonSide="right"
          />
        </section>

        <section className="w-full h-fit">
          <LeftRightSection
            bgColor="#F0F5F0"
            paddingY={10}
            maxWidth="none"
            containerSx={{ px: { xs: 2, md: 8 } }}
            left={
              <Box>
                <Typography
                  mb={2}
                  sx={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "32px",
                    fontStyle: "normal",
                    fontWeight: 700,
                  }}
                >
                  {th("sb4title")}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "15px",
                    fontStyle: "normal",
                    fontWeight: 400,
                  }}
                >
                  {th("sb4text")}
                </Typography>
              </Box>
            }
            right={
              <Paper elevation={0} sx={{ bgcolor: "transparent" }}>
                <Box
                  component="img"
                  src="/mountain.png"
                  alt="…"
                  sx={{
                    width: "100%",
                    aspectRatio: "16 / 9",
                    objectFit: "cover",
                    objectPosition: "center",
                    borderRadius: 3,
                  }}
                ></Box>
              </Paper>
            }
            buttonText={th("buttontext")}
            onButtonClick={() => handleNavigate("/test")}
            buttonVariant="outlined"
            buttonColor="success"
            buttonSx={{
              width: 150,
              borderRadius: 2,
            }}
            buttonSide="left"
          />
        </section>
        <Footer />
      </div>
    </div>
  );
};

export default Home;
