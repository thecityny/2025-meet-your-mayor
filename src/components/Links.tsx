import React from "react";
import { Link as AnchorLink } from "react-scroll";

const DEFAULT_GOTHAMIST_UTM_PARAMS =
  "?utm_medium=partnersite&utm_source=the-city&utm_campaign=meet-your-mayor";

const DEFAULT_THE_CITY_UTM_PARAMS =
  "?utm_source=button&utm_medium=website&utm_campaign=meet%20your%20mayor%202025";

export const OutboundLink: React.FC<{
  to: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}> = ({ to, children, className, style }) => {
  const isGothamistLink =
    to.includes("gothamist.com") || to.includes("wnyc.org");
  const isTheCityLink =
    to.includes("www.thecity.nyc") || to.includes("donorbox.org");
  return (
    <a
      className={className}
      style={style}
      href={
        to +
        (isGothamistLink
          ? DEFAULT_GOTHAMIST_UTM_PARAMS
          : isTheCityLink
          ? DEFAULT_THE_CITY_UTM_PARAMS
          : "")
      }
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
};

/**
 * How many pixels above each section we should jump to when we click on an anchor link.
 */
export const QUESTION_ANCHOR_LINK_OFFSET = -150;

export const ANCHOR_LINK_DURATION = 800;

const LINKS_WITH_REMOVED_OFFSET = ["quiz", "results"];

export const SmoothScroll: React.FC<{
  to: string;
  children: React.ReactNode;
  className?: string;
  extraOffset?: number;
  style?: React.CSSProperties;
  enableActiveClass?: boolean;
  onClick?: () => void;
}> = ({
  to,
  children,
  className,
  extraOffset,
  style,
  enableActiveClass,
  onClick,
}) => {
  return (
    <AnchorLink
      className={className}
      style={style}
      activeClass={enableActiveClass ? "has-text-weight-bold" : ""}
      spy={true}
      smooth={true}
      duration={ANCHOR_LINK_DURATION}
      offset={
        (LINKS_WITH_REMOVED_OFFSET.includes(to)
          ? 0
          : QUESTION_ANCHOR_LINK_OFFSET) + (extraOffset || 0)
      }
      to={to}
      onClick={onClick}
    >
      {children}
    </AnchorLink>
  );
};
