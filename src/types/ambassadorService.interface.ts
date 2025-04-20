import { Types } from "mongoose";
import {
  Ambassador,
  CreateAmbassadorInput,
  UpdateAmbassadorInput,
} from "@/types/ambassador.types";

export interface IAmbassadorService {
  /**
   * Create a new ambassador
   * @param ambassadorData The ambassador data to create
   * @returns The created ambassador
   */
  createAmbassador(ambassadorData: CreateAmbassadorInput): Promise<Ambassador>;

  /**
   * Get all ambassadors
   * @param includeHidden Whether to include hidden ambassadors (default: false)
   * @returns Array of ambassadors
   */
  getAmbassadors(includeHidden?: boolean): Promise<Ambassador[]>;

  /**
   * Get ambassador by ID
   * @param ambassadorId The ID of the ambassador to retrieve
   * @returns The ambassador or null if not found
   */
  getAmbassadorById(
    ambassadorId: string | Types.ObjectId
  ): Promise<Ambassador | null>;

  /**
   * Update an ambassador
   * @param ambassadorId The ID of the ambassador to update
   * @param ambassadorData The ambassador data to update
   * @returns The updated ambassador or null if not found
   */
  updateAmbassador(
    ambassadorId: string | Types.ObjectId,
    ambassadorData: UpdateAmbassadorInput
  ): Promise<Ambassador | null>;

  /**
   * Update ambassador visibility
   * @param ambassadorId The ID of the ambassador to update
   * @param visibilityData Object containing isVisible property
   * @returns The updated ambassador or null if not found
   */
  updateAmbassadorVisibility(
    ambassadorId: string | Types.ObjectId,
    visibilityData: { isVisible: boolean }
  ): Promise<Ambassador | null>;

  /**
   * Delete an ambassador
   * @param ambassadorId The ID of the ambassador to delete
   * @returns True if deleted successfully, false otherwise
   */
  deleteAmbassador(ambassadorId: string | Types.ObjectId): Promise<boolean>;

  /**
   * Delete multiple ambassadors
   * @param ambassadorIds Array of ambassador IDs to delete
   * @returns Number of ambassadors deleted
   */
  deleteAmbassadors(ambassadorIds: string[]): Promise<number>;
}
