import React from "react";

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
        <OutboundLink to="https://gothamist.com/" aria-label="Gothamist">
          <GothamistLogo />
        </OutboundLink>
      </div>
      <div className="nav-title"></div>
      <div className="nav-links">
        <OutboundLink to="https://checkout.fundjournalism.org/memberform?&org_id=thecity&campaign=7011U000000VXZIQA4">
          Donate
        </OutboundLink>
      </div>
    </div>
  </nav>
);

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer has-background-light">
      <div className="container is-flex is-flex-direction-column is-align-items-center">
        <div className="footer-credit">
          Made with ♥ in NYC by{" "}
          <OutboundLink to="https://thecity.nyc/" aria-label="THE CITY">
            THE CITY
          </OutboundLink>
        </div>
        <div className="footer-icons">
          <OutboundLink
            className="twitter"
            aria-label="Twitter"
            to="https://twitter.com/intent/follow?screen_name=TheCityNY"
          >
            <TwitterIcon />
          </OutboundLink>
          <OutboundLink
            className="instagram"
            aria-label="Instagram"
            to="https://www.instagram.com/thecityny"
          >
            <InstagramIcon />
          </OutboundLink>
          <OutboundLink
            className="facebook"
            aria-label="Facebook"
            to="https://www.facebook.com/thecityny"
          >
            <FacebookIcon />
          </OutboundLink>
        </div>
        <div className="footer-credit" style={{ maxWidth: "750px" }}>
          Data Privacy Disclaimer: We store anonymous quiz responses to improve
          the tool and better understand our users—no personal data is
          collected.
        </div>
        <ul className="footer-links">
          <li>
            <OutboundLink to="https://www.thecity.nyc/about-us/">
              About
            </OutboundLink>
          </li>
          <li>
            <OutboundLink to="https://donorbox.org/nycdonate">
              Donate
            </OutboundLink>
          </li>
          <li>
            <OutboundLink to="https://www.thecity.nyc/team/">Team</OutboundLink>
          </li>
          <li>
            <OutboundLink to="https://www.thecity.nyc/funders/">
              Funders
            </OutboundLink>
          </li>
          <li>
            <OutboundLink to="https://www.thecity.nyc/ethics/">
              Ethics
            </OutboundLink>
          </li>
          <li>
            <OutboundLink to="https://www.thecity.nyc/republishing/">
              Republish
            </OutboundLink>
          </li>
          <br />
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
