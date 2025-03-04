// import { IncomingForm, File } from "formidable";
// import { v2 as cloudinary } from "cloudinary";
// import { NextRequest } from "next/server";
// import { Readable } from "stream"; // Import the stream module

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export const config = {
//   api: {
//     bodyParser: false, // Disable default body parser
//   },
// };

// // Define the upload handler for NextRequest
// const streamToReadable = (stream: ReadableStream<Uint8Array>) => {
//   return new Readable({
//     read() {
//       this.push(Buffer.from(stream));
//       this.push(null);
//     },
//   });
// };
// export const uploadHandler = async (req: NextRequest) => {
//   const form = new IncomingForm();

//   // Create a Promise to handle the form parsing
//   const formPromise = new Promise((resolve, reject) => {
//     // Cast req.body as a readable stream
//     const readableStream = streamToReadable(req.body);

//     // Parse the form data from the readable stream
//     form.parse(readableStream, async (err, fields, files) => {
//       if (err) {
//         console.log(err);
//         return reject("Error during file upload");
//       }

//       if (!files.image || Array.isArray(files.image)) {
//         console.log("No file or invalid file");
//         return reject("Invalid file uploaded");
//       }

//       try {
//         const file: File = files.image[0]; // Adjust according to your form data
//         const uploadedImage = await cloudinary.uploader.upload(file.filepath, {
//           folder: "Ngyune", // optional folder
//           use_filename: true, // optional
//         });

//         resolve(uploadedImage.secure_url); // Return the uploaded image URL
//       } catch (uploadError) {
//         console.log(uploadError);
//         reject("Cloudinary upload failed");
//       }
//     });
//   });

//   return formPromise;
// };
