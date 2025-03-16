<?php

namespace Drupal\graphql_compose_commerce\Plugin\GraphQLCompose\EntityType;

use Drupal\graphql_compose\Plugin\GraphQLCompose\GraphQLComposeEntityTypeBase;
use Drupal\Core\Url;
use Drupal\graphql\GraphQL\ResolverRegistryInterface;
use Drupal\graphql\GraphQL\ResolverBuilder;

/**
 * {@inheritdoc}
 *
 * @GraphQLComposeEntityType(
 *   id = "commerce_product",
 *   prefix = "CommerceProduct",
 *   type_sdl = "CommerceProduct",
 *   query_load_enabled = TRUE,
 *   base_fields = {
 *     "product_id" = {},
 *     "type" = {},
 *     "uuid" = {},
 *     "status" = {},
 *     "created" = {},
 *     "changed" = {},
 *     "stores" = {},
 *     "variations" = {},
 *     "default_variation" = {},
 *   },
 *   bundles = {
 *     "default" = {
 *       "fields" = {
 *         "title" = {},
 *         "price" = {},
 *       }
 *     },
 *   }
 * )
 */
class CommerceProduct extends GraphQLComposeEntityTypeBase {

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
    // For example, you might want to customize how variations are resolved.
    
    // Add price field from default variation
    $fields['price'] = [
      'type' => 'String',
      'description' => (string) $this->t('The formatted price of the default product variation.'),
      'resolve' => function ($entity) {
        // Add debugging
        \Drupal::logger('graphql_compose_commerce')->debug('CommerceProduct price resolver for entity: @id', [
          '@id' => $entity->id(),
        ]);
        
        if ($entity->hasField('variations') && !$entity->get('variations')->isEmpty()) {
          // Try to get the default variation first
          if ($entity->hasField('default_variation') && !$entity->get('default_variation')->isEmpty()) {
            $variation = $entity->get('default_variation')->entity;
            if ($variation && $variation->hasField('price') && !$variation->get('price')->isEmpty()) {
              $price = $variation->get('price')->first();
              \Drupal::logger('graphql_compose_commerce')->debug('CommerceProduct using default variation price: @price', [
                '@price' => print_r($price, TRUE),
              ]);
              return $price;
            }
          }
          
          // Fallback to the first variation
          $variation = $entity->get('variations')->first()->entity;
          if ($variation && $variation->hasField('price') && !$variation->get('price')->isEmpty()) {
            $price = $variation->get('price')->first();
            // \Drupal::logger('graphql_compose_commerce')->debug('CommerceProduct using first variation price: @price', [
            //   '@price' => print_r($price, TRUE),
            // ]);
            return $price;
          }
        }
        
        // If we couldn't find a price, return a default price object
        \Drupal::logger('graphql_compose_commerce')->debug('CommerceProduct no price found, using default');
        
        // Create a default price array with the expected structure
        return [
          'number' => '0.00',
          'currency_code' => 'USD',
        ];
      },
    ];
    
    // Add title field
    $fields['title'] = [
      'type' => 'String',
      'description' => (string) $this->t('The title of the product.'),
      'resolve' => function ($entity) {
        return $entity->getTitle();
      },
    ];
    
    // Add variation prices field to access all variation prices
    $fields['variationPrices'] = [
      'type' => '[VariationPriceItem]',
      'description' => (string) $this->t('All prices from product variations.'),
      'resolve' => function ($entity) {
        $prices = [];
        if ($entity->hasField('variations') && !$entity->get('variations')->isEmpty()) {
          foreach ($entity->get('variations') as $variationItem) {
            $variation = $variationItem->entity;
            if ($variation && $variation->hasField('price') && !$variation->get('price')->isEmpty()) {
              // Get the price field
              $price_field = $variation->get('price')->first();
              
              // Format the price using the CommercePrice field type
              $formatted_price = '';
              if (\Drupal::hasService('commerce_price.currency_formatter')) {
                $price_data = $price_field->getValue();
                $number = $price_data['number'] ?? '0.00';
                $currency_code = $price_data['currency_code'] ?? 'USD';
                
                $formatter = \Drupal::service('commerce_price.currency_formatter');
                $formatted_price = $formatter->format($number, $currency_code);
              } else {
                // Fallback to basic formatting
                $price_data = $price_field->getValue();
                $number = $price_data['number'] ?? '0.00';
                $currency_code = $price_data['currency_code'] ?? 'USD';
                $formatted_price = $number . ' ' . $currency_code;
              }
              
              $prices[] = [
                'variation_id' => $variation->id(),
                'sku' => $variation->getSku(),
                'title' => $variation->getTitle(),
                'price' => $formatted_price,
              ];
            }
          }
        }
        return $prices;
      },
    ];
    
    // Add enhanced variations field with more data
    $fields['enhancedVariations'] = [
      'type' => '[CommerceProductVariation]',
      'description' => (string) $this->t('All product variations with complete data.'),
      'resolve' => function ($entity) {
        $variations = [];
        if ($entity->hasField('variations') && !$entity->get('variations')->isEmpty()) {
          foreach ($entity->get('variations') as $variationItem) {
            $variation = $variationItem->entity;
            if ($variation) {
              $variations[] = $variation;
            }
          }
        }
        return $variations;
      },
    ];
    
    // Add image field from default variation
    $fields['product_image'] = [
      'type' => 'Image',
      'description' => (string) $this->t('The image of the default product variation.'),
      'resolve' => function ($entity) {
        if ($entity->hasField('variations') && !$entity->get('variations')->isEmpty()) {
          // Try to get the default variation first
          if ($entity->hasField('default_variation') && !$entity->get('default_variation')->isEmpty()) {
            $variation = $entity->get('default_variation')->entity;
            if ($variation && $variation->hasField('image') && !$variation->get('image')->isEmpty()) {
              return $variation->get('image')->first();
            }
          }
          
          // Fallback to the first variation
          $variation = $entity->get('variations')->first()->entity;
          if ($variation && $variation->hasField('image') && !$variation->get('image')->isEmpty()) {
            return $variation->get('image')->first();
          }
        }
        return NULL;
      },
    ];
    
    // Add product URL field
    $fields['url'] = [
      'type' => 'Url',
      'description' => (string) $this->t('The URL of the product.'),
      'resolve' => function ($entity) {
        if ($entity->hasField('path') && !$entity->get('path')->isEmpty()) {
          return $entity->toUrl()->toString();
        }
        
        // Fallback to canonical URL
        try {
          return $entity->toUrl('canonical')->toString();
        }
        catch (\Exception $e) {
          return NULL;
        }
      },
    ];

    return $fields;
  }

  /**
   * {@inheritdoc}
   */
  public function resolveEntityQuery(\Drupal\graphql\GraphQL\ResolverRegistryInterface $registry, \Drupal\graphql\GraphQL\ResolverBuilder $builder): void {
    // Let the parent class handle the entity query resolution
    parent::resolveEntityQuery($registry, $builder);
  }

} 