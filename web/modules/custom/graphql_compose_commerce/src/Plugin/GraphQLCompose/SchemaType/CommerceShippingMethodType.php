<?php

namespace Drupal\graphql_compose_commerce\Plugin\GraphQLCompose\SchemaType;

use Drupal\graphql_compose\Plugin\GraphQLCompose\GraphQLComposeSchemaTypeBase;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

/**
 * {@inheritdoc}
 *
 * @GraphQLComposeSchemaType(
 *   id = "CommerceShippingMethod"
 * )
 */
class CommerceShippingMethodType extends GraphQLComposeSchemaTypeBase {

  /**
   * {@inheritdoc}
   */
  public function getTypes(): array {
    $types = [];
    
    $types[] = new ObjectType([
      'name' => $this->getPluginId(),
      'description' => (string) $this->t('A commerce shipping method.'),
      'fields' => [
        'id' => [
          'type' => Type::id(),
          'description' => (string) $this->t('The shipping method ID.'),
        ],
        'label' => [
          'type' => Type::string(),
          'description' => (string) $this->t('The shipping method label.'),
        ],
        'amount' => [
          'type' => static::type('CommercePrice'),
          'description' => (string) $this->t('The shipping method price.'),
        ],
      ],
    ]);

    return $types;
  }

} 