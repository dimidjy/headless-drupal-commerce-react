<?php

namespace Drupal\graphql_compose_commerce\Plugin\GraphQLCompose\SchemaType;

use Drupal\graphql_compose\Plugin\GraphQLCompose\GraphQLComposeSchemaTypeBase;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

/**
 * {@inheritdoc}
 *
 * @GraphQLComposeSchemaType(
 *   id = "CommerceShippingInformation"
 * )
 */
class CommerceShippingInformationType extends GraphQLComposeSchemaTypeBase {

  /**
   * {@inheritdoc}
   */
  public function getTypes(): array {
    $types = [];
    
    $types[] = new ObjectType([
      'name' => $this->getPluginId(),
      'description' => (string) $this->t('Shipping information.'),
      'fields' => [
        'address' => [
          'type' => static::type('CommerceAddress'),
          'description' => (string) $this->t('The shipping address.'),
          'resolve' => function ($shipment) {
            if ($shipment->hasField('shipping_profile') && !$shipment->get('shipping_profile')->isEmpty()) {
              $profile = $shipment->get('shipping_profile')->entity;
              if ($profile && $profile->hasField('address') && !$profile->get('address')->isEmpty()) {
                return $profile->get('address')->first()->getValue();
              }
            }
            return NULL;
          },
        ],
        'shippingMethod' => [
          'type' => static::type('CommerceShippingMethod'),
          'description' => (string) $this->t('The shipping method.'),
          'resolve' => function ($shipment) {
            if ($shipment->hasField('shipping_method') && !$shipment->get('shipping_method')->isEmpty()) {
              $method_id = $shipment->get('shipping_method')->getString();
              if ($method_id) {
                return [
                  'id' => $method_id,
                  'label' => $shipment->getShippingMethodLabel(),
                  'amount' => $shipment->getAmount(),
                ];
              }
            }
            return NULL;
          },
        ],
      ],
    ]);

    $types[] = new ObjectType([
      'name' => 'CommerceShippingMethod',
      'description' => (string) $this->t('A shipping method.'),
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