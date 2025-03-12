<?php

namespace Drupal\app_core\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\graphql\GraphQL\Execution\ExecutorInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * Controller for handling GraphQL requests.
 */
class GraphQLController extends ControllerBase implements ContainerInjectionInterface {

  /**
   * The GraphQL executor service.
   *
   * @var \Drupal\graphql\GraphQL\Execution\ExecutorInterface
   */
  protected $executor;

  /**
   * Constructs a GraphQLController object.
   *
   * @param \Drupal\graphql\GraphQL\Execution\ExecutorInterface $executor
   *   The GraphQL executor service.
   */
  public function __construct(ExecutorInterface $executor) {
    $this->executor = $executor;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('graphql.executor')
    );
  }

  /**
   * Handles GraphQL requests.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *   The HTTP request.
   *
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   *   The JSON response.
   */
  public function handleRequest(Request $request) {
    // Get the request content.
    $content = json_decode($request->getContent(), TRUE);
    
    if (!$content || !isset($content['query'])) {
      return new JsonResponse(['errors' => [['message' => 'Invalid GraphQL request.']]], 400);
    }

    // Extract the query, variables, and operation name.
    $query = $content['query'];
    $variables = isset($content['variables']) ? $content['variables'] : NULL;
    $operation = isset($content['operationName']) ? $content['operationName'] : NULL;

    // Execute the query.
    $result = $this->executor->executeOperation('app_core', $operation, $query, $variables);

    // Return the result as JSON.
    return new JsonResponse($result->toArray());
  }

} 