import { NextRequest, NextResponse } from "next/server";
import {
  PaymentMethodType,
  SocialLink,
  PaymentInfo,
} from "@/types/setting.types";

export async function validateSettingInput(
  req: NextRequest
): Promise<{ errors: NextResponse } | { data: any }> {
  try {
    const data = await req.json();
    const errors: string[] = [];

    // Validate organization info
    if (data.organizationInfo) {
      const { name, address, email, phone, socialLinks } =
        data.organizationInfo;

      if (!name) errors.push("Organization name is required");
      if (!address) errors.push("Organization address is required");

      if (!email) {
        errors.push("Organization email is required");
      } else if (!/^\S+@\S+\.\S+$/.test(email)) {
        errors.push("Invalid email format");
      }

      if (!phone) errors.push("Organization phone is required");

      if (socialLinks && !Array.isArray(socialLinks)) {
        errors.push("Social links must be an array");
      } else if (socialLinks) {
        socialLinks.forEach((link: SocialLink, index: number) => {
          if (!link.platform)
            errors.push(`Social link #${index + 1} platform is required`);
          if (!link.url)
            errors.push(`Social link #${index + 1} URL is required`);
        });
      }
    }

    // Validate payment info
    if (data.paymentInfo) {
      if (!Array.isArray(data.paymentInfo)) {
        errors.push("Payment info must be an array");
      } else {
        data.paymentInfo.forEach((payment: PaymentInfo, index: number) => {
          if (!payment.type) {
            errors.push(`Payment method #${index + 1} type is required`);
          } else if (!Object.values(PaymentMethodType).includes(payment.type)) {
            errors.push(`Payment method #${index + 1} has invalid type`);
          }

          // Validate based on payment type
          switch (payment.type) {
            case PaymentMethodType.BANK:
              if (!payment.bank) {
                errors.push(
                  `Bank info is required for BANK payment method #${index + 1}`
                );
              } else {
                const { accountName, branchName, bankName, accountNumber } =
                  payment.bank;
                if (!accountName)
                  errors.push(
                    `Account name is required for BANK payment method #${
                      index + 1
                    }`
                  );
                if (!branchName)
                  errors.push(
                    `Branch name is required for BANK payment method #${
                      index + 1
                    }`
                  );
                if (!bankName)
                  errors.push(
                    `Bank name is required for BANK payment method #${
                      index + 1
                    }`
                  );
                if (!accountNumber)
                  errors.push(
                    `Account number is required for BANK payment method #${
                      index + 1
                    }`
                  );
              }
              break;

            case PaymentMethodType.ESEWA:
            case PaymentMethodType.KHALTI:
              if (!payment.digitalWallet) {
                errors.push(
                  `Digital wallet info is required for ${
                    payment.type
                  } payment method #${index + 1}`
                );
              } else if (!payment.digitalWallet.id) {
                errors.push(
                  `ID is required for ${payment.type} payment method #${
                    index + 1
                  }`
                );
              }
              break;

            case PaymentMethodType.OTHER:
              if (!payment.other) {
                errors.push(
                  `Other payment info is required for OTHER payment method #${
                    index + 1
                  }`
                );
              } else {
                const { name, details } = payment.other;
                if (!name)
                  errors.push(
                    `Name is required for OTHER payment method #${index + 1}`
                  );
                if (!details)
                  errors.push(
                    `Details are required for OTHER payment method #${
                      index + 1
                    }`
                  );
              }
              break;
          }
        });
      }
    }

    // Validate meta info
    if (data.metaInfo) {
      const { title, description, keywords } = data.metaInfo;

      if (!title) errors.push("Meta title is required");
      if (!description) errors.push("Meta description is required");

      if (keywords) {
        if (!Array.isArray(keywords)) {
          errors.push("Meta keywords must be an array");
        }
      }
    }

    if (errors.length > 0) {
      return {
        errors: NextResponse.json({ errors }, { status: 400 }),
      };
    }

    return { data };
  } catch (error) {
    console.error("Error validating setting input:", error);
    return {
      errors: NextResponse.json(
        { message: "Invalid request body" },
        { status: 400 }
      ),
    };
  }
}
