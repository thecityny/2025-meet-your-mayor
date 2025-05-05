const path = require("path");
const fs = require("fs");

const candidateList = require("./src/candidate-list.json");

/**
 * Converts string to kebab case (for generating a url slug).
 * NOTE: this implementation is copied with an implementation in utils.tsx (not ideal).
 */
const kebabCase = (string) => {
  return string
    .replace(/\d+/g, " ")
    .split(/ |\B(?=[A-Z])/)
    .map((word) => word.toLowerCase())
    .join("-");
};

/**
 * Use this setup to dynamically create new pages on build. Each page will have the
 * path specified in `createPage` below, as well as any other property passed along
 * to it inside the `context` argument.
 */
let dynamicPageContent = Object.entries(candidateList).map(
  (candidate) => candidate[1]
);

exports.createPages = async function ({ actions }) {
  dynamicPageContent.forEach(({ name }) => {
    const slug = kebabCase(name);
    actions.createPage({
      path: slug,
      component: require.resolve("./src/components/CandidatePage.tsx"),
      context: { slug: slug, candidateName: name },
    });
  });
};

// Allows us to cleanly import SVG assets into react files:
exports.onCreateWebpackConfig = ({ actions, getConfig, stage }) => {
  const config = getConfig();

  // Remove default svg rule
  const svgRule = config.module.rules.find((rule) => {
    return String(rule.test).includes("svg");
  });

  if (svgRule) {
    svgRule.exclude = /\.svg$/;
  }

  // Add custom svg rule using @svgr/webpack
  config.module.rules.push({
    test: /\.svg$/,
    use: ["@svgr/webpack"],
  });

  actions.replaceWebpackConfig(config);
};

// Changes build folder from `public` to `build`.
// See https://github.com/gatsbyjs/gatsby/issues/18975#issuecomment-591403950 for more details.

exports.onPreInit = () => {
  if (process.argv[2] === "build") {
    if (fs.existsSync(path.join(__dirname, "build"))) {
      fs.rmdirSync(path.join(__dirname, "build"), { recursive: true });
    }
    if (fs.existsSync(path.join(__dirname, "public"))) {
      fs.renameSync(
        path.join(__dirname, "public"),
        path.join(__dirname, "public_dev")
      );
    }
  }
};

exports.onPostBuild = () => {
  fs.renameSync(path.join(__dirname, "public"), path.join(__dirname, "build"));
  if (fs.existsSync(path.join(__dirname, "public_dev"))) {
    fs.renameSync(
      path.join(__dirname, "public_dev"),
      path.join(__dirname, "public")
    );
  }
};
