import React from "react";
import Link from "next/link";
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from "next";
import { Box, Typography, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import NavBar from "../../components/molecules/NavBar";
import Footer from "@/components/molecules/Footer";
import { getAllSlugs, getPostBySlug } from "@/content/insights";
import type { InsightPost } from "@/content/insights";
import { formatDate, type Lang } from "@/content/dates";

const headingFont = "Poppins, sans-serif";

export const getStaticPaths: GetStaticPaths = () => ({
  paths: getAllSlugs().map((slug) => ({ params: { slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<{ post: InsightPost }> = ({
  params,
}) => {
  const post = getPostBySlug(String(params?.slug));
  if (!post) return { notFound: true };
  return { props: { post } };
};

const Article = ({
  post,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t: ti, i18n } = useTranslation("insights");
  const lang: Lang = i18n.language === "mn" ? "mn" : "en";

  return (
    <div>
      <NavBar />

      <Box
        component="article"
        sx={{ maxWidth: 820, mx: "auto", px: { xs: 2, md: 3 }, py: { xs: 5, md: 8 } }}
      >
        <Link href="/insights" style={{ textDecoration: "none" }}>
          <Typography
            sx={{
              fontFamily: headingFont,
              fontSize: "14px",
              fontWeight: 600,
              color: "#065143",
              mb: 3,
              "&:hover": { textDecoration: "underline" },
            }}
          >
            {ti("back_to_insights")}
          </Typography>
        </Link>

        <Typography
          variant="h3"
          sx={{
            fontFamily: headingFont,
            fontWeight: "bold",
            fontSize: { xs: "28px", md: "38px" },
            color: "#0B0B0B",
            lineHeight: 1.2,
            mb: 2,
          }}
        >
          {post.title}
        </Typography>

        <Typography
          sx={{ fontFamily: headingFont, fontSize: "15px", color: "#6B7C77", mb: 4 }}
        >
          {post.author ? `${ti("by")} ${post.author} · ` : ""}
          {formatDate(post.date, lang)}
        </Typography>

        {post.thumbnail && (
          <Box
            component="img"
            src={post.thumbnail}
            alt={post.title}
            sx={{
              width: "100%",
              aspectRatio: "16 / 9",
              objectFit: "cover",
              borderRadius: 3,
              mb: 4,
            }}
          />
        )}

        {/* Markdown body */}
        <Box
          sx={{
            fontFamily: headingFont,
            color: "#222",
            "& p": { fontSize: "17px", lineHeight: 1.7, mb: 2.5 },
            "& a": { color: "#065143", textDecoration: "underline" },
            "& h2": { fontSize: "24px", fontWeight: 700, mt: 4, mb: 1.5 },
            "& h3": { fontSize: "20px", fontWeight: 700, mt: 3, mb: 1 },
            "& ul, & ol": { pl: 3, mb: 2.5 },
            "& li": { fontSize: "17px", lineHeight: 1.7, mb: 1 },
            "& img": { maxWidth: "100%", borderRadius: 2, my: 2 },
            "& blockquote": {
              borderLeft: "3px solid #cfe0db",
              pl: 2,
              ml: 0,
              color: "#555",
              fontStyle: "italic",
              my: 2,
            },
            "& code": {
              backgroundColor: "#f1f5f4",
              px: 0.6,
              py: 0.2,
              borderRadius: 1,
              fontSize: "15px",
            },
          }}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
        </Box>

        {post.linkedin && (
          <Button
            variant="contained"
            href={post.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              mt: 3,
              backgroundColor: "#065143",
              textTransform: "none",
              fontFamily: headingFont,
              fontWeight: 600,
              borderRadius: 2,
              px: 3,
              py: 1,
              "&:hover": { backgroundColor: "#043f33" },
            }}
          >
            {ti("view_on_linkedin")}
          </Button>
        )}
      </Box>

      <Footer />
    </div>
  );
};

export default Article;
