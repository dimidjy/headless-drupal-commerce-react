<?php

namespace Drupal\app_core\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\graphql\Entity\ServerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use GraphQL\Server\OperationParams;

/**
 * Controller for handling GraphQL requests.
 */
class GraphQLController extends ControllerBase implements ContainerInjectionInterface {

  /**
   * The GraphQL server.
   *
   * @var \Drupal\graphql\Entity\ServerInterface
   */
  protected $server;

  /**
   * Constructs a GraphQLController object.
   *
   * @param \Drupal\graphql\Entity\ServerInterface $server
   *   The GraphQL server.
   */
  public function __construct(ServerInterface $server) {
    $this->server = $server;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    // Load the GraphQL server that uses the custom schema
    $entityTypeManager = $container->get('entity_type.manager');
    $serverStorage = $entityTypeManager->getStorage('graphql_server');
    
    // Try to find a server that uses our custom schema
    $servers = $serverStorage->loadMultiple();
    $customServer = null;
    
    foreach ($servers as $server) {
      if ($server->get('schema') === 'custom_schema') {
        $customServer = $server;
        break;
      }
    }
    
    // If no server uses our custom schema, fall back to the default server
    if (!$customServer) {
      $customServer = $serverStorage->load('graphql_compose_server');
      
      // If we're using the default server, log a warning
      \Drupal::logger('app_core')->warning('Using default GraphQL server instead of a server with custom_schema');
    }
    
    return new static($customServer);
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

    // Execute the query using the server's executeOperation method.
    $result = $this->server->executeOperation(
      OperationParams::create([
        'query' => $query,
        'variables' => $variables,
        'operationName' => $operation,
      ])
    );

    // Return the result as JSON.
    return new JsonResponse($result->toArray());
  }

} 