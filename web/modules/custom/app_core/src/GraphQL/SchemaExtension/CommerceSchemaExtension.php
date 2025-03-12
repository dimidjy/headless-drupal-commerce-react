<?php

namespace Drupal\app_core\GraphQL\SchemaExtension;

use Drupal\graphql\GraphQL\ResolverRegistryInterface;
use Drupal\graphql_compose\GraphQL\SchemaExtensionPluginBase;

/**
 * Extends the GraphQL schema with Commerce-specific types and fields.
 */
class CommerceSchemaExtension extends SchemaExtensionPluginBase {

  /**
   * {@inheritdoc}
   */
  public function registerResolvers(ResolverRegistryInterface $registry) {
    // Register Query resolvers.
    $registry->addFieldResolver('Query', 'product',
      $this->builder->compose(
        $this->builder->produce('app_core.commerce_product_resolver:resolveProduct')
          ->map('id', $this->builder->fromArgument('id'))
      )
    );

    $registry->addFieldResolver('Query', 'products',
      $this->builder->compose(
        $this->builder->produce('app_core.commerce_product_resolver:resolveProducts')
          ->map('offset', $this->builder->fromArgument('offset'))
          ->map('limit', $this->builder->fromArgument('limit'))
          ->map('filter', $this->builder->fromArgument('filter'))
          ->map('sort', $this->builder->fromArgument('sort'))
      )
    );

    $registry->addFieldResolver('Query', 'cart',
      $this->builder->compose(
        $this->builder->produce('app_core.commerce_cart_resolver:resolveCart')
      )
    );

    // Register Mutation resolvers.
    $registry->addFieldResolver('Mutation', 'addToCart',
      $this->builder->compose(
        $this->builder->produce('app_core.commerce_cart_resolver:addToCart')
          ->map('productVariationId', $this->builder->fromArgument('productVariationId'))
          ->map('quantity', $this->builder->fromArgument('quantity'))
      )
    );

    $registry->addFieldResolver('Mutation', 'updateCartItem',
      $this->builder->compose(
        $this->builder->produce('app_core.commerce_cart_resolver:updateCartItem')
          ->map('orderItemId', $this->builder->fromArgument('orderItemId'))
          ->map('quantity', $this->builder->fromArgument('quantity'))
      )
    );

    $registry->addFieldResolver('Mutation', 'removeCartItem',
      $this->builder->compose(
        $this->builder->produce('app_core.commerce_cart_resolver:removeCartItem')
          ->map('orderItemId', $this->builder->fromArgument('orderItemId'))
      )
    );

    // Register CommerceProduct field resolvers.
    $registry->addFieldResolver('CommerceProduct', 'id',
      $this->builder->produce('entity_id')
        ->map('entity', $this->builder->fromParent())
    );

    $registry->addFieldResolver('CommerceProduct', 'uuid',
      $this->builder->produce('entity_uuid')
        ->map('entity', $this->builder->fromParent())
    );

    $registry->addFieldResolver('CommerceProduct', 'title',
      $this->builder->produce('entity_label')
        ->map('entity', $this->builder->fromParent())
    );

    $registry->addFieldResolver('CommerceProduct', 'created',
      $this->builder->produce('entity_created')
        ->map('entity', $this->builder->fromParent())
    );

    $registry->addFieldResolver('CommerceProduct', 'changed',
      $this->builder->produce('entity_changed')
        ->map('entity', $this->builder->fromParent())
    );

    $registry->addFieldResolver('CommerceProduct', 'status',
      $this->builder->produce('entity_published')
        ->map('entity', $this->builder->fromParent())
    );

    $registry->addFieldResolver('CommerceProduct', 'variations',
      $this->builder->produce('entity_reference')
        ->map('entity', $this->builder->fromParent())
        ->map('field', $this->builder->fromValue('variations'))
    );

    // Register CommerceProductVariation field resolvers.
    $registry->addFieldResolver('CommerceProductVariation', 'id',
      $this->builder->produce('entity_id')
        ->map('entity', $this->builder->fromParent())
    );

    $registry->addFieldResolver('CommerceProductVariation', 'uuid',
      $this->builder->produce('entity_uuid')
        ->map('entity', $this->builder->fromParent())
    );

    $registry->addFieldResolver('CommerceProductVariation', 'title',
      $this->builder->produce('entity_label')
        ->map('entity', $this->builder->fromParent())
    );

    $registry->addFieldResolver('CommerceProductVariation', 'sku',
      $this->builder->produce('property_path')
        ->map('type', $this->builder->fromValue('entity:commerce_product_variation'))
        ->map('value', $this->builder->fromParent())
        ->map('path', $this->builder->fromValue('sku.value'))
    );

    $registry->addFieldResolver('CommerceProductVariation', 'price',
      $this->builder->produce('property_path')
        ->map('type', $this->builder->fromValue('entity:commerce_product_variation'))
        ->map('value', $this->builder->fromParent())
        ->map('path', $this->builder->fromValue('price.first'))
    );

    // Register CommercePrice field resolvers.
    $registry->addFieldResolver('CommercePrice', 'number',
      $this->builder->produce('property_path')
        ->map('type', $this->builder->fromValue('field_item:commerce_price'))
        ->map('value', $this->builder->fromParent())
        ->map('path', $this->builder->fromValue('number'))
    );

    $registry->addFieldResolver('CommercePrice', 'currencyCode',
      $this->builder->produce('property_path')
        ->map('type', $this->builder->fromValue('field_item:commerce_price'))
        ->map('value', $this->builder->fromParent())
        ->map('path', $this->builder->fromValue('currency_code'))
    );

    $registry->addFieldResolver('CommercePrice', 'formatted',
      $this->builder->callback(function ($price) {
        if (!$price) {
          return NULL;
        }
        
        $currency_formatter = \Drupal::service('commerce_price.currency_formatter');
        return $currency_formatter->format($price['number'], $price['currency_code']);
      })
    );
  }

} 