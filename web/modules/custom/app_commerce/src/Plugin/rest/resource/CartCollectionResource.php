<?php

namespace Drupal\app_commerce\Plugin\rest\resource;

use Drupal\rest\ResourceResponse;
use Drupal\file\Entity\File;

/**
 * Provides a cart collection resource for current session.
 *
 * @RestResource(
 *   id = "commerce_cart_collection",
 *   label = @Translation("Cart collection"),
 *   uri_paths = {
 *     "canonical" = "/cart"
 *   }
 * )
 */
class CartCollectionResource extends CartResourceBase {

  /**
   * GET a collection of the current user's carts.
   *
   * @return \Drupal\rest\ResourceResponse
   *   The resource response.
   */
  public function get() {
    $carts = $this->cartProvider->getCarts();
    
    // Convert carts to array format and process them
    $serializer = \Drupal::service('serializer');
    $processed_carts = [];
    
    foreach ($carts as $cart) {
      // Get the normalized cart data
      $normalized_cart = $serializer->normalize($cart, 'json');
      
      // Process order items to add image URLs
      if (isset($normalized_cart['order_items']) && is_array($normalized_cart['order_items'])) {
        foreach ($normalized_cart['order_items'] as $key => $order_item) {
          if (isset($order_item['purchased_entity'])) {
            // Get the product variation entity
            $variation = \Drupal::entityTypeManager()
              ->getStorage('commerce_product_variation')
              ->load($order_item['purchased_entity']['variation_id']);
            
            if ($variation) {
              // Try to get image from field_product_image
              $image_url = $this->getImageUrl($variation, 'field_product_image');
              
              // If no image found, try to get from product's field_image
              if (empty($image_url) && $variation->getProduct()) {
                $product = $variation->getProduct();
                $image_url = $this->getImageUrl($product, 'field_image');
              }
              
              // Add the image URL to the purchased entity
              $normalized_cart['order_items'][$key]['purchased_entity']['image_url'] = $image_url;
            }
          }
        }
      }
      
      $processed_carts[] = $normalized_cart;
    }
    
    $response = new ResourceResponse(array_values($processed_carts), 200);
    /** @var \Drupal\commerce_order\Entity\OrderInterface $cart */
    foreach ($carts as $cart) {
      $response->addCacheableDependency($cart);
    }
    $response->getCacheableMetadata()->addCacheContexts([
      'store',
      'cart',
    ]);

    return $response;
  }
  
  /**
   * Gets the image URL from an entity and field.
   *
   * @param \Drupal\Core\Entity\EntityInterface $entity
   *   The entity.
   * @param string $field_name
   *   The image field name.
   *
   * @return string|null
   *   The image URL or null if not found.
   */
  protected function getImageUrl($entity, $field_name) {
    if ($entity->hasField($field_name) && !$entity->get($field_name)->isEmpty()) {
      $image_reference = $entity->get($field_name)->first();
      if ($image_reference && $image_reference->entity) {
        $referenced_entity = $image_reference->entity;
        
        // Handle Media entities
        if ($referenced_entity instanceof \Drupal\media\MediaInterface) {
          // For media entities, get the file from the source field
          $source_field = $referenced_entity->getSource()->getConfiguration()['source_field'];
          if ($referenced_entity->hasField($source_field) && !$referenced_entity->get($source_field)->isEmpty()) {
            $file = $referenced_entity->get($source_field)->entity;
            if ($file) {
              return \Drupal::service('file_url_generator')->generateAbsoluteString($file->getFileUri());
            }
          }
        }
        // Handle File entities directly
        elseif ($referenced_entity instanceof \Drupal\file\FileInterface) {
          return \Drupal::service('file_url_generator')->generateAbsoluteString($referenced_entity->getFileUri());
        }
      }
    }
    return NULL;
  }

}
