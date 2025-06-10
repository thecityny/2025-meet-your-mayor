# Meet Your Mayor 2025

**A multi-page Gatsby-powered news application by [THE CITY](https://www.thecity.nyc) and [Gothamist](https://gothamist.com/), designed to inform New Yorkers about the 2025 NYC mayoral candidates.**

[![See it Live](https://img.shields.io/badge/See%20it%20Live-blue?style=for-the-badge)](https://projects.thecity.nyc/meet-your-mayor-2025-election-quiz-candidates/)


## 🛠️ Technologies Used

- **[Gatsby](https://www.gatsbyjs.com/)**: A React-based open-source framework for creating fast websites.
- **[React](https://react.dev/)**: For building dynamic user interfaces.
- **[TypeScript](https://www.typescriptlang.org/)**: Ensures type safety and better developer experience.
- **[ArchieML](https://archieml.org/)**: For syncing site content with Google Docs used by editorial staff.
- **[Zustand](https://zustand.docs.pmnd.rs/getting-started/introduction)**: For global state management (see [useAppStore.ts](src/useAppStore.ts) for implementation).

## 📁 Project Structure

```
2025-meet-your-mayor/
├── src/                  # Source files
│   ├── @types/           # Custom type declarations
│   ├── assets/           # Logos
│   ├── components/       # Reusable UI components
│   ├── pages/            # Pages (using Gatsby page logic)
│   └── styles/           # Custom SCSS styles
├── static/               # Static assets, like photos and illustrations
├── .github/              # Scripts for running Github Actions
├── .env                  # Client-accessible environment variables
├── candidate-content.js  # JS object with each candidate's info and question responses
├── candidate-list.json   # A JSON list of each candidate and their full name
├── question-content.js   # JS object with each quiz question and set of responses
├── gatsby-config.js      # Gatsby configuration
├── gatsby-node.js        # Gatsby Node APIs
├── package.json          # Project metadata and dependencies
└── README.md             # Project documentation
└── LICENSE               # Project license
```

## ⚙️ Getting Started

First you’ll need to clone this repository down to your computer to work with the code.

Open up your terminal and cd to your code folder. Clone the project into your folder. This will copy the project onto your computer.

```sh
gh repo clone https://github.com/thecityny/2025-meet-your-mayor
```

Once the repository has finished downloading, cd into it and install the Node.js dependencies.

```sh
cd 2025-meet-your-mayor
npm install
```

Once the dependencies have been installed, you’re ready to preview the project. Run the following to start the test server.

```sh
npm start
```

Now go to `localhost:8000` in your browser. You should see a copy of the Meet Your Mayor site ready for your customizations.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:8000](http://localhost:8000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `FILENAME=XXXXXX DOCID=XXXXXX npm run download-content` (CUSTOM)

Runs the `downloadGoogleDocContent` function inside `src/scripts.js`. This function uses [ArchieML](http://archieml.org/) to download content from a Google Doc and save it in a JavaScript object variable in `[FILENAME]-content.js` in the `src` directory.

This current iteration of the project downloads from two different google docs via the two options: `FILENAME = candidate` and `FILENAME = questions`. However, you can edit the `downloadGoogleDocContent` function inside `src/scripts.js` to work with whatever set of documents makes sense for your project. Using this integration is totally optional — feel free to edit the content in `candidate-content.js`, `question-content.js`, and `candidate-list.json` directly.

NOTE: before running this command, you must globally install the AML Google Doc Server on your computer by running:

```
npm install -g aml-gdoc-server
```

Once installed, you then must log in to google by running:

```
aml-gdoc-server
```

and following the steps in the terminal. Once that's running, you should see a message that says "The aml-gdoc-server is up and listening at http://127.0.0.1:6006." Keep this terminal window open and start a new terminal to run further commands.

Lastly, find what google doc you want to pull content from and copy the "Document ID" from the URL, which is the long string of characters
at the end of the URL. Use this ID in the above command where it says `DOCID=XXXXXX`.

#### Common Error: Refreshing Google Access token

Every few weeks or so, depending on your account settings, you may get an error like `GaxiosError: invalid_grant`, which means you need to refresh your Google Doc API access. What you need to do is find the `.aml-gdoc-credentials` file you created when you first initiated this integration, delete it, and start over as if setting things up as if for the first time.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

### Using this code as a template

This code is free and open source and you are permitted to use for your own projects under the [Apache 2.0 License](LICENSE) included in this repository. However, before deploying anything publicly using this codebase, you must:

- Change [`_fonts/scss`](src/styles/_fonts.scss) — our fonts are proprietary and are not permitted for use outside of THE CITY's domain. Please change these fonts to ones you own publishing rights to, or use free, web-safe fonts instead.
- Remove [`logo.svg`](src/assets/logo.svg) and [`logo-gothamist.svg`](src/assets/logo-gothamist.svg) — our logos are trademarked and cannot be used without THE CITY and Gothamist's explicit permission. Please remove these logos [from the header](src/components/PageLayout.tsx), or swap in your own logo.
- Remove all items inside the [`static`](static) directory — these are licensed photos and illustrations that only THE CITY and Gothamist are authorized to use.
- Remove analytics infrastructure from [`PageLayout.tsx`](src/components/PageLayout.tsx), including the `Analytics` element and any [Amplitude tracking code](https://amplitude.com/).

Also, as part of our license, we require that any online publication of work built using this software **include a credit and link to THE CITY**. The template includes the suggested sentence “Made with ♥ in NYC...” in the page footer — feel free to leave that in.

Lastly, we want to hear from you! We'd love to know if you are using this code to publish your own projects. Drop us a line at [data@thecity.nyc](mailto:data@thecity.nyc).

## Deploying to AWS

We've set up automatic deployment to AWS S3 based on the [Baker Rig](https://github.com/datadesk/baker) project by the L.A. Times. See these instructions on how to set that up:

### Configuring your account

Before you can deploy an app created by this repository, you will need to configure your Amazon AWS account and add a set of credentials to your GitHub account.

First, you'll need to create two buckets in Amazon's S3 storage service. One is for your staging site. The other is for your production site. For this simple example, each should allow public access and be [configured to serve a static website](https://docs.aws.amazon.com/AmazonS3/latest/userguide/HostingWebsiteOnS3Setup.html).

The names of those buckets should then be stored as GitHub "secrets" accessible to the Actions that deploy the site. You should visit [your settings panel for your account or organization](https://docs.github.com/en/actions/security-guides/encrypted-secrets#creating-encrypted-secrets-for-an-organization). Start by adding these two secrets.

| Name                       | Value                                                  |
| :------------------------- | :----------------------------------------------------- |
| `AWS_S3_STAGING_BUCKET`    | The name of your staging bucket                        |
| `AWS_S3_STAGING_REGION`    | The S3 region where your staging bucket was created    |
| `AWS_S3_PRODUCTION_BUCKET` | The name of your production bucket                     |
| `AWS_S3_PRODUCTION_REGION` | The S3 region where your production bucket was created |

Next you should ensure that you have an key pair from AWS that has the ability to upload public files to your two buckets. The values should also be added to your secrets.

| Name                    | Value              |
| :---------------------- | :----------------- |
| `AWS_ACCESS_KEY_ID`     | The AWS access key |
| `AWS_SECRET_ACCESS_KEY` | The AWS secret key |

### Optional configurations

You can set up a [CloudFront distribution](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-working-with.html) on AWS for both your staging and production buckets — during deployment, Github Actions will invalidate the old distribution to refresh the cache for your site.

Once you create your distributions, copy the distribution IDs and store them as GitHub "secrets" accessible to the Actions that deploy the site.

| Name                                  | Value                                         |
| :------------------------------------ | :-------------------------------------------- |
| `AWS_STAGING_CLOUDFRONT_DISTRIBUTION` | The distribution ID for the staging bucket    |
| `AWS_CLOUDFRONT_DISTRIBUTION`         | The distribution ID for the production bucket |

### Staging your work

[A GitHub Action](https://github.com/datadesk/baker-example-page-template/actions/workflows/deploy-stage.yml) included with this repository will automatically publish a staging version for every branch. For instance, code pushed to the default `main` branch will appear at `https://your-staging-bucket-url/your-repo/main/`.

If you were to create a new git branch called `bugfix` and push your code, you would soon see a new staging version at `https://your-staging-bucket-url/your-repo/bugfix/`.

### Publishing your work

Before you send your page live, you should settle on a final slug for the URL. This will set the subdirectory in your bucket where the page will be published. This feature allows The Times to publish numerous pages inside the same bucket with each page managed by a different repository.

Step one is to enter the slug for your URL into the `.env` configuration file.

```yaml
GATSBY_SLUG: your-page-slug
```

You should also set the domain within the `.env` configuration file to match your production bucket url.

```yaml
GATSBY_DOMAIN: https://your-production-bucket-url/
```

It’s never a bad idea to make sure your slug hasn’t already been taken. You can do that by visiting `https://your-production-bucket-url/your-slug/` and ensuring it returns a page not found error.

Next you commit your change to the configuration file and make sure it’s pushed to the main branch on GitHub.

Visit the releases section of your repository’s page on GitHub. You can find it on the repo’s homepage.

![](https://raw.githubusercontent.com/datadesk/baker-example-page-template/e6659420a61e73b298a67ded6d5e9c210b047cb5/.github/images/releases.png)

Draft a new release.

![](https://raw.githubusercontent.com/datadesk/baker-example-page-template/e6659420a61e73b298a67ded6d5e9c210b047cb5/.github/images/draft-release.png)

There you’ll create a new tag number. A good approach is to start with an x.x.x format number that follows [semantic versioning](https://semver.org/) standards. 1.0.0 is a fine start.

![](https://raw.githubusercontent.com/datadesk/baker-example-page-template/e6659420a61e73b298a67ded6d5e9c210b047cb5/.github/images/version-release.png)

Finally, hit the big green button at the bottom and send out the release.

![](https://raw.githubusercontent.com/datadesk/baker-example-page-template/e6659420a61e73b298a67ded6d5e9c210b047cb5/.github/images/publish-release.png)

Wait a few minutes and your page should show up at `https://your-production-bucket-url/your-slug/`.

## Learn More About Gatsby

- [Documentation](https://www.gatsbyjs.com/docs/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter)
- [Tutorials](https://www.gatsbyjs.com/docs/tutorial/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter)
- [Guides](https://www.gatsbyjs.com/docs/how-to/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter)
- [API Reference](https://www.gatsbyjs.com/docs/api-reference/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter)
- [Plugin Library](https://www.gatsbyjs.com/plugins?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter)
- [Cheat Sheet](https://www.gatsbyjs.com/docs/cheat-sheet/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter)

To learn React, check out the [React documentation](https://reactjs.org/).
