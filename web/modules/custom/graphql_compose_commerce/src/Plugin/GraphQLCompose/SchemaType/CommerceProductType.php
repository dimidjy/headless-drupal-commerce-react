<?php

namespace Drupal\graphql_compose_commerce\Plugin\GraphQLCompose\SchemaType;

use Drupal\graphql_compose\Plugin\GraphQLCompose\GraphQLComposeSchemaTypeBase;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

/**
 * {@inheritdoc}
 *
 * @GraphQLComposeSchemaType(
 *   id = "CommerceProduct",
 * )
 */
class CommerceProductType extends GraphQLComposeSchemaTypeBase {

  /**
   * {@inheritdoc}
   */
  public function getTypes(): array {
    $types = [];

    // Define the CommerceProduct interface type.
    $types[] = new ObjectType([
      'name' => 'CommerceProduct',
      'description' => (string) $this->t('A commerce product entity.'),
      'fields' => fn() => [
        'id' => [
          'type' => Type::nonNull(Type::id()),
          'description' => (string) $this->t('The entity ID.'),
        ],
        'uuid' => [
          'type' => Type::nonNull(Type::string()),
          'description' => (string) $this->t('The entity UUID.'),
        ],
        'type' => [
          'type' => Type::nonNull(Type::string()),
          'description' => (string) $this->t('The product type.'),
        ],
        'title' => [
          'type' => Type::string(),
          'description' => (string) $this->t('The product title.'),
        ],
        'status' => [
          'type' => Type::nonNull(Type::boolean()),
          'description' => (string) $this->t('Whether the product is published.'),
        ],
        'created' => [
          'type' => Type::nonNull(Type::string()),
          'description' => (string) $this->t('The time the product was created.'),
        ],
        'changed' => [
          'type' => Type::nonNull(Type::string()),
          'description' => (string) $this->t('The time the product was last changed.'),
        ],
        'stores' => [
          'type' => Type::nonNull(Type::listOf(Type::string())),
          'description' => (string) $this->t('The stores the product is available in.'),
        ],
        'variations' => [
          'type' => Type::nonNull(Type::listOf(Type::string())),
          'description' => (string) $this->t('The product variations.'),
        ],
        'defaultVariation' => [
          'type' => Type::string(),
          'description' => (string) $this->t('The default product variation.'),
        ],
        'price' => [
          'type' => Type::string(),
          'description' => (string) $this->t('The price of the default product variation.'),
        ],
        'variationPrices' => [
          'type' => Type::listOf(Type::string()),
          'description' => (string) $this->t('All prices from product variations.'),
        ],
        'enhancedVariations' => [
          'type' => Type::listOf(Type::string()),
          'description' => (string) $this->t('All product variations with complete data.'),
        ],
        'product_image' => [
          'type' => Type::string(),
          'description' => (string) $this->t('The image of the default product variation.'),
        ],
        'url' => [
          'type' => Type::string(),
          'description' => (string) $this->t('The URL of the product.'),
        ],
      ],
    ]);

    return $types;
  }

  /**
   * {@inheritdoc}
   */
  public function getExtensions(): array {
    return [];
  }

} 