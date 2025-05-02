require("dotenv").config();
const fs = require("fs");
const fetch = require("node-fetch");
const cheerio = require("cheerio");

const THE_CITY_COVERAGE_URL = "https://www.thecity.nyc/category/campaign-2025/";

const scrapeLinksToCoverage = async () => {
  try {
    const response = await fetch(THE_CITY_COVERAGE_URL);
    const body = await response.text();
    const $ = cheerio.load(body);

    const links = [];
    $(".entry-title a").each((i, elem) => {
      if (i < 3) {
        const text = $(elem).text().trim();
        const href = $(elem).attr("href");
        links.push({ text, href });
      }
    });

    if (links.length < 3) {
      throw new Error(
        "Less than 3 links found on THE CITY's Election Coverage page"
      );
    }

    for (let i = 0; i < links.length; i++) {
      if (!links[i].text || links[i].text.length === 0) {
        throw new Error(
          `Link ${i + 1} on THE CITY's Election Coverage page is missing text`
        );
      }
      if (!links[i].href || links[i].href.length < 6) {
        throw new Error(
          `Link ${i + 1} on THE CITY's Election Coverage page is missing href`
        );
      }
    }

    fs.writeFile(
      "src/coverage-links.js",
      `export const coverageLinksTheCity = ${JSON.stringify(links)}`,
      (err) => {
        // In case of a error throw err.
        if (err) throw err;
      }
    );
  } catch (err) {
    console.error("Scraping failed:", err);
    process.exit(1);
  }
};

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
          `✅ Downloaded ${fileName} content from Google Docs and saved it in ${fileName}-content.js`
        );
        if (fileName === "candidate") {
          fs.writeFile(
            `src/candidate-list.json`,
            `${JSON.stringify(
              Object.entries(json)
                .filter((candidate) => candidate[0] !== "candidateX")
                .map((candidate) => ({ name: candidate[1].name }))
            )}`,
            (err) => {
              // In case of a error throw err.
              if (err) throw err;
            }
          );
          console.log(
            `✅ Downloaded candidate list from Google Docs and saved it in candidate-list.json`
          );
        }
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
  scrapeLinksToCoverage,
  downloadGoogleDocContent,
  generateSitemapXML,
};
