<?php

namespace Drupal\app_commerce\Plugin\rest\resource;

use Drupal\commerce_novaposhta\Service\NovaposhtaManagerInterface;
use Drupal\rest\ModifiedResourceResponse;
use Drupal\rest\Plugin\ResourceBase;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides a resource for Novaposhta regions.
 *
 * @RestResource(
 *   id = "novaposhta_regions",
 *   label = @Translation("Novaposhta Regions"),
 *   uri_paths = {
 *     "canonical" = "/api/novaposhta/regions"
 *   }
 * )
 */
class NovaposhtaRegionsResource extends ResourceBase {

  /**
   * The Novaposhta manager.
   *
   * @var \Drupal\commerce_novaposhta\Service\NovaposhtaManagerInterface
   */
  protected $novaposhtaManager;

  /**
   * Constructs a NovaposhtaRegionsResource object.
   *
   * @param array $configuration
   *   A configuration array containing information about the plugin instance.
   * @param string $plugin_id
   *   The plugin_id for the plugin instance.
   * @param mixed $plugin_definition
   *   The plugin implementation definition.
   * @param array $serializer_formats
   *   The available serialization formats.
   * @param \Psr\Log\LoggerInterface $logger
   *   A logger instance.
   * @param \Drupal\commerce_novaposhta\Service\NovaposhtaManagerInterface $novaposhta_manager
   *   The Novaposhta manager.
   */
  public function __construct(
    array $configuration,
    $plugin_id,
    $plugin_definition,
    array $serializer_formats,
    LoggerInterface $logger,
    NovaposhtaManagerInterface $novaposhta_manager,
  ) {
    parent::__construct($configuration, $plugin_id, $plugin_definition, $serializer_formats, $logger);
    $this->novaposhtaManager = $novaposhta_manager;
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
      $container->get('logger.factory')->get('app_commerce'),
      $container->get('commerce.novaposhta.manager')
    );
  }

  /**
   * Create a successful response.
   *
   * @param mixed $data
   *   The response data.
   *
   * @return \Drupal\rest\ModifiedResourceResponse
   *   The response.
   */
  protected function createResponse($data) {
    return new ModifiedResourceResponse($data, 200);
  }

  /**
   * Responds to GET requests.
   *
   * @return \Drupal\rest\ModifiedResourceResponse
   *   The response containing the regions.
   */
  public function get() {
    $regions = $this->novaposhtaManager->getRegions();
    $options = $this->novaposhtaManager->extractRegionOptions($regions);

    return $this->createResponse([
      'regions' => $regions,
      'options' => $options,
    ]);
  }

}
