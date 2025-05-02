import React, { FC } from "react";
import { Bobblehead } from "./Illustration";

export const IntroAnimation: FC<{ isMobile?: boolean }> = ({ isMobile }) =>
  isMobile ? (
    <div className="column is-flex is-flex-direction-row is-half is-hidden-tablet">
      <Bobblehead candidateName="Eric Adams" size="is-128x128" />
      <Bobblehead candidateName="Jessica Ramos" size="is-128x128" />
      <Bobblehead candidateName="Zohran Mamdani" size="is-128x128" />
    </div>
  ) : (
    <div className="column is-half is-hidden-touch is-flex is-flex-direction-row">
      <Bobblehead candidateName="Eric Adams" size="is-1by2" />
      <Bobblehead candidateName="Jessica Ramos" size="is-1by2" />
    </div>
  );
