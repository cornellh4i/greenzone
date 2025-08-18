import React from "react";

import NavBar from "../components/molecules/NavBar"; // Adjusted the path to match the relative structure
import Footer from "@/components/molecules/Footer"; // Adjusted the path to match your project structure
import LeftRightSection from "@/components/molecules/HomeInfo";

import Image from "next/image";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { useTranslation } from "react-i18next";

const teamMembers = [
  {
    name: "oyut_armarjargal",
    description: "oyut_armarjargal_text",
    image: "/Oyut.png",
  },
  {
    name: "khusel_avirmed",
    description: "khusel_avirmed_text",
    image: "/Khusel.png",
  },
  {
    name: "turbold_baatarchuluu",
    description: "turbold_baatarchuluu_text",
    image: "/Turbold.png",
  },
];

const About = () => {
  const { t: ta } = useTranslation("about");
  return (
    <div>
      <NavBar />
      <div className="container">
        <div className="hero-text">
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
                  {ta("about_subtitle_1")}
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
                  {ta("about_section_text_1")}
                </Typography>
              </Box>
            }
            right={
              <Paper elevation={0} sx={{ bgcolor: "transparent" }}>
                <Box
                  component="img"
                  src="/Landscape.png"
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
          />
        </div>

        <Box
          sx={{
            p: 10,
            bgcolor: "#fff",
            borderRadius: 2,
          }}
        >
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
            {ta("about_subtitle_2")}
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
            {ta("about_section_text_2")}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "stretch",
            gap: 10,
            width: "100%",
            py: 4,
          }}
        >
          {teamMembers.map((member) => (
            <Box
              key={member.name}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: { xs: "100%", sm: 250 },
                px: 2,
                py: 3,
                bgcolor: "#fff",
              }}
            >
              <Image
                src={member.image}
                alt={member.name}
                width={180}
                height={180}
                style={{
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginBottom: 18,
                }}
                className="contact-photo"
              />
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 700,
                  mt: 2,
                  mb: 1,
                  textAlign: "center",
                }}
                className="about-section-title contact-name"
              >
                {ta(member.name)}
              </Typography>
              <Typography
                sx={{
                  fontSize: "1rem",
                  color: "text.secondary",
                  textAlign: "center",
                  fontFamily: "'Poppins', sans-serif",
                }}
                className="contact-description"
              >
                {ta(member.description)}
              </Typography>
            </Box>
          ))}
        </Box>
      </div>
      <Footer />
    </div>
  );
};

export default About;
