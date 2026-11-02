<?php

/**
 * @file
 * Checks that an unreachable Nova Poshta API fails fast and quietly.
 *
 * Run with: ddev drush php:script scripts/novaposhta_timeout_check.php
 *
 * 10.255.255.1 is not routable, so the connection hangs like a dead API.
 * The manager must give up after its connect timeout and return no data
 * instead of throwing, which used to turn the shipping step into a 500.
 */

use Drupal\app_commerce\Novaposhta\ResilientNovaposhtaManager;

$manager = \Drupal::service('commerce.novaposhta.manager');
if (!$manager instanceof ResilientNovaposhtaManager) {
  throw new RuntimeException('commerce.novaposhta.manager is ' . get_class($manager) . ', expected ResilientNovaposhtaManager.');
}

$manager->setApiUrl('http://10.255.255.1/v2.0/json/');
$started = microtime(TRUE);
$result = $manager->request('Address', 'getAreas');
$seconds = microtime(TRUE) - $started;

if ($result !== []) {
  throw new RuntimeException('Expected no data from an unreachable API.');
}
if ($seconds > ResilientNovaposhtaManager::TIMEOUT + 2) {
  throw new RuntimeException(sprintf('Gave up after %.1fs, expected about %ds.', $seconds, ResilientNovaposhtaManager::CONNECT_TIMEOUT));
}

printf("ok    unreachable Nova Poshta API: no data after %.1fs, no exception\n", $seconds);
