<?php

namespace Drupal\app_core\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Config\ConfigFactoryInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Controller for providing page UUIDs for React app.
 */
class PageUuidController extends ControllerBase {

  /**
   * The config factory.
   *
   * @var \Drupal\Core\Config\ConfigFactoryInterface
   */
  protected $configFactory;

  /**
   * Constructs a PageUuidController object.
   *
   * @param \Drupal\Core\Config\ConfigFactoryInterface $config_factory
   *   The config factory.
   */
  public function __construct(ConfigFactoryInterface $config_factory) {
    $this->configFactory = $config_factory;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('config.factory')
    );
  }

  /**
   * Returns page UUIDs as JSON.
   *
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   *   The JSON response containing page UUIDs.
   */
  public function getPageUuids() {
    // Get the configuration.
    $config = $this->configFactory->get('app_core.page_uuids');
    
    // Prepare the response data.
    $response_data = [
      'required_pages' => [],
      'other_pages' => [],
    ];
    
    // Add required pages.
    $required_pages = $config->get('required_pages') ?: [];
    foreach ($required_pages as $key => $uuid) {
      if (!empty($uuid)) {
        $response_data['required_pages'][$key] = $uuid;
      }
    }
    
    // Add additional pages.
    $additional_pages = $config->get('additional_pages') ?: [];
    foreach ($additional_pages as $page) {
      if (!empty($page['machine_name']) && !empty($page['uuid'])) {
        $response_data['other_pages'][$page['machine_name']] = $page['uuid'];
      }
    }
    
    return new JsonResponse($response_data);
  }

} 