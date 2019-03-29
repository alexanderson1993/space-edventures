export default function compress(dataUri) {
  const width = 400;
  const height = 400;

  return new Promise(resolve => {
    const img = new Image();
    img.src = dataUri;
    img.onload = () => {
      const elem = document.createElement("canvas");
      elem.width = width;
      elem.height = height;
      const ctx = elem.getContext("2d");
      // img.width and img.height will contain the original dimensions
      ctx.drawImage(img, 0, 0, width, height);
      ctx.canvas.toBlob(
        blob => {
          const file = new File([blob], "profile-image", {
            type: "image/jpeg",
            lastModified: Date.now()
          });
          resolve(file);
        },
        "image/jpeg",
        1
      );
    };
  });
}
