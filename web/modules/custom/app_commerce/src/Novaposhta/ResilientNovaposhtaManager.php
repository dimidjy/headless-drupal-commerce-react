<?php

namespace Drupal\app_commerce\Novaposhta;

use Drupal\commerce_novaposhta\Exception\NovaposhtaApiException;
use Drupal\commerce_novaposhta\Service\NovaposhtaManager;
use Drupal\Component\Serialization\Json;
use GuzzleHttp\Exception\GuzzleException;
use GuzzleHttp\RequestOptions;

/**
 * Nova Poshta manager that survives a slow or unreachable API.
 *
 * The contrib manager only catches RequestException, so a timeout or a
 * connection error (ConnectException) escapes and turns the shipping step
 * into an HTTP 500. Here every transport error is logged like an API error
 * and the call returns no data, with timeouts short enough for checkout.
 */
class ResilientNovaposhtaManager extends NovaposhtaManager {

  /**
   * Seconds to wait for the API before giving up.
   */
  const TIMEOUT = 10;

  /**
   * Seconds to wait for the connection itself.
   */
  const CONNECT_TIMEOUT = 5;

  /**
   * {@inheritdoc}
   */
  public function request(string $model, string $method, array $parameters = []): array {
    $data = [
      'apiKey' => $this->key,
      'modelName' => $model,
      'calledMethod' => $method,
      'language' => $this->getLanguage(),
    ];
    if ($parameters) {
      $data['methodProperties'] = $parameters;
    }

    // Allow other modules to alter request data.
    $this->moduleHandler->alter('commerce_novaposhta_request_data', $data);

    $result = [];
    try {
      $response = $this->httpClient->request('POST', $this->getApiUrl(), [
        RequestOptions::BODY => Json::encode($data),
        RequestOptions::HEADERS => ['Content-Type' => 'application/json'],
        RequestOptions::TIMEOUT => static::TIMEOUT,
        RequestOptions::CONNECT_TIMEOUT => static::CONNECT_TIMEOUT,
      ]);

      if ($response->getStatusCode() == 200) {
        $result = Json::decode($response->getBody()->getContents());
        if (!is_array($result)) {
          throw new NovaposhtaApiException('Nova Poshta API returned invalid JSON.');
        }

        // Allow other modules to alter result data.
        $this->moduleHandler->alter('commerce_novaposhta_result_data', $result, $data);

        if (!empty($result['errors'])) {
          throw new NovaposhtaApiException(reset($result['errors']));
        }
      }
    }
    catch (GuzzleException | NovaposhtaApiException $e) {
      $this->logger->error('Nova Poshta @model.@method failed: @message', [
        '@model' => $model,
        '@method' => $method,
        '@message' => $e->getMessage(),
      ]);
      return [];
    }

    return !empty($result['success']) ? $result : [];
  }

}
