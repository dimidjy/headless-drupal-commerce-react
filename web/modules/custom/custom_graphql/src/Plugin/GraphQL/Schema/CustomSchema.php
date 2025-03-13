<?php

namespace Drupal\custom_graphql\Plugin\GraphQL\Schema;

use Drupal\graphql\GraphQL\ResolverBuilder;
use Drupal\graphql\GraphQL\ResolverRegistry;
use Drupal\graphql\Plugin\GraphQL\Schema\SdlSchemaPluginBase;

/**
 * @Schema(
 *   id = "custom_schema",
 *   name = "Custom schema",
 *   description = "Custom GraphQL schema with paragraph support",
 *   extensions = {}
 * )
 */
class CustomSchema extends SdlSchemaPluginBase {

  /**
   * {@inheritdoc}
   */
  public function getSchemaDefinition() {
    $schema = <<<GQL
      schema {
        query: Query
      }
      
      type Query {
        paragraph(id: ID!): Paragraph
      }
      
      type Paragraph {
        id: ID!
        type: String!
        uuid: String!
        fields: [ParagraphField]
      }
      
      type ParagraphField {
        name: String!
        value: String
      }
GQL;
    return $schema;
  }

  /**
   * {@inheritdoc}
   */
  public function getResolverRegistry() {
    $builder = new ResolverBuilder();
    $registry = new ResolverRegistry();
    
    // Add resolver for paragraph query.
    $registry->addFieldResolver('Query', 'paragraph',
      $builder->compose(
        $builder->fromArgument('id'),
        $builder->callback(function ($id) {
          $resolver = \Drupal::service('custom_graphql.paragraph_resolver');
          return $resolver->loadById($id);
        })
      )
    );
    
    // Add resolvers for Paragraph type.
    $registry->addFieldResolver('Paragraph', 'id',
      $builder->callback(function ($paragraph) {
        return $paragraph->id();
      })
    );
    
    $registry->addFieldResolver('Paragraph', 'type',
      $builder->callback(function ($paragraph) {
        return $paragraph->bundle();
      })
    );
    
    $registry->addFieldResolver('Paragraph', 'uuid',
      $builder->callback(function ($paragraph) {
        return $paragraph->uuid();
      })
    );
    
    $registry->addFieldResolver('Paragraph', 'fields',
      $builder->callback(function ($paragraph) {
        $resolver = \Drupal::service('custom_graphql.paragraph_resolver');
        return $resolver->getFieldData($paragraph);
      })
    );
    
    $registry->addFieldResolver('ParagraphField', 'name',
      $builder->callback(function ($field) {
        return $field['name'] ?? null;
      })
    );
    
    $registry->addFieldResolver('ParagraphField', 'value',
      $builder->callback(function ($field) {
        return $field['value'] ?? null;
      })
    );
    
    return $registry;
  }
} 