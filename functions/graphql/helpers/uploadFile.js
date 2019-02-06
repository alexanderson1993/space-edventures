const { storage } = require("../connectors/firebase");

module.exports = async function uploadFile(picture, path) {
  const file = storage()
    .bucket()
    .file(path);
  return new Promise((resolve, reject) => {
    const stream = file.createWriteStream({
      metadata: { contentType: picture.mimetype },
      predefinedAcl: "publicRead"
    });
    stream.on("error", err => {
      reject(err);
    });
    stream.on("finish", () => {
      resolve(file);
    });
    stream.end(picture.buffer);
  });
};
