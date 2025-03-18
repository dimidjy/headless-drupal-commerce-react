<?php

namespace Drupal\graphql_compose_commerce\Plugin\GraphQLCompose\SchemaType;

use Drupal\graphql_compose\Plugin\GraphQLCompose\GraphQLComposeSchemaTypeBase;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

/**
 * {@inheritdoc}
 *
 * @GraphQLComposeSchemaType(
 *   id = "CommerceOrder"
 * )
 */
class CommerceOrderType extends GraphQLComposeSchemaTypeBase {

  /**
   * {@inheritdoc}
   */
  public function getTypes(): array {
    $types = [];
    
    $types[] = new ObjectType([
      'name' => $this->getPluginId(),
      'description' => (string) $this->t('A commerce order.'),
      'interfaces' => [],
      'fields' => [
        'id' => [
          'type' => Type::id(),
          'description' => (string) $this->t('The order ID.'),
        ],
        'orderNumber' => [
          'type' => Type::string(),
          'description' => (string) $this->t('The order number.'),
        ],
        'mail' => [
          'type' => Type::string(),
          'description' => (string) $this->t('The order email.'),
        ],
        'state' => [
          'type' => Type::string(),
          'description' => (string) $this->t('The order state.'),
        ],
        'total' => [
          'type' => static::type('CommercePrice'),
          'description' => (string) $this->t('The total price of the order.'),
        ],
        'items' => [
          'type' => Type::listOf(static::type('CommerceOrderItem')),
          'description' => (string) $this->t('The order items.'),
        ],
        'billingProfile' => [
          'type' => static::type('CommerceProfile'),
          'description' => (string) $this->t('The billing profile.'),
        ],
        'shippingInformation' => [
          'type' => static::type('CommerceShippingInformation'),
          'description' => (string) $this->t('The shipping information.'),
        ],
      ],
    ]);

    return $types;
  }

} 