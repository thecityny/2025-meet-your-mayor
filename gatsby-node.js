const path = require("path");
const fs = require("fs");

/**
 * Use this setup to dynamically create new pages on build. Each page will have the
 * path specified in `createPage` below, as well as any other property passed along
 * to it inside the `context` argument.
 */
const dynamicPageContent = [
  {
    slug: "page1",
    title: "This is Page 1",
  },
  {
    slug: "page2",
    title: "This is Page 2",
  },
  {
    slug: "page3",
    title: "This is Page 3",
  },
];

exports.createPages = async function ({ actions }) {
  dynamicPageContent.forEach(({ slug, title }) => {
    actions.createPage({
      path: slug,
      component: require.resolve("./src/components/ExamplePage.tsx"),
      context: { slug: slug, title: title },
    });
  });
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
