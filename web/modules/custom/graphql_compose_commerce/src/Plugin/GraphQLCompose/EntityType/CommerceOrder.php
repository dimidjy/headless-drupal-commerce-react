<?php

namespace Drupal\graphql_compose_commerce\Plugin\GraphQLCompose\EntityType;

use Drupal\graphql_compose\Plugin\GraphQLCompose\GraphQLComposeEntityTypeBase;

/**
 * {@inheritdoc}
 *
 * @GraphQLComposeEntityType(
 *   id = "commerce_order",
 *   base_fields = {
 *     "uuid" = {},
 *     "order_number" = {},
 *     "mail" = {},
 *     "ip_address" = {},
 *     "store_id" = {},
 *     "state" = {},
 *     "total_price" = {
 *       "field_type" = "commerce_price",
 *       "field_name" = "total",
 *     }
 *   },
 *   query_load_enabled = true,
 *   query_load_multiple_enabled = false,
 * )
 */
class CommerceOrder extends GraphQLComposeEntityTypeBase {

  /**
   * {@inheritdoc}
   */
  public function getInterfaces(?string $bundle_id = NULL): array {
    return ['Entity'];
  }

  /**
   * {@inheritdoc}
   */
  public function getFields() {
    return [
      'id' => [
        'type' => 'ID!',
        'description' => (string) $this->t('The order ID.'),
        'computed_callback' => [$this, 'getOrderId'],
      ],
      'orderNumber' => [
        'type' => 'String',
        'description' => (string) $this->t('The order number.'),
        'computed_callback' => [$this, 'getOrderNumber'],
      ],
      'total' => [
        'type' => 'CommercePrice!',
        'description' => (string) $this->t('The total price of the order.'),
        'computed_callback' => [$this, 'getTotalPrice'],
      ],
      'items' => [
        'type' => '[CommerceOrderItem]!',
        'description' => (string) $this->t('Order items.'),
        'computed_callback' => [$this, 'getOrderItems'],
      ],
      'billingProfile' => [
        'type' => 'CommerceProfile',
        'description' => (string) $this->t('The billing profile.'),
        'computed_callback' => [$this, 'getBillingProfile'],
      ],
      'shippingInformation' => [
        'type' => 'CommerceShippingInformation',
        'description' => (string) $this->t('The shipping information.'),
        'computed_callback' => [$this, 'getShippingInformation'],
      ],
      'state' => [
        'type' => 'String!',
        'description' => (string) $this->t('The order state.'),
        'computed_callback' => [$this, 'getOrderState'],
      ],
    ];
  }

  /**
   * Get the order ID.
   */
  public function getOrderId($entity) {
    return $entity->id();
  }

  /**
   * Get the order number.
   */
  public function getOrderNumber($entity) {
    return $entity->getOrderNumber();
  }

  /**
   * Get the total price.
   */
  public function getTotalPrice($entity) {
    return $entity->getTotalPrice();
  }

  /**
   * Get the order items.
   */
  public function getOrderItems($entity) {
    return $entity->getItems();
  }

  /**
   * Get the billing profile.
   */
  public function getBillingProfile($entity) {
    if ($entity->hasField('billing_profile') && !$entity->get('billing_profile')->isEmpty()) {
      return $entity->get('billing_profile')->entity;
    }
    return NULL;
  }

  /**
   * Get the shipping information.
   */
  public function getShippingInformation($entity) {
    if ($entity->hasField('shipments') && !$entity->get('shipments')->isEmpty()) {
      $shipments = $entity->get('shipments')->referencedEntities();
      if (!empty($shipments)) {
        // For simplicity, just return the first shipment
        return $shipments[0];
      }
    }
    return NULL;
  }

  /**
   * Get the order state.
   */
  public function getOrderState($entity) {
    return $entity->getState()->getId();
  }

} 