const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const createCloudinaryNodes = async (gatsbyUtils, { limit, nextCursor }) => {
  const { actions, reporter, createNodeId, createContentDigest } = gatsbyUtils;
  const { createNode } = actions;

  const result = await cloudinary.api.resources({
    resource_type: "image",
    max_results: limit < 10 ? limit : 10,
    next_cursor: nextCursor,
  });

  reporter.info(
    `Fetched Cloudinary Assets >>> ${result.resources.length} from ${nextCursor}`
  );

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

  // If no next cursor is returned from Cloudinary, no more resources, so stop.
  // If limit is equal to or less than 10 its the last round needed, so stop.
  if (result.next_cursor && limit > 10) {
    await createCloudinaryNodes(gatsbyUtils, {
      // Next round should ask for 10 less, so it goes 42, 32, 22, 12, 2
      limit: limit - 10,
      nextCursor: result.next_cursor,
    });
  }
};

exports.sourceNodes = async (gatsbyUtils) => {
  const { reporter } = gatsbyUtils;

  reporter.info("Sourcing nodes - START");
  await createCloudinaryNodes(gatsbyUtils, { limit: 42 });
  reporter.info("Sourcing nodes - DONE");
};
