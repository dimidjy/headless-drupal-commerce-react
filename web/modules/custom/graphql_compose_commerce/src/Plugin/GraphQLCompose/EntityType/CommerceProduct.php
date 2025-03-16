<?php

namespace Drupal\graphql_compose_commerce\Plugin\GraphQLCompose\EntityType;

use Drupal\graphql_compose\Plugin\GraphQLCompose\GraphQLComposeEntityTypeBase;

/**
 * {@inheritdoc}
 *
 * @GraphQLComposeEntityType(
 *   id = "commerce_product",
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

    return $fields;
  }

} 