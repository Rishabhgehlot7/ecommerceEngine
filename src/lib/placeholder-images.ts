import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

// Provides a type assertion for the JSON data
const typedPlaceholderImages: ImagePlaceholder[] = data.placeholderImages as ImagePlaceholder[];

export const PlaceHolderImages: ImagePlaceholder[] = typedPlaceholderImages;
