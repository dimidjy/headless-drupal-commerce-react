<?php

namespace Drupal\graphql_compose_commerce\Plugin\GraphQLCompose\SchemaType;

use Drupal\graphql_compose\Plugin\GraphQLCompose\GraphQLComposeSchemaTypeBase;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\UnionType;
use GraphQL\Type\Definition\Type;

/**
 * {@inheritdoc}
 *
 * @GraphQLComposeSchemaType(
 *   id = "CommerceProductVariation",
 * )
 */
class CommerceProductVariationType extends GraphQLComposeSchemaTypeBase {

  /**
   * {@inheritdoc}
   */
  public function getTypes(): array {
    $types = [];

    // Define the CommerceProductVariation interface type.
    $types[] = new ObjectType([
      'name' => 'CommerceProductVariation',
      'description' => (string) $this->t('A commerce product variation entity.'),
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
          'description' => (string) $this->t('The product variation type.'),
        ],
        'sku' => [
          'type' => Type::nonNull(Type::string()),
          'description' => (string) $this->t('The product variation SKU.'),
        ],
        'title' => [
          'type' => Type::nonNull(Type::string()),
          'description' => (string) $this->t('The product variation title.'),
        ],
        'status' => [
          'type' => Type::nonNull(Type::boolean()),
          'description' => (string) $this->t('Whether the product variation is published.'),
        ],
        'created' => [
          'type' => Type::nonNull(Type::string()),
          'description' => (string) $this->t('The time the product variation was created.'),
        ],
        'changed' => [
          'type' => Type::nonNull(Type::string()),
          'description' => (string) $this->t('The time the product variation was last changed.'),
        ],
        'price' => [
          'type' => Type::string(),
          'description' => (string) $this->t('The price of the product variation.'),
        ],
        'list_price' => [
          'type' => Type::string(),
          'description' => (string) $this->t('The list price of the product variation.'),
        ],
        'product' => [
          'type' => Type::string(),
          'description' => (string) $this->t('The parent product of this variation.'),
        ],
        'formatted_price' => [
          'type' => Type::string(),
          'description' => (string) $this->t('The formatted price of the variation.'),
        ],
        'formatted_list_price' => [
          'type' => Type::string(),
          'description' => (string) $this->t('The formatted list price of the variation.'),
        ],
        'discount_percentage' => [
          'type' => Type::float(),
          'description' => (string) $this->t('The discount percentage if list price is available.'),
        ],
      ],
    ]);

    // Define the CommerceProductVariationUnion type.
    $types[] = new UnionType([
      'name' => 'CommerceProductVariationUnion',
      'description' => (string) $this->t('Union type for product variations.'),
      'types' => fn() => [
        $this->schemaTypeManager->get('CommerceProductVariationDefault'),
      ],
      'resolveType' => function ($value) {
        if ($value && method_exists($value, 'bundle')) {
          $bundle = $value->bundle();
          $type = 'CommerceProductVariation' . ucfirst($bundle);
          
          if ($this->schemaTypeManager && $this->schemaTypeManager->has($type)) {
            return $this->schemaTypeManager->get($type);
          }
        }
        
        return null;
      },
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