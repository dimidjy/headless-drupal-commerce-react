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
    // Define the CommercePriceItem type.
    $registry->add(new ObjectType([
      'name' => 'CommercePriceItem',
      'description' => (string) $this->t('A price value with currency information.'),
      'fields' => [
        'number' => [
          'type' => Type::string(),
          'description' => (string) $this->t('The price number.'),
        ],
        'currency_code' => [
          'type' => Type::string(),
          'description' => (string) $this->t('The currency code.'),
        ],
        'formatted' => [
          'type' => Type::string(),
          'description' => (string) $this->t('The formatted price with currency.'),
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