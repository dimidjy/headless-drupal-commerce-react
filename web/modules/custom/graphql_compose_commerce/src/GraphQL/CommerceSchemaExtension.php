<?php

namespace Drupal\graphql_compose_commerce\GraphQL;

use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\graphql_compose\Plugin\GraphQLComposeSchemaTypeManager;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

/**
 * Add Commerce types to the GraphQL schema.
 */
class CommerceSchemaExtension {
  
  use StringTranslationTrait;

  /**
   * Register types with the schema type manager.
   *
   * @param \Drupal\graphql_compose\Plugin\GraphQLComposeSchemaTypeManager $registry
   *   The schema type manager.
   */
  public function registerTypes(GraphQLComposeSchemaTypeManager $registry): void {
    // Note: CommercePriceItem is now handled as a String type directly in the CommercePrice field type class
    
    // Define the VariationPriceItem type for accessing variation prices
    $registry->add(new ObjectType([
      'name' => 'VariationPriceItem',
      'description' => (string) $this->t('A product variation with its price information.'),
      'fields' => [
        'variation_id' => [
          'type' => Type::id(),
          'description' => (string) $this->t('The variation ID.'),
        ],
        'sku' => [
          'type' => Type::string(),
          'description' => (string) $this->t('The variation SKU.'),
        ],
        'title' => [
          'type' => Type::string(),
          'description' => (string) $this->t('The variation title.'),
        ],
        'price' => [
          'type' => Type::string(),
          'description' => (string) $this->t('The formatted variation price.'),
        ],
      ],
    ]));

    // Define any other custom types needed for Commerce.
    // For example, you might want to define a Store type.
    $registry->add(new ObjectType([
      'name' => 'CommerceStore',
      'description' => (string) $this->t('A store entity.'),
      'fields' => [
        'id' => [
          'type' => Type::id(),
          'description' => (string) $this->t('The store ID.'),
        ],
        'name' => [
          'type' => Type::string(),
          'description' => (string) $this->t('The store name.'),
        ],
      ],
    ]));
  }

  /**
   * Extension to register the cart query.
   * 
   * Must be registered in hook_graphql_compose_print_extensions().
   */
  public function registerExtensions(GraphQLComposeSchemaTypeManager $registry): void {
    // Create an extension to add the cart field to the Query type
    $extension = new ObjectType([
      'name' => 'Query',
      'fields' => [
        'cart' => [
          'type' => $registry->get('CommerceOrder'),
          'description' => (string) $this->t('The current user\'s cart.'),
          'resolve' => function ($_, $args, $context) {
            // Check if the commerce cart manager service exists
            if (!\Drupal::hasService('commerce_cart.cart_provider')) {
              return NULL;
            }
            
            // Get the current cart for the current user
            $cart_provider = \Drupal::service('commerce_cart.cart_provider');
            $store = \Drupal::service('commerce_store.store_context')->getStore();
            
            if (!$store) {
              return NULL;
            }
            
            $carts = $cart_provider->getCarts();
            // Filter to only get carts for the current store
            $store_carts = array_filter($carts, function ($cart) use ($store) {
              return $cart->getStoreId() == $store->id();
            });
            
            // Return the first available cart
            return !empty($store_carts) ? reset($store_carts) : NULL;
          },
        ],
      ],
    ]);
    
    // Register the extension
    $registry->extend($extension);
  }
} 