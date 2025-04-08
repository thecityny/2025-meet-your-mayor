import React, { useEffect } from "react";
import pym from "pym.js";

import TheCityLogo from "../assets/images/logo.svg";
import GothamistLogo from "../assets/images/logo-gothamist.svg";
import TwitterIcon from "../assets/images/social-icons/twitter.svg";
import InstagramIcon from "../assets/images/social-icons/instagram.svg";
import FacebookIcon from "../assets/images/social-icons/facebook.svg";
import { Helmet } from "react-helmet";
import { OutboundLink } from "./Links";

import "../styles/app.scss";

const Header = () => (
  <nav className="nav">
    <div className="nav-container" style={{ maxWidth: "100vw" }}>
      <div className="nav-logo">
        <OutboundLink to="https://thecity.nyc/" aria-label="THE CITY">
          <TheCityLogo />
        </OutboundLink>
      </div>
      <div className="nav-logo ml-4 mt-2">
        <OutboundLink to="https://gothamist.com/" aria-label="THE CITY">
          <GothamistLogo />
        </OutboundLink>
      </div>
      <div className="nav-title"></div>
      <div className="nav-links">
        <a href="https://checkout.fundjournalism.org/memberform?&org_id=thecity&campaign=7011U000000VXZIQA4">
          Donate
        </a>
      </div>
    </div>
  </nav>
);

const Footer = () => {
  const year = new Date().getFullYear();

  useEffect(() => {
    const pymParent = new pym.Parent(
      "donation-box",
      "https://projects.thecity.nyc/donation-form/",
      {}
    );
    /**
     * This is a meaningless call of a method from `pymParent` that does nothing,
     * just to avoid the "no unused variables" linting error.
     */
    pymParent.onMessage("", () => {});
  }, []);

  return (
    <footer className="footer">
      <div className="donation-box-container">
        <div id="donation-box" />
      </div>

      <div className="container">
        <div className="footer-credit">
          Made with ♥ in NYC by{" "}
          <a href="https://thecity.nyc/" aria-label="THE CITY">
            THE CITY
          </a>
        </div>
        <div className="footer-icons">
          <a
            className="twitter"
            aria-label="Twitter"
            href="https://twitter.com/intent/follow?screen_name=TheCityNY"
          >
            <TwitterIcon />
          </a>
          <a
            className="instagram"
            aria-label="Instagram"
            href="https://www.instagram.com/thecityny"
          >
            <InstagramIcon />
          </a>
          <a
            className="facebook"
            aria-label="Facebook"
            href="https://www.facebook.com/thecityny"
          >
            <FacebookIcon />
          </a>
        </div>
        <ul className="footer-links">
          <li>
            <a href="https://www.thecity.nyc/about-us/">About</a>
          </li>
          <li>
            <a href="https://donorbox.org/nycdonate">Donate</a>
          </li>
          <li>
            <a href="https://www.thecity.nyc/team/">Team</a>
          </li>
          <li>
            <a href="https://www.thecity.nyc/funders/">Funders</a>
          </li>
          <li>
            <a href="https://www.thecity.nyc/ethics/">Ethics</a>
          </li>
          <li>
            <a href="https://www.thecity.nyc/republishing/">Republish</a>
          </li>
          <br />
          <li>
            <a href="https://www.thecity.nyc/contact/">Contact</a>
          </li>
          <li>
            <a href="https://www.thecity.nyc/privacy-policy/">Privacy Notice</a>
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
