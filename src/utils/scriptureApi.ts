import type { Types } from "mongoose";
import type {
  IScripture,
  IScriptureInput,
  IScriptureUpdate,
} from "../types/scripture.types";

/**
 * Scripture API client for interacting with scripture endpoints
 */
export class ScriptureApi {
  private baseUrl: string;

  /**
   * Initialize the Scripture API client
   * @param baseUrl - Base URL for API requests (defaults to current origin)
   */
  constructor(baseUrl?: string) {
    this.baseUrl =
      baseUrl || (typeof window !== "undefined" ? window.location.origin : "");
  }

  /**
   * Handle API response and error cases
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `API error: ${response.status} ${response.statusText}`
      );
    }

    return response.json() as Promise<T>;
  }

  /**
   * Create a new scripture
   * @param scriptureData - Scripture data to create
   * @param image - Optional image file
   */
  async createScripture(
    scriptureData: IScriptureInput,
    image?: File
  ): Promise<IScripture> {
    const url = `${this.baseUrl}/api/scripture`;
    let body: FormData | string;
    let headers: HeadersInit = {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
    };

    // If there's an image, use FormData
    if (image) {
      const formData = new FormData();

      // Add the image
      formData.append("image", image);

      // Add all other fields
      Object.entries(scriptureData).forEach(([key, value]) => {
        if (key === "verses" && Array.isArray(value)) {
          formData.append("verses", JSON.stringify(value));
        } else if (value !== undefined) {
          formData.append(key, String(value));
        }
      });

      body = formData;
      // No content-type for FormData (browser sets it)
    } else {
      // Use JSON if no image
      body = JSON.stringify(scriptureData);
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body,
    });

    return this.handleResponse<IScripture>(response);
  }

  /**
   * Get all scriptures (authenticated users get all, others get only visible ones)
   */
  /**
   * Get all scriptures (authenticated users get all, others get only visible ones)
   */
  async getScriptures(): Promise<IScripture[]> {
    const url = `${this.baseUrl}/api/scripture`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await this.handleResponse<{ data: IScripture[] }>(response);
    return result.data;
  }

  /**
   * Get a specific scripture by ID
   * @param scriptureId - ID of the scripture to retrieve
   */
  async getScriptureById(
    scriptureId: string | Types.ObjectId
  ): Promise<IScripture> {
    const url = `${this.baseUrl}/api/scripture/${scriptureId}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await this.handleResponse<{ data: IScripture }>(response);
    return result.data;
  }

  /**
   * Update a scripture
   * @param scriptureId - ID of the scripture to update
   * @param scriptureData - Updated scripture data
   * @param image - Optional new image file
   */
  async updateScripture(
    scriptureId: string | Types.ObjectId,
    scriptureData: IScriptureUpdate,
    image?: File
  ): Promise<IScripture> {
    const url = `${this.baseUrl}/api/scripture/${scriptureId}`;
    let body: FormData | string;
    let headers: HeadersInit = {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
    };
    let method: string;

    // If there's an image, use FormData and PATCH
    if (image) {
      const formData = new FormData();

      // Add the image
      formData.append("image", image);

      // Add all other fields
      Object.entries(scriptureData).forEach(([key, value]) => {
        if (key === "verses" && Array.isArray(value)) {
          formData.append("verses", JSON.stringify(value));
        } else if (value !== undefined) {
          formData.append(key, String(value));
        }
      });

      body = formData;
      method = "PATCH";
      // No content-type for FormData
    } else {
      // Use JSON and PUT if no image
      body = JSON.stringify(scriptureData);
      headers["Content-Type"] = "application/json";
      method = "PUT";
    }

    const response = await fetch(url, {
      method,
      headers,
      body,
    });

    return this.handleResponse<IScripture>(response);
  }

  /**
   * Delete a scripture by ID
   * @param scriptureId - ID of the scripture to delete
   */
  async deleteScripture(
    scriptureId: string | Types.ObjectId
  ): Promise<IScripture> {
    const url = `${this.baseUrl}/api/scripture/${scriptureId}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    });

    return this.handleResponse<IScripture>(response);
  }

  /**
   * Delete multiple scriptures by ID
   * @param scriptureIds - Array of scripture IDs to delete
   */
  async deleteScriptures(
    scriptureIds: (string | Types.ObjectId)[]
  ): Promise<unknown> {
    const idsParam = scriptureIds.join(",");
    const url = `${this.baseUrl}/api/scripture?scriptureIds=${idsParam}`;

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    });

    return this.handleResponse<unknown>(response);
  }

  /**
   * Toggle scripture visibility
   * @param scriptureId - ID of the scripture
   * @param isVisible - Visibility state to set
   */
  async toggleVisibility(
    scriptureId: string | Types.ObjectId,
    isVisible: boolean
  ): Promise<IScripture> {
    return this.updateScripture(scriptureId, { isVisible });
  }

  /**
   * Increment view count for a scripture
   * @param scriptureId - ID of the scripture
   */
  async incrementViews(
    scriptureId: string | Types.ObjectId
  ): Promise<IScripture> {
    const scripture = await this.getScriptureById(scriptureId);
    const currentViews = scripture.views || 0;

    return this.updateScripture(scriptureId, {
      views: currentViews + 1,
    });
  }
}

/**
 * Create a scripture API instance
 * @param baseUrl - Optional base URL for API
 */
export function createScriptureApi(baseUrl?: string): ScriptureApi {
  return new ScriptureApi(baseUrl);
}
