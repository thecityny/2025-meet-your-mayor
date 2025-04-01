require("dotenv").config();
const fs = require("fs");

const downloadGoogleDocContent = () => {
  const fileName = process.env.FILENAME || "page";
  fetch(`http://127.0.0.1:6006/${process.env.DOCID}`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })
    .then((resp) => resp.json())
    .then((json) => {
      if (json.code === 404) {
        console.log(
          `❌ Oops! Download returned a 404 error code: ${json.message} Did you forget to inclue a document id?`
        );
      } else {
        fs.writeFile(
          `src/${fileName}-content.js`,
          `export const ${fileName}Content = ${JSON.stringify(json)}`,
          (err) => {
            // In case of a error throw err.
            if (err) throw err;
          }
        );
        console.log(
          `✅ Downloaded district page content from Google Docs and saved it in page-content.js`
        );
      }
    })
    .catch((err) =>
      console.error(`Could not download page content from Google Docs`, err)
    );
};

function generateSitemapXML() {
  const root = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const end = "</urlset>";

  /**
   * Date the site was last updated, with time removed (just date)
   */
  const lastUpdated = process.env.REACT_APP_UPDATE_DATE.slice(0, 10);

  const url = `<url><loc>${process.env.REACT_APP_DOMAIN}${process.env.REACT_APP_SLUG}/</loc><lastmod>${lastUpdated}</lastmod></url>`;

  const xml = root + url + end;

  // Write the XML to a file
  fs.writeFileSync("public/sitemap.xml", xml);

  console.log("Generated sitemap at public/sitemap.xml");
}

module.exports = {
  downloadGoogleDocContent,
  generateSitemapXML,
};
