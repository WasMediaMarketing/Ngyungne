import { AboutContent, HeroSection } from "@/lib/models/about.model";
import type {
  IAboutContent,
  IAboutContentInput,
  IAboutContentUpdate,
  ContentType,
  IHeroSection,
} from "@/types/about.types";
import { connectToDatabase } from "@/lib/utils/mongodb";
import type { Types } from "mongoose";

export class AboutService {
  private async initializeDbConnection() {
    await connectToDatabase();
  }

  /**
   * @description Creates a new content item in the system
   * @param {IAboutContentInput} contentData - Data to create the content
   * @returns {Promise<IAboutContent>} The created content
   */
  async createContent(contentData: IAboutContentInput): Promise<IAboutContent> {
    await this.initializeDbConnection();

    // If no order is specified, set it to be the highest order + 1 for that content type
    if (contentData.order === undefined) {
      const highestOrderContent = await AboutContent.findOne({
        contentType: contentData.contentType,
      })
        .sort({ order: -1 })
        .limit(1);
      contentData.order = highestOrderContent
        ? highestOrderContent.order + 1
        : 0;
    }

    const content = new AboutContent({
      ...contentData,
      isVisible:
        contentData.isVisible !== undefined ? contentData.isVisible : true,
    });

    await content.save();
    return content;
  }

  /**
   * @description Retrieves all content items in the system
   * @param {ContentType} contentType - Optional filter for content type
   * @param {boolean} isVisible - Optional filter for visible content only
   * @returns {Promise<IAboutContent[]>} List of all content items
   */
  async getContent(
    contentType?: ContentType,
    isVisible?: boolean
  ): Promise<IAboutContent[]> {
    await this.initializeDbConnection();

    const query: any = {};

    if (contentType) {
      query.contentType = contentType;
    }

    if (isVisible !== undefined) {
      query.isVisible = isVisible;
    }

    return await AboutContent.find(query).sort({ order: 1 });
  }

  /**
   * @description Retrieves a single content item by its ID
   * @param {Types.ObjectId | string} contentId - The ID of the content to retrieve
   * @returns {Promise<IAboutContent | null>} The content found or null if not found
   */
  async getContentById(
    contentId: Types.ObjectId | string
  ): Promise<IAboutContent | null> {
    await this.initializeDbConnection();
    const content = await AboutContent.findById(contentId);
    if (!content) throw new Error("Content not found");
    return content;
  }

  /**
   * @description Updates a content item by its ID
   * @param {Types.ObjectId | string} contentId - The ID of the content to update
   * @param {IAboutContentUpdate} contentData - The data to update the content
   * @returns {Promise<IAboutContent | null>} The updated content
   */
  async updateContent(
    contentId: Types.ObjectId | string,
    contentData: IAboutContentUpdate
  ): Promise<IAboutContent | null> {
    await this.initializeDbConnection();
    const existingContent = await AboutContent.findById(contentId);
    if (!existingContent) {
      throw new Error("Content Not Found");
    }

    const content = await AboutContent.findByIdAndUpdate(
      contentId,
      contentData,
      {
        new: true,
      }
    );

    if (!content) throw new Error("Content not found");
    return content;
  }

  /**
   * @description Deletes a content item by its ID
   * @param {Types.ObjectId | string} contentId - The ID of the content to delete
   * @returns {Promise<IAboutContent | null>} The deleted content
   */
  async deleteContent(
    contentId: Types.ObjectId | string
  ): Promise<IAboutContent | null> {
    await this.initializeDbConnection();
    const deletedContent = await AboutContent.findByIdAndDelete(contentId);
    return deletedContent;
  }

  /**
   * @description Gets the hero section
   * @returns {Promise<IHeroSection | null>} The hero section
   */
  async getHeroSection(): Promise<IHeroSection | null> {
    await this.initializeDbConnection();
    // Get the first hero section (there should only be one)
    const heroSection = await HeroSection.findOne();
    return heroSection;
  }

  /**
   * @description Updates or creates the hero section
   * @param {Partial<IHeroSection>} heroData - The data to update the hero section
   * @returns {Promise<IHeroSection>} The updated hero section
   */
  async updateHeroSection(
    heroData: Partial<IHeroSection>
  ): Promise<IHeroSection> {
    await this.initializeDbConnection();

    // Find the existing hero section
    let heroSection = await HeroSection.findOne();

    if (heroSection) {
      // Update existing hero section
      Object.assign(heroSection, heroData);
      await heroSection.save();
    } else {
      // Create new hero section if it doesn't exist
      heroSection = new HeroSection(heroData);
      await heroSection.save();
    }

    return heroSection;
  }
}
