import Image, { generateHTML } from "@11ty/eleventy-img";
import console, { profile } from "console";
import { glob } from "glob";
import path from "path";
import exifr from 'exifr'
import { DateTime } from "luxon";

const THUMB = 250;
const FULL = 650;

async function generateImages(eleventyConfig) {
  const processedPhotos = [] 
  let options = {
    widths: [THUMB, FULL],
    formats: ["png"],
    outputDir: path.join(eleventyConfig.dir.output, "img"), // Advanced usage note: `eleventyConfig.dir` works here because we’re using addPlugin.
    filenameFormat: function (_id, src, width, format, _options) {
      let origFilename = src.split("/").pop();
      //strip off the file type, this could probably be one line of fancier JS
      let parts = origFilename.split(".");
      parts.pop();
      origFilename = parts.join(".");

      if (width === THUMB) return `album/thumb-${origFilename}.${format}`;
      else return `album/${origFilename}.${format}`;
    },
  };

  let files = await glob("./rawphotos/*.{jpg,jpeg,png,gif}");
  console.log("processing photo album");
  for (const f of files) {
    // Save image
    const md = await Image(f, options);

    const exifData = await exifr.parse(f)
    const isVertical = md.png[0].width < md.png[0].height
    const data = {
      full_url: md.png[1].url,
      thumb_url: md.png[0].url,
      camera: exifData.Model,
      vertical: isVertical,
      takenAt: DateTime.fromJSDate(exifData.CreateDate).toUnixInteger(),
      iso: exifData.ISO,
      shutterSpeed: exifData.ShutterSpeedValue,
      aperture: exifData.ApertureValue,
      description: "",
    }

    processedPhotos.push(data)
  }
  console.log(`processed ${processedPhotos.length} photos`);

	await eleventyConfig.addCollection("albumPhotos", async (_collectionsApi) => {
		return processedPhotos;
	});
}

export function relativeToInputPath(inputPath, relativeFilePath) {
  let split = inputPath.split("/");
  split.pop();

  return path.resolve(split.join(path.sep), relativeFilePath);
}

export function isFullUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

export default function (eleventyConfig) {
  eleventyConfig.on("beforeBuild", async () => {
    console.log("beforeBuild");
    await generateImages(eleventyConfig);
    console.log("images done");
  });

  // Eleventy Image shortcode
  // https://www.11ty.dev/docs/plugins/image/
  eleventyConfig.addAsyncShortcode(
    "image",
    async function imageShortcode(
      src,
      alt,
      widths = [300, 600],
      sizes = "100vh",
    ) {
      // Full list of formats here: https://www.11ty.dev/docs/plugins/image/#output-formats
      // Warning: Avif can be resource-intensive so take care!
      let formats = ["auto"];
      let input;
      if (isFullUrl(src)) {
        input = src;
      } else {
        input = relativeToInputPath(this.page.inputPath, src);
      }

      let sharpOptions = {};

      if (src.indexOf(".gif") > 0) {
        sharpOptions.animated = true;
      }

      let metadata = await Image(input, {
        widths: widths || ["auto"],
        formats,
        sharpOptions,
        outputDir: path.join(eleventyConfig.dir.output, "img"), // Advanced usage note: `eleventyConfig.dir` works here because we’re using addPlugin.
      });

      // TODO loading=eager and fetchpriority=high
      let imageAttributes = {
        alt,
        sizes,
        loading: "lazy",
        decoding: "async",
      };

      return generateHTML(metadata, imageAttributes);
    },
  );
}
