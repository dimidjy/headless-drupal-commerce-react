<?php

namespace Drupal\graphql_compose_commerce\Plugin\GraphQLCompose\SchemaType;

use Drupal\graphql_compose\Plugin\GraphQLCompose\GraphQLComposeSchemaTypeBase;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

/**
 * {@inheritdoc}
 *
 * @GraphQLComposeSchemaType(
 *   id = "CommerceOrderItem"
 * )
 */
class CommerceOrderItemType extends GraphQLComposeSchemaTypeBase {

  /**
   * {@inheritdoc}
   */
  public function getTypes(): array {
    $types = [];
    
    $types[] = new ObjectType([
      'name' => $this->getPluginId(),
      'description' => (string) $this->t('An order item.'),
      'fields' => [
        'id' => [
          'type' => Type::id(),
          'description' => (string) $this->t('The order item ID.'),
        ],
        'title' => [
          'type' => Type::string(),
          'description' => (string) $this->t('The order item title.'),
        ],
        'quantity' => [
          'type' => Type::int(),
          'description' => (string) $this->t('The order item quantity.'),
        ],
        'unitPrice' => [
          'type' => static::type('CommercePrice'),
          'description' => (string) $this->t('The unit price.'),
          'resolve' => function ($item) {
            if (method_exists($item, 'getUnitPrice')) {
              return $item->getUnitPrice();
            }
            return NULL;
          },
        ],
        'totalPrice' => [
          'type' => static::type('CommercePrice'),
          'description' => (string) $this->t('The total price.'),
          'resolve' => function ($item) {
            if (method_exists($item, 'getTotalPrice')) {
              return $item->getTotalPrice();
            }
            return NULL;
          },
        ],
        'purchasedEntity' => [
          'type' => static::type('CommerceProductVariation'),
          'description' => (string) $this->t('The purchased entity.'),
          'resolve' => function ($item) {
            if (method_exists($item, 'getPurchasedEntity')) {
              return $item->getPurchasedEntity();
            }
            return NULL;
          },
        ],
      ],
    ]);

    return $types;
  }

} 