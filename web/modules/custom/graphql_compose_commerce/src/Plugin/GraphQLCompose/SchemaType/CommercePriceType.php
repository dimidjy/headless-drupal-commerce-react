<?php

namespace Drupal\graphql_compose_commerce\Plugin\GraphQLCompose\SchemaType;

use Drupal\graphql_compose\Plugin\GraphQLCompose\GraphQLComposeSchemaTypeBase;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

/**
 * {@inheritdoc}
 *
 * @GraphQLComposeSchemaType(
 *   id = "CommercePrice"
 * )
 */
class CommercePriceType extends GraphQLComposeSchemaTypeBase {

  /**
   * {@inheritdoc}
   */
  public function getTypes(): array {
    $types = [];
    
    $types[] = new ObjectType([
      'name' => $this->getPluginId(),
      'description' => (string) $this->t('A commerce price.'),
      'fields' => [
        'number' => [
          'type' => Type::string(),
          'description' => (string) $this->t('The price number.'),
        ],
        'currency_code' => [
          'type' => Type::string(),
          'description' => (string) $this->t('The currency code.'),
        ],
        'currencyCode' => [
          'type' => Type::string(),
          'description' => (string) $this->t('The currency code (alias for currency_code).'),
          'resolve' => function ($value) {
            return isset($value['currency_code']) ? $value['currency_code'] : null;
          },
        ],
        'formatted' => [
          'type' => Type::string(),
          'description' => (string) $this->t('The formatted price.'),
        ],
      ],
    ]);

    return $types;
  }

} 