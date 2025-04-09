import { NextRequest } from "next/server";
import { createSettingController } from "@/lib/factories/settingFactory";
import { isAuthenticated } from "@/lib/middlewares";
import { validateSettingInput } from "@/lib/middlewares/validateSettingInput";

/**
 * @openapi
 * paths:
 *   /api/setting:
 *     post:
 *       summary: Create or update the system settings
 *       description: This endpoint allows administrators to create or update the system settings.
 *       tags:
 *         - Setting
 *       parameters:
 *         - in: header
 *           name: Authorization
 *           required: true
 *           schema:
 *             type: string
 *             example: Bearer <your_token_here>
 *           description: Authorization token required to access this endpoint.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 organizationInfo:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Ngyungne Practice"
 *                     address:
 *                       type: string
 *                       example: "Jorpati, Gokarneshwor 5, Kathmandu, Nepal"
 *                     email:
 *                       type: string
 *                       example: "donation@ngyungne.org"
 *                     phone:
 *                       type: string
 *                       example: "+977 9818123174"
 *                     socialLinks:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           platform:
 *                             type: string
 *                             example: "Facebook"
 *                           url:
 *                             type: string
 *                             example: "https://facebook.com/ngyungnepractice"
 *                 paymentInfo:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         enum: [BANK, ESEWA, KHALTI, OTHER]
 *                         example: "BANK"
 *                       bank:
 *                         type: object
 *                         properties:
 *                           accountName:
 *                             type: string
 *                             example: "Ngyungne Practice"
 *                           branchName:
 *                             type: string
 *                             example: "Kathmandu Branch"
 *                           bankName:
 *                             type: string
 *                             example: "Nepal Bank"
 *                           accountNumber:
 *                             type: string
 *                             example: "1234567890"
 *                           qrCode:
 *                             type: string
 *                             example: "https://example.com/qr-code.png"
 *                       digitalWallet:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "9812345678"
 *                           qrCode:
 *                             type: string
 *                             example: "https://example.com/qr-code.png"
 *                       other:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "Cash on Delivery"
 *                           details:
 *                             type: string
 *                             example: "Pay when you arrive at the retreat"
 *                           qrCode:
 *                             type: string
 *                             example: "https://example.com/qr-code.png"
 *                       isActive:
 *                         type: boolean
 *                         example: true
 *                 metaInfo:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       example: "Ngyungne Practice"
 *                     description:
 *                       type: string
 *                       example: "Ngyungne Practice is a serene space in Nepal dedicated to deepening spiritual practice and meditation, offering a peaceful environment for personal growth and healing through traditional methods."
 *                     keywords:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Ngyungne Practice", "meditation", "spiritual growth", "Nepal retreats"]
 *                     ogImage:
 *                       type: string
 *                       example: "https://example.com/og-image.jpg"
 *                     favicon:
 *                       type: string
 *                       example: "https://example.com/favicon.ico"
 *                     twitterHandle:
 *                       type: string
 *                       example: "@ngyungnepractice"
 *       responses:
 *         201:
 *           description: Settings successfully created or updated
 *         400:
 *           description: Bad request if the input is invalid
 *         401:
 *           description: Unauthorized if the request is not authenticated
 *         500:
 *           description: Internal server error
 *     get:
 *       summary: Get the system settings
 *       description: This endpoint retrieves the current system settings.
 *       tags:
 *         - Setting
 *       responses:
 *         200:
 *           description: Settings retrieved successfully
 *         404:
 *           description: Settings not found
 *         500:
 *           description: Internal server error
 *     patch:
 *       summary: Update the system settings
 *       description: This endpoint allows administrators to update the system settings.
 *       tags:
 *         - Setting
 *       parameters:
 *         - in: header
 *           name: Authorization
 *           required: true
 *           schema:
 *             type: string
 *             example: Bearer <your_token_here>
 *           description: Authorization token required to access this endpoint.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 organizationInfo:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     address:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     socialLinks:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           platform:
 *                             type: string
 *                           url:
 *                             type: string
 *                 paymentInfo:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         enum: [BANK, ESEWA, KHALTI, OTHER]
 *                       bank:
 *                         type: object
 *                       digitalWallet:
 *                         type: object
 *                       other:
 *                         type: object
 *                       isActive:
 *                         type: boolean
 *                 metaInfo:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                     keywords:
 *                       type: array
 *                       items:
 *                         type: string
 *                     ogImage:
 *                       type: string
 *                     favicon:
 *                       type: string
 *                     twitterHandle:
 *                       type: string
 *       responses:
 *         200:
 *           description: Settings successfully updated
 *         400:
 *           description: Bad request if the input is invalid
 *         401:
 *           description: Unauthorized if the request is not authenticated
 *         404:
 *           description: Settings not found
 *         500:
 *           description: Internal server error
 *     delete:
 *       summary: Reset the system settings to defaults
 *       description: This endpoint allows administrators to reset the system settings to default values.
 *       tags:
 *         - Setting
 *       parameters:
 *         - in: header
 *           name: Authorization
 *           required: true
 *           schema:
 *             type: string
 *             example: Bearer <your_token_here>
 *           description: Authorization token required to access this endpoint.
 *       responses:
 *         200:
 *           description: Settings successfully reset to defaults
 *         401:
 *           description: Unauthorized if the request is not authenticated
 *         404:
 *           description: Settings not found
 *         500:
 *           description: Internal server error
 */

export async function POST(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const validationResult = await validateSettingInput(req);
  if ("errors" in validationResult) {
    return validationResult.errors;
  }

  const settingController = createSettingController();
  return settingController.createSetting(validationResult.data);
}

export async function GET() {
  const settingController = createSettingController();
  return settingController.getSetting();
}

export async function PATCH(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const validationResult = await validateSettingInput(req);
  if ("errors" in validationResult) {
    return validationResult.errors;
  }

  const settingController = createSettingController();
  return settingController.updateSetting(validationResult.data);
}

export async function DELETE(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const settingController = createSettingController();
  return settingController.deleteSetting();
}
