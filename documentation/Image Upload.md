# Image Upload

Space EdVentures uses a couple of techniques to upload images properly:

1. Load the image using [JavaScript Load Image](https://github.com/blueimp/JavaScript-Load-Image/). The reason for this is that images can be oriented differently than expected, but it can be corrected based on EXIF data. This library handles that automatically, and has a pretty small bundle size.

2. [React Image Crop](https://github.com/DominicTobias/react-image-crop) allows the user to then adjust and crop the image however they want. It allows for aspect ratio locking, so we can constrain their images to be squares.

3. [GraphQL Uploader Scalar](https://github.com/jaydenseric/graphql-upload) to pass the image from the client to the server.

4. [Firebase Storage](https://firebase.google.com/products/storage/) to store the images.
