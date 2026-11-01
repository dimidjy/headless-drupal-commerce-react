<?php

namespace Drupal\app_commerce\Plugin\rest\resource;

use Drupal\commerce_payment\PaymentGatewayManager;
use Drupal\commerce_store\CurrentStoreInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\rest\Plugin\ResourceBase;
use Drupal\rest\ResourceResponse;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides a resource for getting available payment gateways.
 *
 * @RestResource(
 *   id = "commerce_payment_gateways",
 *   label = @Translation("Available payment gateways"),
 *   uri_paths = {
 *     "canonical" = "/commerce/payment-gateways"
 *   }
 * )
 */
class PaymentGatewaysResource extends ResourceBase {

  /**
   * The entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * The payment gateway manager.
   *
   * @var \Drupal\commerce_payment\PaymentGatewayManager
   */
  protected $paymentGatewayManager;

  /**
   * The current store.
   *
   * @var \Drupal\commerce_store\CurrentStoreInterface
   */
  protected $currentStore;

  /**
   * Constructs a new PaymentGatewaysResource object.
   *
   * @param array $configuration
   *   A configuration array containing information about the plugin instance.
   * @param string $plugin_id
   *   The plugin ID for the plugin instance.
   * @param mixed $plugin_definition
   *   The plugin implementation definition.
   * @param array $serializer_formats
   *   The available serialization formats.
   * @param \Psr\Log\LoggerInterface $logger
   *   A logger instance.
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager.
   * @param \Drupal\commerce_payment\PaymentGatewayManager $payment_gateway_manager
   *   The payment gateway manager.
   * @param \Drupal\commerce_store\CurrentStoreInterface $current_store
   *   The current store.
   */
  public function __construct(
    array $configuration,
    $plugin_id,
    $plugin_definition,
    array $serializer_formats,
    LoggerInterface $logger,
    EntityTypeManagerInterface $entity_type_manager,
    PaymentGatewayManager $payment_gateway_manager,
    CurrentStoreInterface $current_store,
  ) {
    parent::__construct($configuration, $plugin_id, $plugin_definition, $serializer_formats, $logger);
    $this->entityTypeManager = $entity_type_manager;
    $this->paymentGatewayManager = $payment_gateway_manager;
    $this->currentStore = $current_store;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->getParameter('serializer.formats'),
      $container->get('logger.factory')->get('rest'),
      $container->get('entity_type.manager'),
      $container->get('plugin.manager.commerce_payment_gateway'),
      $container->get('commerce_store.current_store')
    );
  }

  /**
   * Responds to GET requests.
   *
   * Returns a list of available payment gateways for the current store.
   *
   * @return \Drupal\rest\ResourceResponse
   *   The response containing a list of payment gateways.
   */
  public function get() {
    // Get the current store.
    $store = $this->currentStore->getStore();

    // Get all payment gateways.
    $payment_gateway_storage = $this->entityTypeManager->getStorage('commerce_payment_gateway');
    $payment_gateways = $payment_gateway_storage->loadMultiple();

    $available_gateways = [];

    foreach ($payment_gateways as $gateway) {
      // Only include gateways that are enabled.
      // We can't use $gateway->applies() directly with a store, as it requires an order.
      if ($gateway->status()) {
        $gateway_data = [
          'id' => $gateway->id(),
          'plugin_id' => $gateway->getPluginId(),
          'label' => $gateway->label(),
          'configuration' => $gateway->getPlugin()->getConfiguration(),
        ];

        $available_gateways[] = $gateway_data;
      }
    }

    $response = new ResourceResponse($available_gateways);
    $response->getCacheableMetadata()->addCacheContexts(['store']);

    return $response;
  }

  /**
   * {@inheritdoc}
   */
  public function permissions() {
    return [
      'access commerce payment gateways resource' => [
        'title' => $this->t('Access payment gateways resource'),
        'description' => $this->t('Get a list of available payment gateways for the current store.'),
      ],
    ];
  }

  /**
   * {@inheritdoc}
   */
  protected function getBaseRouteRequirements($method) {
    $requirements = parent::getBaseRouteRequirements($method);

    // Add custom access check for store API.
    $requirements['_permission'] = 'access commerce payment gateways resource';

    return $requirements;
  }

}
