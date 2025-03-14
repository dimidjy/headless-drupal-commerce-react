<?php

namespace Drupal\app_core\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Url;

/**
 * Controller for the React app.
 */
class ReactAppController extends ControllerBase {

  /**
   * Renders the React app container.
   *
   * @return array
   *   The render array.
   */
  public function content() {
    // Create a container for the React app.
    $build = [
      '#type' => 'html_tag',
      '#tag' => 'div',
      '#attributes' => [
        'id' => 'react-app',
        'class' => ['react-app-container'],
      ],
    ];

    // Add the React app library.
    $build['#attached']['library'][] = 'app_core/react_app';
    
    // Add settings for the React app.
    $build['#attached']['drupalSettings']['appCore'] = [
      'graphqlEndpoint' => Url::fromRoute('app_core.graphql')->toString(),
      'pageUuidsEndpoint' => Url::fromRoute('app_core.page_uuids')->toString(),
      'csrfToken' => \Drupal::csrfToken()->get('app_core'),
    ];

    return $build;
  }

} 