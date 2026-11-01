<?php

namespace Drupal\app_commerce\Plugin\rest\resource;

use Drupal\commerce_novaposhta\Service\NovaposhtaManagerInterface;
use Drupal\rest\ModifiedResourceResponse;
use Drupal\rest\Plugin\ResourceBase;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

/**
 * Provides a resource for Novaposhta cities.
 *
 * @RestResource(
 *   id = "novaposhta_cities",
 *   label = @Translation("Novaposhta Cities"),
 *   uri_paths = {
 *     "canonical" = "/api/novaposhta/cities/{region}"
 *   }
 * )
 */
class NovaposhaCitiesResource extends ResourceBase {

  /**
   * The Novaposhta manager.
   *
   * @var \Drupal\commerce_novaposhta\Service\NovaposhtaManagerInterface
   */
  protected $novaposhtaManager;

  /**
   * Constructs a NovaposhaCitiesResource object.
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
   * @param string $region
   *   The region reference.
   *
   * @return \Drupal\rest\ModifiedResourceResponse
   *   The response containing the cities.
   */
  public function get($region) {
    if (empty($region)) {
      throw new BadRequestHttpException('Region parameter is required.');
    }

    $cities = $this->novaposhtaManager->getCities($region);
    $options = $this->novaposhtaManager->extractCityOptions($cities);

    return $this->createResponse([
      'cities' => $cities,
      'options' => $options,
    ]);
  }

}
