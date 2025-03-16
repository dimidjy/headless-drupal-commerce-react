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
 *   type_sdl = "CommercePriceItem"
 * )
 */
class CommercePrice extends GraphQLComposeFieldTypeBase {

  /**
   * {@inheritdoc}
   */
  public function getTypeSdl(): string {
    return 'CommercePriceItem';
  }

  /**
   * {@inheritdoc}
   */
  public function getProducers(ResolverBuilder $builder): Composite {
    return $builder->compose(
      $builder->produce('field')
        ->map('entity', $builder->fromParent())
        ->map('field', $builder->fromValue($this->getFieldName())),
      $builder->callback(fn ($value, FieldContext $context) => $this->resolveFieldItem($value, $context))
    );
  }

  /**
   * Resolve the field item.
   *
   * @param mixed $value
   *   The field value.
   * @param \Drupal\graphql\GraphQL\Execution\FieldContext $context
   *   The field context.
   *
   * @return array|null
   *   The resolved field item.
   */
  protected function resolveFieldItem($value, FieldContext $context) {
    if (!$value) {
      return NULL;
    }

    // Extract the price components.
    $number = $value->number ?? NULL;
    $currency_code = $value->currency_code ?? NULL;

    if (!$number || !$currency_code) {
      return NULL;
    }

    return [
      'number' => $number,
      'currency_code' => $currency_code,
      'formatted' => $this->formatPrice($number, $currency_code),
    ];
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