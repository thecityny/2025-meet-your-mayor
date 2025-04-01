import React from "react";
import { PageLayout } from "./PageLayout";
import { Link } from "gatsby";
import { OutboundLink } from "./OutboundLink";

const ExamplePage: React.FC<{ pageContext: any }> = ({ pageContext }) => (
  <PageLayout customMetadata={{ siteName: pageContext.candidateName }}>
    <div>
      <div className="container pt-6" style={{ maxWidth: "1100px" }}>
        <Link to="/" className="byline is-underlined">
          Meet your mayor
        </Link>
        <h1 className="headline has-text-left mt-1">
          {pageContext.candidateName}
        </h1>
        <div className="columns">
          <div className="column">
            <div
              style={{
                width: "350px",
                height: "350px",
                borderRadius: "100%",
                backgroundColor: "#BBBBBB",
              }}
            ></div>{" "}
          </div>
          <div className="column"></div>
        </div>
      </div>
      <div className="container pt-6" style={{ maxWidth: "600px" }}>
        <div className="field is-grouped">
          <OutboundLink to={"TKTKTK"} className="control">
            <button className="button is-link">Website</button>
          </OutboundLink>
          <Link to="/" className="button is-link is-outlined">
            See if you're a match
          </Link>
        </div>
        <p className="copy has-text-left mt-5">
          Voters of New York City: It’s time to pick your nominee for mayor,
          with primary day approaching on June 22. Since March, THE CITY has
          been presenting the candidates’ positions, issue by issue. Meet Your
          Mayor shows you how the contenders' stands fit with your take on what
          matters most to New Yorkers.
        </p>
        <p className="copy has-text-left my-5">
          Now we’ve pulled all 15 Meet Your Mayor editions into one final,
          supersized superquiz that will show you your ultimate match. Actually,
          your top matches, since voters will be ranking up to five selections
          at the polls.
        </p>
      </div>
    </div>
  </PageLayout>
);

export default ExamplePage;
