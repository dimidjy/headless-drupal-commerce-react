/**
 * Utility functions for handling images
 */

/**
 * Extract image URL from Drupal image field data structure
 * @param {Object|Array} image - The image data from Drupal
 * @returns {string|null} - The URL of the image or null if not found
 */
export function getImageUrl(image) {
  if (image) {
    // Check if image is an array and has at least one element
    if (Array.isArray(image) && image.length > 0) {
      // Access the mediaImage from the first element of the array
      const mediaItem = image[0];
      if (mediaItem && mediaItem.mediaImage && mediaItem.mediaImage.variations && 
          mediaItem.mediaImage.variations.length > 0) {
        return mediaItem.mediaImage.variations[0].url;
      }
    } else if (image.mediaImage && image.mediaImage.variations && 
              image.mediaImage.variations.length > 0) {
      // Handle case where image is directly an object with mediaImage property
      return image.mediaImage.variations[0].url;
    }
  }
  return null;
}

/**
 * Get image data (including alt text) from Drupal image field
 * @param {Object|Array} image - The image data from Drupal
 * @returns {Object|null} - The image data or null if not found
 */
export function getImageData(image) {
  if (Array.isArray(image) && image.length > 0) {
    return image[0].mediaImage;
  } else if (image && image.mediaImage) {
    return image.mediaImage;
  }
  return null;
} 