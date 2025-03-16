<?php

namespace Drupal\graphql_compose_commerce\Plugin\GraphQLCompose\FieldType;

use Drupal\graphql\GraphQL\Execution\FieldContext;
use Drupal\graphql\GraphQL\Resolver\Composite;
use Drupal\graphql\GraphQL\ResolverBuilder;
use Drupal\graphql_compose\Plugin\GraphQLCompose\GraphQLComposeFieldTypeBase;
use GraphQL\Type\Definition\Type;

/**
 * {@inheritdoc}
 *
 * @GraphQLComposeFieldType(
 *   id = "commerce_price",
 *   type_sdl = "String"
 * )
 */
class CommercePrice extends GraphQLComposeFieldTypeBase {

  /**
   * {@inheritdoc}
   */
  public function getTypeSdl(): string {
    return 'String';
  }

  /**
   * {@inheritdoc}
   */
  public function getProducers(ResolverBuilder $builder): Composite {
    return $builder->compose(
      $builder->produce('field')
        ->map('entity', $builder->fromParent())
        ->map('field', $builder->fromValue($this->getFieldName())),
      $builder->callback(function ($value, $context) {
        // Handle both FieldContext and array as the context parameter
        return $this->resolveFieldItem($value, $context instanceof FieldContext ? $context : null);
      })
    );
  }

  /**
   * Resolve the field item.
   *
   * @param mixed $value
   *   The field value.
   * @param \Drupal\graphql\GraphQL\Execution\FieldContext|null $context
   *   The field context.
   *
   * @return string
   *   The formatted price string.
   */
  protected function resolveFieldItem($value, ?FieldContext $context) {
    // Default values to ensure we always return something valid
    $number = '0.00';
    $currency_code = 'USD';
    
    if ($value) {
      // Handle different ways the price data might be structured
      if (is_object($value) && method_exists($value, 'getValue')) {
        // If it's a field item, get its values
        $price_data = $value->getValue();
        
        if (is_array($price_data) && !empty($price_data[0])) {
          $price_data = $price_data[0];
        }
        
        // Try to get price data using toPrice() method if available
        if (method_exists($value, 'toPrice')) {
          try {
            $price_object = $value->toPrice();
            if ($price_object) {
              $number = $price_object->getNumber();
              $currency_code = $price_object->getCurrencyCode();
            }
          }
          catch (\Exception $e) {
            \Drupal::logger('graphql_compose_commerce')->warning('Error getting price with toPrice(): @error', [
              '@error' => $e->getMessage(),
            ]);
          }
        }
        
        // Fallback to array access if toPrice() didn't work
        if (!empty($price_data['number'])) {
          $number = $price_data['number'];
        }
        if (!empty($price_data['currency_code'])) {
          $currency_code = $price_data['currency_code'];
        }
      }
      elseif (is_object($value)) {
        // Direct object properties
        if (!empty($value->number)) {
          $number = $value->number;
        }
        if (!empty($value->currency_code)) {
          $currency_code = $value->currency_code;
        }
        
        // Try to access price data through methods if they exist
        if (method_exists($value, 'getNumber') && method_exists($value, 'getCurrencyCode')) {
          try {
            $number = $value->getNumber();
            $currency_code = $value->getCurrencyCode();
          }
          catch (\Exception $e) {
            \Drupal::logger('graphql_compose_commerce')->warning('Error getting price with getNumber/getCurrencyCode: @error', [
              '@error' => $e->getMessage(),
            ]);
          }
        }
      }
      elseif (is_array($value)) {
        // Array structure
        if (!empty($value['number'])) {
          $number = $value['number'];
        }
        if (!empty($value['currency_code'])) {
          $currency_code = $value['currency_code'];
        }
      }
    }
    
    // Return only the formatted price string
    return $this->formatPrice($number, $currency_code);
  }

  /**
   * Format a price with its currency.
   *
   * @param string $number
   *   The price number.
   * @param string $currency_code
   *   The currency code.
   *
   * @return string
   *   The formatted price.
   */
  protected function formatPrice($number, $currency_code) {
    // Use the commerce price formatter service if available.
    if (\Drupal::hasService('commerce_price.currency_formatter')) {
      $formatter = \Drupal::service('commerce_price.currency_formatter');
      return $formatter->format($number, $currency_code);
    }

    // Fallback to basic formatting.
    return $number . ' ' . $currency_code;
  }
} 