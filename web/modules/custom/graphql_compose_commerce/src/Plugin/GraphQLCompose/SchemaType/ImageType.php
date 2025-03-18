<?php

namespace Drupal\graphql_compose_commerce\Plugin\GraphQLCompose\SchemaType;

use Drupal\graphql_compose\Plugin\GraphQLCompose\GraphQLComposeSchemaTypeBase;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

/**
 * {@inheritdoc}
 *
 * @GraphQLComposeSchemaType(
 *   id = "ImageVariation",
 * )
 */
class ImageType extends GraphQLComposeSchemaTypeBase {

  /**
   * {@inheritdoc}
   */
  public function getTypes(): array {
    $types = [];

    $types[] = new ObjectType([
      'name' => $this->getPluginId(),
      'description' => (string) $this->t('An image variation object.'),
      'fields' => function () {
        return [
          'url' => [
            'type' => Type::nonNull(Type::string()),
            'description' => (string) $this->t('The URL of the image variation.'),
          ],
        ];
      },
    ]);

    return $types;
  }

  /**
   * {@inheritdoc}
   */
  public function getExtensions(): array {
    // No extensions for this type
    return [];
  }

} 