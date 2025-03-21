<?php

namespace Drupal\paragraph_inline_form\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Entity\EntityFieldManagerInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Controller for paragraph autocomplete functionality.
 */
class ParagraphsAutoComplete extends ControllerBase {
  
  CONST SKIP_FIELDS = [
    'id',
    'parent_id',
    'parent_type',
    'parent_field_name',
    'parent_field_type',
    'parent_field_settings',
    'parent_field_instance',
    'parent_field_instance_settings',
    'behavior_settings'
  ];
  
  /**
   * The entity field manager.
   *
   * @var \Drupal\Core\Entity\EntityFieldManagerInterface
   */
  protected $entityFieldManager;
  
  /**
   * The entity type manager.
   * 
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;
  
  /**
   * Constructs a ParagraphsAutoComplete object.
   *
   * @param \Drupal\Core\Entity\EntityFieldManagerInterface $entity_field_manager
   *   The entity field manager.
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager.
   */
  public function __construct(EntityFieldManagerInterface $entity_field_manager, EntityTypeManagerInterface $entity_type_manager) {
    $this->entityFieldManager = $entity_field_manager;
    $this->entityTypeManager = $entity_type_manager;
  }
  
  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('entity_field.manager'),
      $container->get('entity_type.manager')
    );
  }
  
  /**
   * Gets all text field names from paragraph bundle(s).
   *
   * @param array $paragraph_types
   *   An array of paragraph type IDs.
   *
   * @return array
   *   An array of field names that are text fields.
   */
  protected function getTextFields(array $paragraph_types) {
    $text_fields = [];
    
    $text_fields[] = 'id';
    
    foreach ($paragraph_types as $bundle) {
      $field_definitions = $this->entityFieldManager->getFieldDefinitions('paragraph', $bundle);
      
      foreach ($field_definitions as $field_name => $field_definition) {
        $field_type = $field_definition->getType();
        
        // Include text and string fields
        if (in_array($field_type, ['text', 'text_long', 'text_with_summary', 'string', 'string_long'])) {
          $text_fields[] = $field_name;
        }
      }
    }
    
    return array_unique($text_fields);
  }

  /**
   * Returns autocomplete suggestions for paragraphs.
   *
   * @param string $paragraphs
   *   The pipe-separated list of paragraph types to search.
   *
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   *   The JSON response with paragraph suggestions.
   */
  public function paragraphsAutoComplete($paragraphs) {
    $paragraphs_array = explode('|', $paragraphs);
    $requestedData = \Drupal::request();
    $text = $requestedData->query->get('q');

    $query = $this->entityTypeManager->getStorage('paragraph')->getQuery()
      ->accessCheck(FALSE)
      ->range(0, 20)
      ->condition('type', $paragraphs_array, 'IN');
      
    $conditions = $query->orConditionGroup();
    
    $text_fields = $this->getTextFields($paragraphs_array);
    
    foreach ($text_fields as $field_name) {
      $conditions->condition($field_name, '%' . $text . '%', 'like');
    }
      
    $query->condition($conditions);
      
    $queryResult = $query->execute();
    $queryResult = array_unique($queryResult);

    $paragraphs_ids = [];
    if (count($queryResult) > 0) {
      $paragraphs_ids = array_values($queryResult);
    }
    $results = [];
    
    foreach ($paragraphs_ids as $pid) {
      $paragraph = $this->entityTypeManager->getStorage('paragraph')->load($pid);
      $label = '';
      $value = '';
      
      if ($paragraph->hasField('field_title') && !empty($paragraph->field_title->value)) {
        $label = $paragraph->field_title->value . ' (' . $pid . ')';
        $value = $paragraph->field_title->value . ' (' . $pid . ')';
      }
      else {
        $found_value = FALSE;
        foreach ($text_fields as $field_name) {
          if (!in_array($field_name, self::SKIP_FIELDS) && $paragraph->hasField($field_name) && !empty($paragraph->get($field_name)->value)) {
            $label = $paragraph->get($field_name)->value . ' (' . $pid . ')';
            $value = $paragraph->get($field_name)->value . ' (' . $pid . ')';
            $found_value = TRUE;
            break;
          }
        }
        
        if (!$found_value) {
          $label = str_replace('_', ' ', ucfirst($paragraph->bundle())) . ' (' . $pid . ')';
          $value = str_replace('_', ' ', ucfirst($paragraph->bundle())) . ' (' . $pid . ')';
        }
      }

      $results[] = [
        'label' => $label,
        'value' => $value,
      ];
    }
           
    return new JsonResponse($results);
  }

} 