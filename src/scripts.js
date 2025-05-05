require("dotenv").config();
const fs = require("fs");
const https = require("https");
const fetch = require("node-fetch");
const cheerio = require("cheerio");

const GOTHAMIST_API_URL =
  "https://api-prod.gothamist.com/api/v2/pages/?type=news.ArticlePage&fields=listing_title,url&order=-publication_date&show_on_index_listing=true&limit=3&tag_slug=politics";

const THE_CITY_COVERAGE_URL = "https://www.thecity.nyc/category/campaign-2025/";

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (err) {
            reject(`Error parsing JSON: ${err.message}`);
          }
        });
      })
      .on("error", reject);
  });
}

function testValidCoverageLinks(links, source) {
  if (links.length < 3) {
    throw new Error(
      `Less than 3 links found on ${source}'s Election Coverage page`
    );
  }

  for (let i = 0; i < links.length; i++) {
    if (!links[i].text || links[i].text.length < 5) {
      throw new Error(
        `Link ${i + 1} on ${source}'s Election Coverage page is missing text`
      );
    }
    if (!links[i].href || links[i].href.length < 6) {
      throw new Error(
        `Link ${i + 1} on ${source}'s Election Coverage page is missing href`
      );
    }
  }
}

const getGothamistLinks = async (outputPath = "src/gothamist-links.js") => {
  const response = await fetchJson(GOTHAMIST_API_URL);

  if (!Array.isArray(response.items)) {
    throw new Error("API response does not contain an items array.");
  }

  const links = response.items.map((item) => ({
    text: item.title,
    href: item.url,
  }));

  testValidCoverageLinks(links, "Gothamist");

  fs.mkdirSync(outputPath.split("/").slice(0, -1).join("/"), {
    recursive: true,
  });

  fs.writeFileSync(
    outputPath,
    `export const coverageLinksGothamist = ${JSON.stringify(links)};`,
    "utf-8",
    (err) => {
      // In case of a error throw err.
      if (err) throw err;
    }
  );

  console.log(`✅ Successfully wrote ${links.length} links to ${outputPath}`);
};

const getTheCityLinks = async (outputPath = "src/the-city-links.js") => {
  try {
    const response = await fetch(THE_CITY_COVERAGE_URL);
    const body = await response.text();
    const $ = cheerio.load(body);

    let links = [];
    $(".entry-title a").each((i, elem) => {
      if (i < 3) {
        const text = $(elem).text().trim();
        const href = $(elem).attr("href");
        links.push({ text, href });
      }
    });

    testValidCoverageLinks(links, "THE CITY");

    fs.mkdirSync(outputPath.split("/").slice(0, -1).join("/"), {
      recursive: true,
    });

    fs.writeFile(
      outputPath,
      `export const coverageLinksTheCity = ${JSON.stringify(links)};`,
      (err) => {
        // In case of a error throw err.
        if (err) throw err;
      }
    );

    console.log(`✅ Successfully wrote ${links.length} links to ${outputPath}`);
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
  getTheCityLinks,
  getGothamistLinks,
  downloadGoogleDocContent,
  generateSitemapXML,
};
