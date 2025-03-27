import React from "react";
import { PageLayout } from "../components/PageLayout";
import AnchorLink from "react-anchor-link-smooth-scroll";

const byline = process.env.GATSBY_AUTHOR
  ? JSON.parse(process.env.GATSBY_AUTHOR)
  : ([] as any);

const Homepage = () => (
  <PageLayout>
    <div className="hero is-fullheight-with-navbar">
      <div className="hero-body">
        <div>
          <h1 className="headline has-text-left">Meet your Mayor: 2025</h1>
          <div className="attribution">
            <p className="byline has-text-left mb-0">
              By{" "}
              {byline.map((author: any, i: number) => (
                <span key={i} className="author">
                  <a href={author.url}>{author.name}</a>
                  {i < byline.length - 2
                    ? ", "
                    : i < byline.length - 1
                    ? " and "
                    : ""}
                </span>
              ))}
            </p>
            <p className="byline has-text-left mt-0 mb-4">
              In partnership with WNYC
            </p>
            <p className="copy has-text-left" style={{ maxWidth: "600px" }}>
              Candidates for NYC mayor told us where they stand on 15 big
              issues. Now you can pick your positions and see which contenders
              are the right ones for you.
            </p>
            <AnchorLink href="#quiz" className="button is-primary">
              TAKE THE QUIZ
            </AnchorLink>
          </div>
        </div>
      </div>
    </div>
    <div className="hero is-fullheight-with-navbar" id="quiz">
      <div className="hero-body"></div>
    </div>
  </PageLayout>
);

export default Homepage;
