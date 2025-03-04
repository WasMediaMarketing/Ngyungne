// import { NextRequest, NextResponse } from "next/server";
// import { handleResponse } from "@/lib/utils/responseHandler";
// import { uploadHandler } from "@/lib/utils/uploadHandler";

// // // Define the UploadResponse type (based on expected response from Cloudinary)
// // type UploadResponse = {
// //   url: string;
// // };

// // This is a server-side API route handler in Next.js
// export async function POST(req: NextRequest) {
//   console.log("new update here!");

//   // try {
//     const imageUrl = await uploadHandler(req);
//     // Return the URL of the uploaded image
//     return handleResponse({ url: imageUrl });
//   } catch (error) {
//     console.log(error);
//     // Handle error appropriately
//     return NextResponse.json(
//       { message: "Error during upload", error: error },
//       { status: 500 }
//     );
//   }
// }
