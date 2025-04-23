import { Slider } from "@/lib/models/slider.model";
import type {
  ISliderInput,
  ISliderUpdate,
  ISlider,
  ISliderService,
} from "@/types/slider.types";
import { connectToDatabase } from "@/lib/utils/mongodb";
import type { Types } from "mongoose";
import { deleteFile } from "@/lib/utils/deleteFile"; // Import the deleteFile utility

export class SliderService implements ISliderService {
  private async initializeDbConnection() {
    await connectToDatabase();
  }

  /**
   * @description Creates a new slider in the system
   * @param {ISliderInput} sliderData - Data to create the slider
   * @returns {Promise<ISlider>} The created slider
   */
  async createSlider(sliderData: ISliderInput): Promise<ISlider> {
    await this.initializeDbConnection();

    // If no order is specified, set it to be the highest order + 1
    if (sliderData.order === undefined) {
      const highestOrderSlider = await Slider.findOne()
        .sort({ order: -1 })
        .limit(1);
      sliderData.order = highestOrderSlider ? highestOrderSlider.order + 1 : 0;
    }

    const slider = new Slider({
      ...sliderData,
      isVisible:
        sliderData.isVisible !== undefined ? sliderData.isVisible : true,
    });

    await slider.save();
    return slider;
  }

  /**
   * @description Retrieves all sliders in the system
   * @param {boolean} isVisible - Optional filter for visible sliders only
   * @returns {Promise<ISlider[]>} List of all sliders
   */
  async getSliders(isVisible?: boolean): Promise<ISlider[]> {
    await this.initializeDbConnection();
    if (isVisible !== undefined) {
      return await Slider.find({ isVisible }).sort({ order: 1 });
    }
    return await Slider.find().sort({ order: 1 });
  }

  /**
   * @description Retrieves a single slider by its ID
   * @param {Types.ObjectId} sliderId - The ID of the slider to retrieve
   * @returns {Promise<ISlider | null>} The slider found or null if not found
   */
  async getSliderById(sliderId: Types.ObjectId): Promise<ISlider | null> {
    await this.initializeDbConnection();
    const slider = await Slider.findById(sliderId);
    if (!slider) throw new Error("Slider not found");
    return slider;
  }

  /**
   * @description Updates a slider by its ID
   * @param {Types.ObjectId} sliderId - The ID of the slider to update
   * @param {ISliderUpdate} sliderData - The data to update the slider
   * @returns {Promise<ISlider | null>} The updated slider
   */
  async updateSlider(
    sliderId: Types.ObjectId,
    sliderData: ISliderUpdate
  ): Promise<ISlider | null> {
    await this.initializeDbConnection();
    const existingSlider = await Slider.findById(sliderId);
    if (!existingSlider) {
      throw new Error("Slider Not Found");
    }

    // Handle file deletion if new media is provided
    if (sliderData.media) {
      // If changing from file to URL or replacing file
      if (
        existingSlider.media.sourceType === "file" &&
        existingSlider.media.file &&
        (sliderData.media.sourceType === "url" ||
          (sliderData.media.sourceType === "file" &&
            sliderData.media.file &&
            sliderData.media.file !== existingSlider.media.file))
      ) {
        deleteFile(existingSlider.media.file);
      }
    }

    const slider = await Slider.findByIdAndUpdate(sliderId, sliderData, {
      new: true,
    });

    if (!slider) throw new Error("Slider not found");
    return slider;
  }

  /**
   * @description Deletes a slider by its ID
   * @param {Types.ObjectId} sliderId - The ID of the slider to delete
   * @returns {Promise<ISlider | null>} The deleted slider
   */
  async deleteSlider(sliderId: Types.ObjectId): Promise<ISlider | null> {
    await this.initializeDbConnection();

    // Find the slider to get its file path (if exists)
    const slider = await Slider.findById(sliderId);
    if (!slider) throw new Error("Slider not found");

    // If there's a file, delete it
    if (slider.media.sourceType === "file" && slider.media.file) {
      deleteFile(slider.media.file);
    }

    // Now delete the slider from the database
    const deletedSlider = await Slider.findByIdAndDelete(sliderId);
    return deletedSlider;
  }

  /**
   * @description Deletes multiple sliders by their IDs
   * @param {Types.ObjectId[]} sliderIds - Array of slider IDs to delete
   * @returns {Promise<unknown>} A promise indicating the deletion status
   */
  async deleteSliders(sliderIds: Types.ObjectId[]): Promise<unknown> {
    await this.initializeDbConnection();

    // Find all sliders to get their file paths (if exists)
    const sliders = await Slider.find({ _id: { $in: sliderIds } });
    if (sliders.length === 0) throw new Error("No sliders found");

    // Delete files for all sliders
    sliders.forEach((slider) => {
      if (slider.media.sourceType === "file" && slider.media.file) {
        deleteFile(slider.media.file);
      }
    });

    // Delete the sliders from the database
    const deletedSliders = await Slider.deleteMany({
      _id: { $in: sliderIds },
    });

    return deletedSliders;
  }

  /**
   * @description Updates the order of a slider
   * @param {Types.ObjectId} sliderId - The ID of the slider
   * @param {number} newOrder - The new order value
   * @returns {Promise<ISlider | null>} The updated slider
   */
  async updateSliderOrder(
    sliderId: Types.ObjectId,
    newOrder: number
  ): Promise<ISlider | null> {
    await this.initializeDbConnection();
    const slider = await Slider.findByIdAndUpdate(
      sliderId,
      { order: newOrder },
      { new: true }
    );

    if (!slider) throw new Error("Slider not found");
    return slider;
  }
}
