<?php

namespace Drupal\graphql_compose_commerce\Plugin\GraphQLCompose\SchemaType;

use Drupal\graphql_compose\Plugin\GraphQLCompose\GraphQLComposeSchemaTypeBase;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

/**
 * {@inheritdoc}
 *
 * @GraphQLComposeSchemaType(
 *   id = "CommerceProfile"
 * )
 */
class CommerceProfileType extends GraphQLComposeSchemaTypeBase {

  /**
   * {@inheritdoc}
   */
  public function getTypes(): array {
    $types = [];
    
    $types[] = new ObjectType([
      'name' => $this->getPluginId(),
      'description' => (string) $this->t('A profile entity.'),
      'fields' => [
        'id' => [
          'type' => Type::id(),
          'description' => (string) $this->t('The profile ID.'),
        ],
        'address' => [
          'type' => static::type('CommerceAddress'),
          'description' => (string) $this->t('The customer address.'),
          'resolve' => function ($profile) {
            if ($profile->hasField('address') && !$profile->get('address')->isEmpty()) {
              return $profile->get('address')->first()->getValue();
            }
            return NULL;
          },
        ],
      ],
    ]);

    $types[] = new ObjectType([
      'name' => 'CommerceAddress',
      'description' => (string) $this->t('An address.'),
      'fields' => [
        'addressLine1' => [
          'type' => Type::string(),
          'description' => (string) $this->t('The first line of the address.'),
          'resolve' => function ($address) {
            return $address['address_line1'] ?? NULL;
          },
        ],
        'addressLine2' => [
          'type' => Type::string(),
          'description' => (string) $this->t('The second line of the address.'),
          'resolve' => function ($address) {
            return $address['address_line2'] ?? NULL;
          },
        ],
        'locality' => [
          'type' => Type::string(),
          'description' => (string) $this->t('The locality (city).'),
          'resolve' => function ($address) {
            return $address['locality'] ?? NULL;
          },
        ],
        'administrativeArea' => [
          'type' => Type::string(),
          'description' => (string) $this->t('The administrative area (state/province).'),
          'resolve' => function ($address) {
            return $address['administrative_area'] ?? NULL;
          },
        ],
        'postalCode' => [
          'type' => Type::string(),
          'description' => (string) $this->t('The postal code.'),
          'resolve' => function ($address) {
            return $address['postal_code'] ?? NULL;
          },
        ],
        'countryCode' => [
          'type' => Type::string(),
          'description' => (string) $this->t('The country code.'),
          'resolve' => function ($address) {
            return $address['country_code'] ?? NULL;
          },
        ],
        'givenName' => [
          'type' => Type::string(),
          'description' => (string) $this->t('The given name.'),
          'resolve' => function ($address) {
            return $address['given_name'] ?? NULL;
          },
        ],
        'familyName' => [
          'type' => Type::string(),
          'description' => (string) $this->t('The family name.'),
          'resolve' => function ($address) {
            return $address['family_name'] ?? NULL;
          },
        ],
      ],
    ]);

    return $types;
  }

} 