<?php

namespace Drupal\app_core\GraphQL\Resolver;

use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\graphql\GraphQL\Resolver\ResolverInterface;

/**
 * Resolver for Commerce Product entities.
 */
class CommerceProductResolver implements ResolverInterface {

  /**
   * The entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * Constructs a CommerceProductResolver object.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager.
   */
  public function __construct(EntityTypeManagerInterface $entity_type_manager) {
    $this->entityTypeManager = $entity_type_manager;
  }

  /**
   * Resolves a product by ID.
   *
   * @param mixed $value
   *   The parent value.
   * @param array $args
   *   The arguments.
   *
   * @return \Drupal\commerce_product\Entity\ProductInterface|null
   *   The product entity or NULL if not found.
   */
  public function resolveProduct($value, array $args) {
    if (empty($args['id'])) {
      return NULL;
    }

    try {
      return $this->entityTypeManager->getStorage('commerce_product')->load($args['id']);
    }
    catch (\Exception $e) {
      return NULL;
    }
  }

  /**
   * Resolves a list of products.
   *
   * @param mixed $value
   *   The parent value.
   * @param array $args
   *   The arguments.
   *
   * @return array
   *   An array of product entities.
   */
  public function resolveProducts($value, array $args) {
    $query = $this->entityTypeManager->getStorage('commerce_product')->getQuery()
      ->accessCheck(TRUE)
      ->range($args['offset'] ?? 0, $args['limit'] ?? 10);

    // Apply filters if provided.
    if (!empty($args['filter'])) {
      $this->applyFilters($query, $args['filter']);
    }

    // Apply sorting if provided.
    if (!empty($args['sort'])) {
      $this->applySorting($query, $args['sort']);
    }

    $result = $query->execute();
    
    if (empty($result)) {
      return [
        'edges' => [],
        'nodes' => [],
        'pageInfo' => [
          'hasNextPage' => FALSE,
          'hasPreviousPage' => FALSE,
          'startCursor' => '',
          'endCursor' => '',
        ],
      ];
    }

    $products = $this->entityTypeManager->getStorage('commerce_product')->loadMultiple($result);
    
    // Build connection response.
    $edges = [];
    $nodes = [];
    
    foreach ($products as $product) {
      $cursor = base64_encode('product:' . $product->id());
      $edges[] = [
        'cursor' => $cursor,
        'node' => $product,
      ];
      $nodes[] = $product;
    }
    
    return [
      'edges' => $edges,
      'nodes' => $nodes,
      'pageInfo' => [
        'hasNextPage' => count($result) >= ($args['limit'] ?? 10),
        'hasPreviousPage' => ($args['offset'] ?? 0) > 0,
        'startCursor' => !empty($edges) ? $edges[0]['cursor'] : '',
        'endCursor' => !empty($edges) ? $edges[count($edges) - 1]['cursor'] : '',
      ],
    ];
  }

  /**
   * Apply filters to the query.
   *
   * @param \Drupal\Core\Entity\Query\QueryInterface $query
   *   The query.
   * @param array $filter
   *   The filter conditions.
   */
  protected function applyFilters($query, array $filter) {
    foreach ($filter as $field => $condition) {
      if (is_array($condition)) {
        foreach ($condition as $operator => $value) {
          switch ($operator) {
            case 'eq':
              $query->condition($field, $value, '=');
              break;
            case 'neq':
              $query->condition($field, $value, '<>');
              break;
            case 'gt':
              $query->condition($field, $value, '>');
              break;
            case 'gte':
              $query->condition($field, $value, '>=');
              break;
            case 'lt':
              $query->condition($field, $value, '<');
              break;
            case 'lte':
              $query->condition($field, $value, '<=');
              break;
            case 'in':
              $query->condition($field, $value, 'IN');
              break;
            case 'nin':
              $query->condition($field, $value, 'NOT IN');
              break;
            case 'like':
              $query->condition($field, '%' . $value . '%', 'LIKE');
              break;
          }
        }
      }
      else {
        $query->condition($field, $condition);
      }
    }
  }

  /**
   * Apply sorting to the query.
   *
   * @param \Drupal\Core\Entity\Query\QueryInterface $query
   *   The query.
   * @param array $sort
   *   The sort conditions.
   */
  protected function applySorting($query, array $sort) {
    foreach ($sort as $field => $direction) {
      $query->sort($field, strtoupper($direction) === 'DESC' ? 'DESC' : 'ASC');
    }
  }

} 