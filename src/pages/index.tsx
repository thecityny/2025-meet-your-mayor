import React from "react";
import { PageLayout } from "../components/PageLayout";

const byline = process.env.GATSBY_AUTHOR
  ? JSON.parse(process.env.GATSBY_AUTHOR)
  : ([] as any);

const Homepage = () => (
  <PageLayout>
    <div>
      <div className="container">
        <h1 className="headline">This is not a headline</h1>
        <div className="attribution">
          <p className="byline">
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
        </div>
      </div>

      <br />

      <div className="container">
        <p className="copy">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
          pellentesque luctus magna sed auctor. Cras ullamcorper urna mattis
          lectus sagittis, quis vehicula dui vestibulum.
        </p>
        <p className="copy">
          Aliquam sollicitudin libero vel diam cursus, ut egestas ex
          scelerisque. Nullam vestibulum metus interdum, dictum erat vel, luctus
          elit. Nullam aliquam ante elit, mollis aliquet nulla efficitur
          molestie. Praesent a tempus mi.
        </p>
      </div>
    </div>
  </PageLayout>
);

export default Homepage;
