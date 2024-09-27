var path = require("path");
const { DateTime } = require("luxon");
const markdownIt = require("markdown-it");
const markdownItEleventyImg = require("markdown-it-eleventy-img");
const markdownItAnchor = require("markdown-it-anchor");
const { tocPlugin } = require("@mdit-vue/plugin-toc");

const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginBundle = require("@11ty/eleventy-plugin-bundle");
const pluginNavigation = require("@11ty/eleventy-navigation");

const faviconsPlugin = require("eleventy-plugin-gen-favicons");

const pluginDrafts = require("./eleventy.config.drafts.js");
const pluginImages = require("./eleventy.config.images.js");

/** @param {import('@11ty/eleventy').UserConfig} eleventyConfig */
module.exports = function (eleventyConfig) {
  // Copy the contents of the `public` folder to the output folder
  // For example, `./public/css/` ends up in `_site/css/`
  eleventyConfig.addPassthroughCopy({
    "./public/": "/",
    "./node_modules/prismjs/themes/prism-okaidia.css": "/css/prism-okaidia.css",
  });

  // Run Eleventy when these files change:
  // https://www.11ty.dev/docs/watch-serve/#add-your-own-watch-targets

  // Watch content images for the image pipeline.
  eleventyConfig.addWatchTarget("content/**/*.{svg,webp,png,jpeg}");

  // App plugins
  eleventyConfig.addPlugin(pluginDrafts);
  eleventyConfig.addPlugin(pluginImages);

  // Official plugins
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSyntaxHighlight, {
    preAttributes: { tabindex: 0 },
  });
  eleventyConfig.addPlugin(pluginNavigation);
  eleventyConfig.addPlugin(pluginBundle);

  eleventyConfig.addPlugin(faviconsPlugin, {});

  // Filters
  eleventyConfig.addFilter("readableDate", (dateObj, format, zone) => {
    let date = dateObj
    if (typeof dateObj === "string") {
      date = new Date(dateObj)
    }

    // Formatting tokens for Luxon: https://moment.github.io/luxon/#/formatting?id=table-of-tokens
    return DateTime.fromJSDate(date, { zone: zone || "utc" }).toFormat(
      format || "dd LLLL yyyy"
    );
  });

  eleventyConfig.addFilter("legacyComments", (comments, postId) => {
    const threadComments = comments.filter(c => c.thread["_dsq:id"] == postId) 

    return threadComments;
  });

  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    // dateObj input: https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-LL-dd");
  });

  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter("head", (array, n) => {
    if (!Array.isArray(array) || array.length === 0) {
      return [];
    }
    if (n < 0) {
      return array.slice(n);
    }

    return array.slice(0, n);
  });

  // Return the smallest number argument
  eleventyConfig.addFilter("min", (...numbers) => {
    return Math.min.apply(null, numbers);
  });

  // Return all the tags used in a collection
  eleventyConfig.addFilter("getAllTags", (collection) => {
    let tagSet = new Set();
    for (let item of collection) {
      (item.data.tags || []).forEach((tag) => tagSet.add(tag));
    }
    return Array.from(tagSet);
  });

  eleventyConfig.addFilter("filterTagList", function filterTagList(tags) {
    return (tags || []).filter(
      (tag) =>
        ["all", "nav", "post", "posts", "games", "tutorials"].indexOf(tag) ===
        -1
    );
  });

  eleventyConfig.addFilter("inputPathDir", (inputPath) => {
    let splitDirs = inputPath.split("/");
    splitDirs.pop();
    splitDirs.splice(0, 2);
    return splitDirs.join("/");
  });

  eleventyConfig.addFilter("getRandom", function (items) {
    let selected = items[Math.floor(Math.random() * items.length)];
    return selected;
  });

  eleventyConfig.addFilter("unique", (arr = []) => [...new Set(arr)]);

  eleventyConfig.addFilter("jsonString", (json) => {
    return JSON.stringify(json)
  })

  eleventyConfig.setLibrary(
    "md",
    markdownIt({
      html: true,
      breaks: true,
      linkify: true,
    })
      .use(markdownItEleventyImg, {
        imgOptions: {
          widths: [600, 300],
          urlPath: "/images/",
          outputDir: "./_site/images/",
          formats: ["auto"],
          sharpOptions: {
            animated: true,
            limitInputPixels: false,
          },
        },
        globalAttributes: {
          class: "markdown-image",
          decoding: "async",
          sizes: "100vw",
        },
        resolvePath: (filepath, env) =>
          path.join(path.dirname(env.page.inputPath), filepath),
      })
      .use(tocPlugin, {})
  );

  // Customize Markdown library settings:
  eleventyConfig.amendLibrary("md", (mdLib) => {
    mdLib.use(markdownItAnchor, {
      permalink: markdownItAnchor.permalink.ariaHidden({
        placement: "after",
        class: "header-anchor",
        symbol: "#",
        ariaHidden: false,
      }),
      level: [1, 2, 3, 4],
      slugify: eleventyConfig.getFilter("slugify"),
    });
  });

  eleventyConfig.addShortcode("currentBuildDate", () => {
    return new Date().toISOString();
  });

  eleventyConfig.addShortcode("randomPage", (allPages, elementId) => {
    const pageArray = allPages.map((p) => '"' + p.url + '"');
    return `<script>
      const anchor = document.getElementById("${elementId}");
      const pages = [${pageArray.join(",")}];
      const random = Math.floor(Math.random() * pages.length);
      anchor.href = pages[random];
    </script>`;
  });

  // Features to make your build faster (when you need them)

  // If your passthrough copy gets heavy and cumbersome, add this line
  // to emulate the file copy on the dev server. Learn more:
  // https://www.11ty.dev/docs/copy/#emulate-passthrough-copy-during-serve

  // eleventyConfig.setServerPassthroughCopyBehavior("passthrough");

  return {
    // Control which files Eleventy will process
    // e.g.: *.md, *.njk, *.html, *.liquid
    templateFormats: ["md", "njk", "html", "liquid", "ejs"],

    // Pre-process *.md files with: (default: `liquid`)
    //markdownTemplateEngine: "njk",

    // Pre-process *.html files with: (default: `liquid`)
    htmlTemplateEngine: "njk",

    // These are all optional:
    dir: {
      input: "content", // default: "."
      includes: "../_includes", // default: "_includes"
      data: "../_data", // default: "_data"
      output: "_site",
    },

    // -----------------------------------------------------------------
    // Optional items:
    // -----------------------------------------------------------------

    // If your site deploys to a subdirectory, change `pathPrefix`.
    // Read more: https://www.11ty.dev/docs/config/#deploy-to-a-subdirectory-with-a-path-prefix

    // When paired with the HTML <base> plugin https://www.11ty.dev/docs/plugins/html-base/
    // it will transform any absolute URLs in your HTML to include this
    // folder name and does **not** affect where things go in the output folder.
    pathPrefix: "/",
  };
};
