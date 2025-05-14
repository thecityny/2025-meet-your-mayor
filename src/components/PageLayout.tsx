import React, { useEffect } from "react";

import TheCityLogo from "../assets/logo.svg";
import GothamistLogo from "../assets/logo-gothamist.svg";
import { Helmet } from "react-helmet";
import { OutboundLink } from "./Links";
import { SocialButton } from "./SocialShareButtons";

import "../styles/app.scss";
import "react-lazy-load-image-component/src/effects/blur.css";
import { Script } from "gatsby";
import { init } from "@amplitude/analytics-browser";

const AMPLITUDE_PUBLIC_KEY = "cd8c6e9c6e26111a843bec73acf6fc28";

const THE_CITY_SITE_LINKS = {
  website: "https://www.thecity.nyc/",
  x: "https://x.com/intent/follow?screen_name=TheCityNY",
  instagram: "https://www.instagram.com/thecityny",
  facebook: "https://www.facebook.com/thecityny",
  bluesky: "https://bsky.app/profile/thecity.nyc",
};

const GOTHAMIST_SITE_LINKS = {
  website: "https://gothamist.com/",
  x: "https://x.com/gothamist",
  instagram: "https://www.instagram.com/gothamist",
  facebook: "https://www.facebook.com/gothamist",
  bluesky: "https://bsky.app/profile/gothamist.com",
};

const byline = process.env.GATSBY_AUTHOR
  ? JSON.parse(process.env.GATSBY_AUTHOR)
  : ([] as any);

const Header = () => (
  <nav className="nav has-color-background">
    <div className="nav-container">
      <div className="nav-logo" style={{ width: "80px" }}>
        <OutboundLink to={THE_CITY_SITE_LINKS.website} aria-label="THE CITY">
          <TheCityLogo />
        </OutboundLink>
      </div>
      <div className="eyebrow ml-2 mt-1 is-size-4">×</div>
      <div className="nav-logo ml-2 mt-1" style={{ width: "90px" }}>
        <OutboundLink to={GOTHAMIST_SITE_LINKS.website} aria-label="Gothamist">
          <GothamistLogo />
        </OutboundLink>
      </div>
      <div className="nav-title"></div>
    </div>
  </nav>
);

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer has-color-background">
      <div
        className="container is-flex is-flex-direction-column is-align-items-center p-0"
        style={{ maxWidth: "750px" }}
      >
        <div className="eyebrow">Made with ♥ in NYC by</div>
        <div className="eyebrow mb-5">
          <OutboundLink to={THE_CITY_SITE_LINKS.website} aria-label="THE CITY">
            THE CITY
          </OutboundLink>{" "}
          <div className="has-text-weight-bold is-size-6 is-inline-block">
            ×
          </div>{" "}
          <OutboundLink
            to={GOTHAMIST_SITE_LINKS.website}
            aria-label="GOTHAMIST"
          >
            Gothamist
          </OutboundLink>
        </div>
        <div className="eyebrow">
          {Object.entries(THE_CITY_SITE_LINKS)
            .filter((link) => link[0] !== "website")
            .map((link, i) => (
              <SocialButton
                url={link[1]}
                key={i}
                ariaLabel={`Share on ${link[0]}`}
              />
            ))}
          {"• "}
          {Object.entries(GOTHAMIST_SITE_LINKS)
            .filter((link) => link[0] !== "website")
            .map((link, i) => (
              <SocialButton
                url={link[1]}
                key={i}
                ariaLabel={`Share on ${link[0]}`}
              />
            ))}
        </div>
        <div className="eyebrow mt-6 mb-2 has-text-centered">
          By{" "}
          {byline.map((author: any, i: number) => (
            <span key={i} className="author">
              <OutboundLink to={author.url}>{author.name}</OutboundLink>
              {i < byline.length - 2
                ? ", "
                : i < byline.length - 1
                ? " and "
                : ""}
            </span>
          ))}
          . Design and development by{" "}
          <OutboundLink to="https://www.samrabiyah.com">
            Sam Rabiyah
          </OutboundLink>
          . Illustrations by{" "}
          <OutboundLink to="https://patrick-leger.com/">
            Patrick Léger
          </OutboundLink>
          . Photos by{" "}
          <OutboundLink to="https://www.thecity.nyc/author/ben-fractenberg/">
            Ben Fractenberg
          </OutboundLink>{" "}
          and courtesy of the Curtis Sliwa and Jim Walden campaigns. Design support from Tember
          Hopkins. Development support from Sam Guzik.
        </div>

        <div className="eyebrow mt-5 has-text-centered">
          View source code on{" "}
          <OutboundLink to="https://github.com/thecityny/2025-meet-your-mayor">
            Github
          </OutboundLink>
          .
        </div>

        <ul className="footer-links">
          <li>
            <OutboundLink
              to="https://www.thecity.nyc/contact/"
              className="button-link"
            >
              Contact
            </OutboundLink>
          </li>
          <li>
            <OutboundLink
              to="https://www.thecity.nyc/privacy-policy/"
              className="button-link"
            >
              Privacy Notice
            </OutboundLink>
          </li>
        </ul>
        <div className="copyright">
          © {year}, THE CITY REPORT, INC. All Rights Reserved.{" "}
        </div>
      </div>
    </footer>
  );
};

