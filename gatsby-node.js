const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const createCloudinaryNodes = async (gatsbyUtils) => {
  const { actions, reporter, createNodeId, createContentDigest } = gatsbyUtils;
  const { createNode } = actions;

  const result = await cloudinary.api.resources({
    resource_type: "image",
  });

  reporter.info(`Fetched Cloudinary Assets >>> ${result.resources.length}`);

  result.resources.forEach((resource) => {
    reporter.info(`Create CloudinaryAsset >>> ${resource.public_id}`);
    createNode({
      id: createNodeId(resource.public_id),
      ...resource,
      internal: {
        type: "CloudinaryAsset",
        content: JSON.stringify(resource),
        contentDigest: createContentDigest(resource),
      },
    });
  });
};

exports.sourceNodes = async (gatsbyUtils) => {
  const { reporter } = gatsbyUtils;

  reporter.info("Sourcing nodes - START");
  await createCloudinaryNodes(gatsbyUtils);
  reporter.info("Sourcing nodes - DONE");
};
