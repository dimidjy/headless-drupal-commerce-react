<?php

namespace Drupal\graphql_compose_commerce\Plugin\GraphQLCompose\EntityType;

use Drupal\graphql_compose\Plugin\GraphQLCompose\GraphQLComposeEntityTypeBase;

/**
 * {@inheritdoc}
 *
 * @GraphQLComposeEntityType(
 *   id = "commerce_product_variation",
 *   prefix = "CommerceProductVariation",
 *   type_sdl = "CommerceProductVariation",
 *   query_load_enabled = TRUE,
 *   base_fields = {
 *     "variation_id" = {},
 *     "type" = {},
 *     "uuid" = {},
 *     "status" = {},
 *     "created" = {},
 *     "changed" = {},
 *     "product_id" = {},
 *     "sku" = {},
 *     "title" = {},
 *     "price" = {},
 *     "list_price" = {},
 *   },
 *   bundles = {
 *     "default" = {},
 *   }
 * )
 */
class CommerceProductVariation extends GraphQLComposeEntityTypeBase {

  /**
   * {@inheritdoc}
   */
  public function getInterfaces(?string $bundle_id = NULL): array {
    // Return only valid interface types
    return parent::getInterfaces($bundle_id);
  }

  /**
   * {@inheritdoc}
   */
  public function getBaseFields(): array {
    $fields = parent::getBaseFields();

    // Add custom resolvers for specific fields if needed.
    // For example, you might want to customize how price is resolved.
    
    // Add product field to access the parent product
    $fields['product'] = [
      'type' => 'CommerceProduct',
      'description' => (string) $this->t('The parent product of this variation.'),
      'resolve' => function ($entity) {
        if ($entity->hasField('product_id') && !$entity->get('product_id')->isEmpty()) {
          return $entity->getProduct();
        }
        return NULL;
      },
    ];
    
    // Add formatted price field
    $fields['formatted_price'] = [
      'type' => 'String',
      'description' => (string) $this->t('The formatted price of the variation.'),
      'resolve' => function ($entity) {
        if ($entity->hasField('price') && !$entity->get('price')->isEmpty()) {
          $price = $entity->get('price')->first();
          if ($price) {
            /** @var \Drupal\commerce_price\Price $price_object */
            $price_object = $price->toPrice();
            /** @var \Drupal\commerce_price\PriceFormatterInterface $price_formatter */
            $price_formatter = \Drupal::service('commerce_price.price_formatter');
            return $price_formatter->format($price_object->getNumber(), $price_object->getCurrencyCode());
          }
        }
        return NULL;
      },
    ];
    
    // Add formatted list price field
    $fields['formatted_list_price'] = [
      'type' => 'String',
      'description' => (string) $this->t('The formatted list price of the variation.'),
      'resolve' => function ($entity) {
        if ($entity->hasField('list_price') && !$entity->get('list_price')->isEmpty()) {
          $price = $entity->get('list_price')->first();
          if ($price) {
            /** @var \Drupal\commerce_price\Price $price_object */
            $price_object = $price->toPrice();
            /** @var \Drupal\commerce_price\PriceFormatterInterface $price_formatter */
            $price_formatter = \Drupal::service('commerce_price.price_formatter');
            return $price_formatter->format($price_object->getNumber(), $price_object->getCurrencyCode());
          }
        }
        return NULL;
      },
    ];
    
    // Add discount percentage field
    $fields['discount_percentage'] = [
      'type' => 'Float',
      'description' => (string) $this->t('The discount percentage if list price is available.'),
      'resolve' => function ($entity) {
        if ($entity->hasField('price') && !$entity->get('price')->isEmpty() &&
            $entity->hasField('list_price') && !$entity->get('list_price')->isEmpty()) {
          $price = $entity->get('price')->first()->toPrice();
          $list_price = $entity->get('list_price')->first()->toPrice();
          
          if ($price && $list_price && $list_price->getNumber() > 0) {
            $discount = ($list_price->getNumber() - $price->getNumber()) / $list_price->getNumber() * 100;
            return round($discount, 2);
          }
        }
        return NULL;
      },
    ];

    return $fields;
  }

} 