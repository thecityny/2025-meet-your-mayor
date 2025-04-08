import React from "react";
import { PageLayout } from "../components/PageLayout";
import Quiz from "../components/Quiz";
import { CandidateSelectorMenu } from "../components/CandidateSelectorMenu";
import { SocialShareButtons } from "../components/SocialShareButtons";
import { OutboundLink, SmoothScroll } from "../components/Links";
import { coverageLinksTheCity } from "../coverage-links";

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
            <SmoothScroll to="quiz" className="button is-primary">
              TAKE THE QUIZ
            </SmoothScroll>
            <p className="byline has-text-left mt-4 mb-2">Share this tool</p>
            <SocialShareButtons />
          </div>
        </div>
      </div>
    </div>
    <Quiz />
    <div className="hero is-fullheight-with-navbar pt-6">
      <div className="container mt-6">
        <div className="columns">
          <div className="column is-two-thirds">
            <h1
              className="headline has-text-left"
              style={{ maxWidth: "500px" }}
            >
              Learn more about the candidates...
            </h1>
            <CandidateSelectorMenu isBig />
          </div>
          <div className="column">
            <h1 className="headline has-text-left">
              ...or read recent news coverage
            </h1>
            <div>THE CITY</div>
            <ul>
              {coverageLinksTheCity.map((link, i) => (
                <li key={i} className="is-inline-block mb-1">
                  •{" "}
                  <OutboundLink to={link.href} className="has-text-left">
                    {link.text}
                  </OutboundLink>
                </li>
              ))}
            </ul>
            <div className="mt-3">GOTHAMIST</div>
            <ul>
              {coverageLinksTheCity.map((link, i) => (
                <li key={i} className="is-inline-block mb-1">
                  •{" "}
                  <OutboundLink to={link.href} className="has-text-left">
                    {link.text}
                  </OutboundLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  </PageLayout>
);

export default Homepage;
