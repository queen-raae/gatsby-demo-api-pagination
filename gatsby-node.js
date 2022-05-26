const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const createCloudinaryNodes = async () => {
  const { actions, reporter, createNodeId, createContentDigest } = gatsbyUtils;
  const { createNode } = actions;

  // Let get to work!
};

exports.sourceNodes = async (gatsbyUtils) => {
  const { reporter } = gatsbyUtils;

  reporter.info("Sourcing nodes - START");
  await createCloudinaryNodes(gatsbyUtils);
  reporter.info("Sourcing nodes - DONE");
};
