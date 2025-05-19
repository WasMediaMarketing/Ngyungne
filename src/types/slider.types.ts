import { Types } from "mongoose";

export enum MediaType {
  IMAGE = "image",
  VIDEO = "video",
}

export enum MediaSourceType {
  FILE = "file",
  URL = "url",
}

export interface IMedia {
  type: MediaType;
  sourceType: MediaSourceType;
  url?: string;
  file?: string; // Path to stored file
  altText?: string;
}

export interface ISlider {
  _id: Types.ObjectId | string;
  title?: string;
  description?: string;
  media: IMedia;
  buttonText?: string;
  buttonUrl?: string;
  order?: number;
  isVisible: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISliderInput {
  title?: string;
  description?: string;
  media: IMedia;
  buttonText?: string;
  buttonUrl?: string;
  order?: number;
  isVisible?: boolean;
}

export interface ISliderUpdate extends Partial<ISliderInput> {}

export interface ISliderService {
  createSlider(sliderData: ISliderInput): Promise<ISlider>;
  getSliders(isVisible?: boolean): Promise<ISlider[]>;
  getSliderById(sliderId: Types.ObjectId): Promise<ISlider | null>;
  updateSlider(
    sliderId: Types.ObjectId,
    sliderData: ISliderUpdate
  ): Promise<ISlider | null>;
  deleteSlider(sliderId: Types.ObjectId): Promise<ISlider | null>;
  deleteSliders(sliderIds: Types.ObjectId[]): Promise<unknown>;
  updateSliderOrder(
    sliderId: Types.ObjectId,
    newOrder: number
  ): Promise<ISlider | null>;
}
