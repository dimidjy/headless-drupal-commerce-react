<?php

namespace Drupal\custom_graphql\GraphQL\Resolver;

use Drupal\Core\Entity\EntityFieldManagerInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\paragraphs\ParagraphInterface;

/**
 * Service for resolving paragraph data for GraphQL.
 */
class ParagraphResolver {

  /**
   * The entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * The entity field manager.
   *
   * @var \Drupal\Core\Entity\EntityFieldManagerInterface
   */
  protected $entityFieldManager;

  /**
   * Constructs a ParagraphResolver object.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager.
   * @param \Drupal\Core\Entity\EntityFieldManagerInterface $entity_field_manager
   *   The entity field manager.
   */
  public function __construct(
    EntityTypeManagerInterface $entity_type_manager,
    EntityFieldManagerInterface $entity_field_manager
  ) {
    $this->entityTypeManager = $entity_type_manager;
    $this->entityFieldManager = $entity_field_manager;
  }

  /**
   * Loads a paragraph by ID.
   *
   * @param int $id
   *   The paragraph ID.
   *
   * @return \Drupal\paragraphs\ParagraphInterface|null
   *   The paragraph entity or NULL if not found.
   */
  public function loadById($id) {
    try {
      $paragraph = $this->entityTypeManager->getStorage('paragraph')->load($id);
      return $paragraph instanceof ParagraphInterface ? $paragraph : NULL;
    }
    catch (\Exception $e) {
      return NULL;
    }
  }

  /**
   * Gets field data from a paragraph.
   *
   * @param \Drupal\paragraphs\ParagraphInterface $paragraph
   *   The paragraph entity.
   *
   * @return array
   *   An array of field data.
   */
  public function getFieldData(ParagraphInterface $paragraph) {
    $fields = [];
    $field_definitions = $this->entityFieldManager->getFieldDefinitions(
      'paragraph',
      $paragraph->bundle()
    );

    foreach ($field_definitions as $field_name => $field_definition) {
      // Skip internal fields.
      if (in_array($field_name, ['id', 'uuid', 'type', 'revision_id', 'parent_id', 'parent_type', 'parent_field_name'])) {
        continue;
      }

      if (!$paragraph->hasField($field_name)) {
        continue;
      }

      $field = $paragraph->get($field_name);
      if ($field->isEmpty()) {
        continue;
      }

      $field_type = $field_definition->getType();
      $field_value = NULL;

      switch ($field_type) {
        case 'string':
        case 'string_long':
        case 'text':
        case 'text_long':
        case 'text_with_summary':
          $field_value = $field->value;
          break;

        case 'entity_reference':
          $referenced_entities = $field->referencedEntities();
          if (!empty($referenced_entities)) {
            $values = [];
            foreach ($referenced_entities as $entity) {
              $values[] = [
                'id' => $entity->id(),
                'type' => $entity->getEntityTypeId(),
                'bundle' => $entity->bundle(),
              ];
            }
            $field_value = json_encode($values);
          }
          break;

        case 'image':
        case 'file':
          $file_data = $field->getValue();
          if (!empty($file_data)) {
            $field_value = json_encode($file_data);
          }
          break;

        default:
          $field_value = json_encode($field->getValue());
          break;
      }

      if ($field_value !== NULL) {
        $fields[] = [
          'name' => $field_name,
          'value' => $field_value,
        ];
      }
    }

    return $fields;
  }
} 