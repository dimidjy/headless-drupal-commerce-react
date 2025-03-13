<?php

namespace Drupal\custom_graphql\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\node\NodeInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * Controller for providing page configuration.
 */
class PageConfigController extends ControllerBase {

  /**
   * The entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * Constructs a PageConfigController object.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager.
   */
  public function __construct(EntityTypeManagerInterface $entity_type_manager) {
    $this->entityTypeManager = $entity_type_manager;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('entity_type.manager')
    );
  }

  /**
   * Returns the page configuration.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *   The request object.
   *
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   *   The JSON response.
   */
  public function getConfig(Request $request) {
    // Get the page node ID from the request, default to the front page.
    $node_id = $request->query->get('node_id');
    if (!$node_id) {
      $front_page = $this->config('system.site')->get('page.front');
      if (preg_match('/node\/(\d+)/', $front_page, $matches)) {
        $node_id = $matches[1];
      }
    }

    $config = [
      'header_placeholder' => 'Header placeholder - will be implemented later',
      'footer_placeholder' => 'Footer placeholder - will be implemented later',
      'paragraph_ids' => [],
    ];

    if ($node_id) {
      $node = $this->entityTypeManager->getStorage('node')->load($node_id);
      if ($node instanceof NodeInterface) {
        // Extract paragraph IDs from the node fields.
        $config['paragraph_ids'] = $this->extractParagraphIds($node);
      }
    }

    return new JsonResponse($config);
  }

  /**
   * Extracts paragraph IDs from a node.
   *
   * @param \Drupal\node\NodeInterface $node
   *   The node.
   *
   * @return array
   *   An array of paragraph IDs.
   */
  protected function extractParagraphIds(NodeInterface $node) {
    $paragraph_ids = [];

    // Check if the node has a field_paragraphs field
    if ($node->hasField('field_paragraphs') && !$node->get('field_paragraphs')->isEmpty()) {
      $paragraphs = $node->get('field_paragraphs')->referencedEntities();
      
      foreach ($paragraphs as $paragraph) {
        $paragraph_ids[] = $paragraph->id();
      }
    }

    return $paragraph_ids;
  }
} 