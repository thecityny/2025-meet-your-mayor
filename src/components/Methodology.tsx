import React from "react";
import { OutboundLink } from "./Links";
import { Changelog } from "./Changelog";

export const Methodology = () => (
  <div className="copy">
    <p className="mt-3">
      THE CITY and Gothamist chose a field of 12 candidates based on their poll
      standings, their presence at community forums and other appearances that
      provide a broad record of their positions and their history of public
      service. Most but not all candidates on the ballot are part of Meet Your
      Mayor.
    </p>
    <p className="mt-3">
      In March, we sent each of the campaigns a multiple-choice survey asking
      them to make tough choices between pressing policy alternatives. We also
      checked their statements and stances against what the candidates have
      actually been saying on the campaign trail.
    </p>
    <p className="mt-3">
      Of the 12, only Eric Adams did not respond to the survey. Meet Your Mayor
      has assigned responses based on his policies and public statements.
    </p>
    <p className="mt-3">
      In the quiz, candidates score 1 point for each question on which their
      answer matches the answer that a voter provides. A response of “no
      position” does not count toward a candidate’s score.
    </p>
    <p className="mt-3">
      At the end of the quiz, voters select up to three issues of top interest,
      and each 1-point score in those categories counts as 2 points in the final
      tally.
    </p>
    <p className="mt-3">
      Meet Your Mayor does not collect any personal data from users. We do
      collect quiz responses anonymously to improve this resource and track
      aggregate results.
    </p>
    <p className="mt-3">
      As in 2021, we are pleased to make our code available on{" "}
      <OutboundLink to="https://github.com/thecityny/2025-meet-your-mayor">
        Github
      </OutboundLink>{" "}
      for use by other organizations. So far our project has been adapted for
      mayoral races in{" "}
      <OutboundLink to="https://projects.laist.com/meet-your-mayor-2022-general/">
        Los Angeles
      </OutboundLink>{" "}
      and{" "}
      <OutboundLink to="https://phillymayorquiz.com/">
        Philadelphia
      </OutboundLink>
      . Could your city be next?{" "}
      <OutboundLink to="mailto:meetyourmayor@thecity.nyc">
        Drop us a line
      </OutboundLink>
      .
    </p>
    <p className="mt-3 has-text-weight-semibold">Updates</p>
    <Changelog />
  </div>
);
