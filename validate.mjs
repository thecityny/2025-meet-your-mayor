/* Validate the metadata included in the .env file */
import assert from "node:assert";
import dotenv from "dotenv";

const DEFAULTS = {
  GATSBY_SLUG: "react-example-page-template",
  GATSBY_SITE_NAME: "Example News App",
  GATSBY_SEO_HEADLINE: "This is not a search-engine optimized headline",
  GATSBY_SEO_DESCRIPTION: "This is not a search-engine optimized description",
  GATSBY_SOCIAL_HEADLINE: "This is not a social headline",
  GATSBY_SOCIAL_DESCRIPTION: "This is not a social description",
  GATSBY_PUB_DATE: "2099-12-31 23:58:00",
  GATSBY_UPDATE_DATE: "2099-12-31 23:58:00",
};

function validate([key, value]) {
  try {
    assert(process.env[key] != value);
    console.log(`✅ ${key}`);
  } catch (err) {
    console.log(`❌ ${key}`);
    console.log(
      `You must edit the .env file and change ${key}'s default value.`
    );
    throw err;
  }
}

function main() {
  dotenv.config();
  console.log("Validating metadata");
  Object.entries(DEFAULTS).forEach(validate);
}

main();