const Analytics = () => (
  <>
    {/* Google Analytics & Google Tag Manager: */}
    <Script
      async
      src="https://www.googletagmanager.com/gtag/js?id=G-G0ZNNV3GTX"
    />
    <Script>
      {`window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-G0ZNNV3GTX');
        dataLayer.push({
          'Author': 'Alyssa Katz:Mia Hollie:Sam Rabiyah:Richard Kim',
          'Primary_Group': 'Campaign 2023',
          'Type': 'Interactive'
        });`}
    </Script>
    {/* Parse.ly Analytics: */}
    <Script id="parsely-cfg" src="//cdn.parsely.com/keys/thecity.nyc/p.js" />
  </>
);

type MetadataProps = {
  slug?: string;
  siteName?: string;
  /**
   * This should be the filename of an image in the `/static` directory in the root.
   */
  shareImageFilename?: string;
  seoHeadline?: string;
  seoDescription?: string;
  socialHeadline?: string;
  socialDescription?: string;
  author?: {
    name: string;
    url: string;
    "@type": string;
  }[];
};

/**
 * This component wraps child components with a header and footer and adds site metadata
 */
export const PageLayout: React.FC<{
  children: React.ReactNode;
  customMetadata?: MetadataProps;
}> = ({ children, customMetadata }) => {
  const slug = customMetadata?.slug || process.env.GATSBY_SLUG;
  const url = `${process.env.GATSBY_DOMAIN}${slug}/`;

  const siteName = customMetadata?.siteName || process.env.GATSBY_SITE_NAME;
  const shareImage = `${process.env.GATSBY_DOMAIN}${process.env.GATSBY_SLUG}/${
    customMetadata?.shareImageFilename || "meet-your-mayor.jpg"
  }`;
  const seoHeadline =
    customMetadata?.seoHeadline || process.env.GATSBY_SEO_HEADLINE;
  const seoDescription =
    customMetadata?.seoDescription || process.env.GATSBY_SEO_DESCRIPTION;
  const socialHeadline =
    customMetadata?.socialHeadline || process.env.GATSBY_SOCIAL_HEADLINE;
  const socialDescription =
    customMetadata?.socialDescription || process.env.GATSBY_SOCIAL_DESCRIPTION;
  const author = customMetadata?.author || process.env.GATSBY_AUTHOR;

  // Initialize Amplitude Tracking:
  useEffect(() => {
    init(AMPLITUDE_PUBLIC_KEY);
  });

  return (
    <article id="main">
      <Header />
      <Helmet>
        <title>{`${siteName}`}</title>
        <meta name="theme-color" content="#000000" />
        <meta name="description" content={seoDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={socialHeadline} />
        <meta property="og:description" content={socialDescription} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={shareImage} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content={siteName} />
        <meta property="og:locale" content="en-US" />
        <meta property="twitter:title" content={socialHeadline} />
        <meta property="twitter:description" content={socialDescription} />
        <meta property="twitter:url" content={url} />
        <meta property="twitter:image" content={shareImage} />
        <meta property="twitter:card" content="summary_large_image" />

        <script type="application/ld+json">{`{
          "@type": "NewsArticle",
          "@context": "http://schema.org",
          "headline": "${seoHeadline}",
          "image": {
              "@type": "ImageObject",
              "contentUrl": "${shareImage}",
              "url": "${shareImage}",
              "representativeOfPage": ${true}
          },
          "dateCreated": "${process.env.GATSBY_PUB_DATE}",
          "datePublished": "${process.env.GATSBY_PUB_DATE}",
          "dateModified": "${process.env.GATSBY_UPDATE_DATE}",
          "articleSection": "News Apps",
          "mainEntityOfPage": "${url}",
          "description": "${seoDescription}",
          "publisher": {
              "@type": "Organization",
              "name": "THE CITY",
              "url": "https://www.thecity.nyc/"
          },
          "author": ${author}
        }`}</script>
      </Helmet>
      <Analytics />
      {children}
      <Footer />
    </article>
  );
};
