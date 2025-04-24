import React from "react";

import TheCityLogo from "../assets/logo.svg";
import GothamistLogo from "../assets/logo-gothamist.svg";
import { Helmet } from "react-helmet";
import { OutboundLink } from "./Links";

import "../styles/app.scss";
import { SocialButton } from "./SocialShareButtons";

const THE_CITY_SITE_LINKS = {
  website: "https://thecity.nyc/",
  twitter: "https://twitter.com/intent/follow?screen_name=TheCityNY",
  instagram: "https://www.instagram.com/thecityny",
  facebook: "https://www.facebook.com/thecityny",
  bluesky: "https://bsky.app/profile/thecity.nyc",
};

const GOTHAMIST_SITE_LINKS = {
  website: "https://gothamist.com/",
  twitter: "https://twitter.com/gothamist",
  instagram: "https://www.instagram.com/gothamist",
  facebook: "https://www.facebook.com/gothamist",
  bluesky: "https://bsky.app/profile/gothamist.com",
};

const Header = () => (
  <nav className="nav">
    <div className="nav-container">
      <div className="nav-logo">
        <OutboundLink to={THE_CITY_SITE_LINKS.website} aria-label="THE CITY">
          <TheCityLogo />
        </OutboundLink>
      </div>
      <div className="ml-2 has-text-weight-bold is-size-4">×</div>
      <div className="nav-logo ml-2 mt-2">
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
    <footer className="footer has-background-light">
      <div className="container is-flex is-flex-direction-column is-align-items-center">
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
              <SocialButton url={link[1]} key={i} />
            ))}
          {"• "}
          {Object.entries(GOTHAMIST_SITE_LINKS)
            .filter((link) => link[0] !== "website")
            .map((link, i) => (
              <SocialButton url={link[1]} key={i} />
            ))}
        </div>

        <div className="footer-credit" style={{ maxWidth: "750px" }}>
          Meet Your Mayor does not collect any personal data from users. We do
          collect quiz responses anonymously to improve this resource and track
          aggregate results.
        </div>

        <ul className="footer-links">
          <li>
            <OutboundLink to="https://www.thecity.nyc/contact/">
              Contact
            </OutboundLink>
          </li>
          <li>
            <OutboundLink to="https://www.thecity.nyc/privacy-policy/">
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
    customMetadata?.shareImageFilename || "social-image.jpg"
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

  return (
    <article>
      <Header />
      <Helmet>
        <title>{`${siteName} - THE CITY`}</title>
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
      {children}
      <Footer />
    </article>
  );
};
