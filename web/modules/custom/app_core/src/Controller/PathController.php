<?php

namespace Drupal\app_core\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Path\PathMatcherInterface;
use Drupal\path_alias\AliasManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Drupal\Core\Entity\EntityTypeManagerInterface;

/**
 * Controller for path-related operations.
 */
class PathController extends ControllerBase {

  /**
   * The path alias manager.
   *
   * @var \Drupal\path_alias\AliasManagerInterface
   */
  protected $aliasManager;

  /**
   * The path matcher.
   *
   * @var \Drupal\Core\Path\PathMatcherInterface
   */
  protected $pathMatcher;

  /**
   * The entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * Constructs a PathController object.
   *
   * @param \Drupal\path_alias\AliasManagerInterface $alias_manager
   *   The path alias manager.
   * @param \Drupal\Core\Path\PathMatcherInterface $path_matcher
   *   The path matcher.
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager.
   */
  public function __construct(
    AliasManagerInterface $alias_manager,
    PathMatcherInterface $path_matcher,
    EntityTypeManagerInterface $entity_type_manager
  ) {
    $this->aliasManager = $alias_manager;
    $this->pathMatcher = $path_matcher;
    $this->entityTypeManager = $entity_type_manager;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('path_alias.manager'),
      $container->get('path.matcher'),
      $container->get('entity_type.manager')
    );
  }

  /**
   * Resolves a path to a node UUID.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *   The request object.
   *
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   *   A JSON response containing the UUID of the node.
   */
  public function resolvePathToUuid(Request $request) {
    // Get the path from the query parameter
    $path = $request->query->get('path');
    
    if (empty($path)) {
      return new JsonResponse(['error' => 'No path provided'], 400);
    }
    
    // Normalize the path (ensure it starts with a slash)
    if ($path[0] !== '/') {
      $path = '/' . $path;
    }
    
    // Remove trailing slash if present (except for the root path)
    if (strlen($path) > 1 && substr($path, -1) === '/') {
      $path = rtrim($path, '/');
    }
    
    // Get the internal path from the alias
    $internal_path = $this->aliasManager->getPathByAlias($path);
    
    // Log for debugging
    \Drupal::logger('app_core')->notice('Resolving path: @path to internal path: @internal_path', [
      '@path' => $path,
      '@internal_path' => $internal_path,
    ]);
    
    // Check if this is a node path
    if (preg_match('/^\/node\/(\d+)$/', $internal_path, $matches)) {
      $nid = $matches[1];
      
      try {
        // Load the node
        $node = $this->entityTypeManager->getStorage('node')->load($nid);
        
        if ($node) {
          // Return the UUID
          return new JsonResponse([
            'uuid' => $node->uuid(),
            'nid' => $nid,
            'title' => $node->getTitle(),
            'type' => $node->getType(),
          ]);
        }
      }
      catch (\Exception $e) {
        \Drupal::logger('app_core')->error('Error loading node: @error', [
          '@error' => $e->getMessage(),
        ]);
      }
    }
    
    // If we get here, no node was found
    return new JsonResponse(['error' => 'Page not found'], 404);
  }
} 