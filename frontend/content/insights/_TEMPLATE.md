<!--
  ┌─────────────────────────────────────────────────────────────────────────┐
  │  HOW TO WRITE A GREENZONE "INSIGHTS" BLOG POST                            │
  └─────────────────────────────────────────────────────────────────────────┘

  1. Make a COPY of this file.

  2. RENAME the copy to a short "slug" — lowercase words joined by dashes,
     ending in .md. For example:
         winter-dzud-2026.md   →   the post will be at /insights/winter-dzud-2026

  3. Fill in the fields between the two "---" lines below (this is the
     "front matter"). Keep the field names exactly as they are.
         title      – the headline
         author     – who wrote it
         date       – publish date, format YYYY-MM-DD (e.g. 2026-06-01)
         thumbnail  – the card/header image (see step 5). Optional.
         linkedin   – link to the original LinkedIn post. Optional.
         excerpt    – 1–2 sentence summary shown on the card. Optional —
                      if omitted, the first paragraph is used.

  4. WRITE THE POST below the second "---" line using normal Markdown:
         • Leave a BLANK LINE between paragraphs.
         • **bold**,  *italics*,  [link text](https://example.com)
         • Bullet list:  start lines with "- "
         • Subheading:   start a line with "## "

  5. IMAGES: put image files in  frontend/public/insights/  and reference them
     as  /insights/your-image.jpg  (works for `thumbnail` and inside the body).

  6. Send the finished .md file back. It gets dropped into
         frontend/content/insights/
     and the post publishes automatically (newest date first).

  BILINGUAL (optional): to publish a Mongolian version of a post, add a second
  file with the SAME name plus ".mn" — e.g.  winter-dzud-2026.mn.md  — with the
  Mongolian title/excerpt in its front matter and the Mongolian text in the
  body. It is shown when the site's language toggle is set to MN; otherwise the
  English (.md) file is used. (Date, author, thumbnail and linkedin are taken
  from the English file, so you don't need to repeat them.)

  This file (named "_TEMPLATE.md") is IGNORED by the site because its name
  starts with "_", so you can leave these notes here in the template.
-->
---
title: Your post title here
author: Author Name
date: 2026-06-01
thumbnail: /insights/your-thumbnail.jpg
linkedin: https://www.linkedin.com/posts/your-post-url
excerpt: One or two sentences shown on the card. Optional.
---

Write your opening paragraph here. Leave a blank line between paragraphs so
each one renders separately.

You can use **bold text**, *italics*, and [links](https://example.com). To make
a list:

- First point
- Second point
- Third point

## A subheading

Continue the post here. Add as many paragraphs, lists, and subheadings as you
like.
