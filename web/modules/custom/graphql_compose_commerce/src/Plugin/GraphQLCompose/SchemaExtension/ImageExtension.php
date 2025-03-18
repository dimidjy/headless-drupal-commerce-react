<?php

namespace Drupal\graphql_compose_commerce\Plugin\GraphQLCompose\SchemaExtension;

use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\graphql_compose\Plugin\GraphQLCompose\GraphQLComposeSchemaExtensionBase;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Adds custom fields to the Image type.
 *
 * @GraphQLComposeSchemaExtension(
 *   id = "image_extension",
 *   name = "Image Variations",
 *   description = "Adds variations field to the Image type.",
 *   type = "Image"
 * )
 */
class ImageExtension extends GraphQLComposeSchemaExtensionBase implements ContainerFactoryPluginInterface {

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition
    );
  }

  /**
   * {@inheritdoc}
   */
  public function getExtension() {
    return [
      'fields' => [
        'variations' => [
          'type' => Type::listOf(static::type('ImageVariation')),
          'description' => (string) $this->t('Image style variations.'),
          'args' => [
            'styles' => [
              'type' => Type::string(),
              'description' => (string) $this->t('The image style(s) to use.'),
            ],
          ],
        ],
      ],
    ];
  }

} 