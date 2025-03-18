<?php

namespace Drupal\graphql_compose_commerce\Plugin\GraphQLCompose\SchemaType;

use Drupal\graphql_compose\Plugin\GraphQLCompose\GraphQLComposeSchemaTypeBase;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

/**
 * {@inheritdoc}
 *
 * @GraphQLComposeSchemaType(
 *   id = "CommerceAddress"
 * )
 */
class CommerceAddressType extends GraphQLComposeSchemaTypeBase {

  /**
   * {@inheritdoc}
   */
  public function getTypes(): array {
    $types = [];
    
    $types[] = new ObjectType([
      'name' => $this->getPluginId(),
      'description' => (string) $this->t('A commerce address.'),
      'fields' => [
        'addressLine1' => [
          'type' => Type::string(),
          'description' => (string) $this->t('The first line of the address.'),
        ],
        'addressLine2' => [
          'type' => Type::string(),
          'description' => (string) $this->t('The second line of the address.'),
        ],
        'locality' => [
          'type' => Type::string(),
          'description' => (string) $this->t('The locality (city).'),
        ],
        'administrativeArea' => [
          'type' => Type::string(),
          'description' => (string) $this->t('The administrative area (state/province).'),
        ],
        'postalCode' => [
          'type' => Type::string(),
          'description' => (string) $this->t('The postal code.'),
        ],
        'countryCode' => [
          'type' => Type::string(),
          'description' => (string) $this->t('The country code.'),
        ],
        'givenName' => [
          'type' => Type::string(),
          'description' => (string) $this->t('The given name.'),
        ],
        'familyName' => [
          'type' => Type::string(),
          'description' => (string) $this->t('The family name.'),
        ],
      ],
    ]);

    return $types;
  }

} 