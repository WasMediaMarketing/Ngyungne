import { AboutContent, HeroSection } from "@/lib/models/about.model";
import type {
  IAboutContentInput,
  IAboutContentUpdate,
  IAboutContent,
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
   * @description Creates new content for the about page
   * @param {IAboutContentInput} contentData - Data to create the content
   * @returns {Promise<IAboutContent>} The created content
   */
  async createContent(contentData: IAboutContentInput): Promise<IAboutContent> {
    await this.initializeDbConnection();
    const content = new AboutContent({
      ...contentData,
      isVisible:
        contentData.isVisible !== undefined ? contentData.isVisible : true,
    });
    await content.save();
    return content;
  }

  /**
   * @description Retrieves all content or filtered by type
   * @param {ContentType} contentType - Optional filter for content type
   * @param {boolean} isVisible - Optional filter for visible content only
   * @returns {Promise<IAboutContent[]>} List of content items
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

    return await AboutContent.find(query).sort({ "data.order": 1 });
  }

  /**
   * @description Retrieves a single content item by ID
   * @param {Types.ObjectId} contentId - The ID of the content to retrieve
   * @returns {Promise<IAboutContent | null>} The content found or null if not found
   */
  async getContentById(
    contentId: Types.ObjectId
  ): Promise<IAboutContent | null> {
    await this.initializeDbConnection();
    const content = await AboutContent.findById(contentId);
    if (!content) throw new Error("Content not found");
    return content;
  }

  /**
   * @description Updates content by its ID
   * @param {Types.ObjectId} contentId - The ID of the content to update
   * @param {IAboutContentUpdate} contentData - The data to update the content
   * @returns {Promise<IAboutContent | null>} The updated content
   */
  async updateContent(
    contentId: Types.ObjectId,
    contentData: IAboutContentUpdate
  ): Promise<IAboutContent | null> {
    await this.initializeDbConnection();

    const content = await AboutContent.findByIdAndUpdate(
      contentId,
      { $set: contentData },
      { new: true }
    );

    if (!content) throw new Error("Content not found");
    return content;
  }

  /**
   * @description Deletes content by its ID
   * @param {Types.ObjectId} contentId - The ID of the content to delete
   * @returns {Promise<IAboutContent | null>} The deleted content
   */
  async deleteContent(
    contentId: Types.ObjectId
  ): Promise<IAboutContent | null> {
    await this.initializeDbConnection();
    const content = await AboutContent.findByIdAndDelete(contentId);
    if (!content) throw new Error("Content not found");
    return content;
  }

  /**
   * @description Updates the hero section
   * @param {Partial<IHeroSection>} heroData - The data to update the hero section
   * @returns {Promise<IHeroSection | null>} The updated hero section
   */
  async updateHeroSection(
    heroData: Partial<IHeroSection>
  ): Promise<IHeroSection | null> {
    await this.initializeDbConnection();

    // Find the hero section or create if it doesn't exist
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

  /**
   * @description Gets the hero section
   * @returns {Promise<IHeroSection | null>} The hero section or null if not found
   */
  async getHeroSection(): Promise<IHeroSection | null> {
    await this.initializeDbConnection();
    return await HeroSection.findOne();
  }
}
