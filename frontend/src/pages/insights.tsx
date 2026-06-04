import React from "react";
import Link from "next/link";
import type { GetStaticProps } from "next";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import NavBar from "../components/molecules/NavBar";
import Footer from "@/components/molecules/Footer";
import { getAllCards } from "@/content/insights";
import type { InsightCard } from "@/content/insights";
import { formatDate, type Lang } from "@/content/dates";

const headingFont = "Poppins, sans-serif";

export const getStaticProps: GetStaticProps<{ posts: InsightCard[] }> = () => ({
  props: { posts: getAllCards() },
});

const Insights = ({ posts }: { posts: InsightCard[] }) => {
  const { t: ti, i18n } = useTranslation("insights");
  const lang: Lang = i18n.language === "mn" ? "mn" : "en";

  return (
    <div>
      <NavBar />

      {/* Header */}
      <Box sx={{ backgroundColor: "#F0F5F0", py: { xs: 6, md: 10 } }}>
        <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, md: 8 } }}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: headingFont,
              fontWeight: "bold",
              fontSize: { xs: "26px", md: "34px" },
              color: "#065143",
              mb: 1.5,
            }}
          >
            {ti("page_title")}
          </Typography>
          <Typography
            sx={{
              fontFamily: headingFont,
              fontSize: { xs: "15px", md: "17px" },
              color: "#333",
              maxWidth: 720,
            }}
          >
            {ti("page_subtitle")}
          </Typography>
        </Box>
      </Box>

      {/* Cards */}
      <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, md: 8 }, py: { xs: 5, md: 8 } }}>
        {posts.length === 0 ? (
          <Typography sx={{ fontFamily: headingFont, color: "#555" }}>
            {ti("empty")}
          </Typography>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: 4,
            }}
          >
            {posts.map((post) => {
              const c = lang === "mn" && post.mn ? post.mn : post.en;
              return (
              <Link
                key={post.slug}
                href={`/insights/${post.slug}`}
                style={{ textDecoration: "none" }}
              >
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 3,
                    overflow: "hidden",
                    bgcolor: "#fff",
                    border: "1px solid #E6EEEC",
                    transition: "box-shadow 0.2s, transform 0.2s",
                    "&:hover": {
                      boxShadow: "0 8px 24px rgba(6, 81, 67, 0.12)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  {post.thumbnail ? (
                    <Box
                      component="img"
                      src={post.thumbnail}
                      alt={c.title}
                      sx={{ width: "100%", aspectRatio: "16 / 9", objectFit: "cover" }}
                    />
                  ) : (
                    <Box sx={{ width: "100%", aspectRatio: "16 / 9", bgcolor: "#E6EEEC" }} />
                  )}
                  <Box sx={{ p: 2.5, display: "flex", flexDirection: "column", flexGrow: 1 }}>
                    <Typography
                      sx={{ fontFamily: headingFont, fontSize: "13px", color: "#6B7C77", mb: 1 }}
                    >
                      {formatDate(post.date, lang)}
                      {post.author ? ` · ${ti("by")} ${post.author}` : ""}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: headingFont,
                        fontWeight: 700,
                        fontSize: "19px",
                        color: "#0B0B0B",
                        mb: 1,
                      }}
                    >
                      {c.title}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: headingFont,
                        fontSize: "14px",
                        color: "#444",
                        lineHeight: 1.5,
                        mb: 2,
                      }}
                    >
                      {c.excerpt}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: headingFont,
                        fontWeight: 600,
                        fontSize: "14px",
                        color: "#065143",
                        mt: "auto",
                      }}
                    >
                      {ti("read_more")} →
                    </Typography>
                  </Box>
                </Box>
              </Link>
              );
            })}
          </Box>
        )}
      </Box>

      <Footer />
    </div>
  );
};

export default Insights;
