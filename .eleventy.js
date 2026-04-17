module.exports = function (eleventyConfig) {
  // Copy static assets to output
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy({ "src/css/styles.css": "css/styles.css" });
  eleventyConfig.addPassthroughCopy({ CNAME: "CNAME" });

  // Sorted collection of all content sections
  eleventyConfig.addCollection("sections", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/content/*.md")
      .sort((a, b) => (a.data.order ?? 99) - (b.data.order ?? 99));
  });

  return {
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
      data: "_data",
    },
  };
};
