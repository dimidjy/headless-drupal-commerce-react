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

} 