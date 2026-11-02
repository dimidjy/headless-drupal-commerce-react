<?php

/**
 * @file
 * A stand-in for the Nova Poshta JSON API, for CI.
 *
 * CI should not depend on a third-party server: from a GitHub runner the real
 * API is sometimes slow enough to time out. Serve this with PHP's built-in
 * server and point commerce_novaposhta.novaposhta:api_url at it:
 *
 *   php -S 127.0.0.1:8099 scripts/novaposhta_stub.php
 *
 * It answers the calls the shop makes (getAreas, getCities, getWarehouses,
 * getDocumentPrice) with a small, fixed data set in the API's own format.
 */

$request = json_decode(file_get_contents('php://input') ?: '{}', TRUE) ?: [];
$method = $request['calledMethod'] ?? '';
$properties = $request['methodProperties'] ?? [];

$areas = [
  ['Ref' => '71508129-9b87-11de-822f-000c2965ae0e', 'Description' => 'Вінницька', 'AreasCenter' => 'db5c88de-391c-11dd-90d9-001a92567626'],
  ['Ref' => '7150812a-9b87-11de-822f-000c2965ae0e', 'Description' => 'Волинська', 'AreasCenter' => 'db5c893b-391c-11dd-90d9-001a92567626'],
  ['Ref' => '7150812b-9b87-11de-822f-000c2965ae0e', 'Description' => 'Дніпропетровська', 'AreasCenter' => 'db5c88f0-391c-11dd-90d9-001a92567626'],
  ['Ref' => '7150812c-9b87-11de-822f-000c2965ae0e', 'Description' => 'Донецька', 'AreasCenter' => 'db5c88d0-391c-11dd-90d9-001a92567626'],
  ['Ref' => '7150812d-9b87-11de-822f-000c2965ae0e', 'Description' => 'Житомирська', 'AreasCenter' => 'db5c88c4-391c-11dd-90d9-001a92567626'],
  ['Ref' => '7150812e-9b87-11de-822f-000c2965ae0e', 'Description' => 'Закарпатська', 'AreasCenter' => 'e221d64c-391c-11dd-90d9-001a92567626'],
  ['Ref' => '7150812f-9b87-11de-822f-000c2965ae0e', 'Description' => 'Запорізька', 'AreasCenter' => 'db5c88c6-391c-11dd-90d9-001a92567626'],
  ['Ref' => '71508131-9b87-11de-822f-000c2965ae0e', 'Description' => 'Київська', 'AreasCenter' => '8d5a980d-391c-11dd-90d9-001a92567626'],
];

// Two cities per area, two branches per city; refs are derived so they stay stable.
$cities = [];
foreach ($areas as $a => $area) {
  foreach ([1, 2] as $n) {
    $cities[] = [
      'Ref' => sprintf('c1t%05d-0000-4000-8000-%012d', $a * 10 + $n, $a * 10 + $n),
      'Area' => $area['Ref'],
      'Description' => $area['Description'] . " місто $n",
      'DescriptionRu' => $area['Description'] . " город $n",
    ];
  }
}

$respond = function (array $data, bool $success = TRUE, array $errors = []): void {
  header('Content-Type: application/json');
  echo json_encode(['success' => $success, 'data' => $data, 'errors' => $errors, 'warnings' => [], 'info' => []], JSON_UNESCAPED_UNICODE);
};

switch ($method) {
  case 'getAreas':
    $respond($areas);
    break;

  case 'getCities':
    $respond($cities);
    break;

  case 'getWarehouses':
    $city = $properties['CityRef'] ?? '';
    $known = in_array($city, array_column($cities, 'Ref'), TRUE);
    $respond($known ? array_map(fn ($n) => [
      'Ref' => substr($city, 0, 30) . sprintf('%06d', $n),
      'Description' => "Відділення №$n",
      'DescriptionRu' => "Отделение №$n",
      'CityRef' => $city,
    ], [1, 2]) : []);
    break;

  case 'getDocumentPrice':
    $respond([['AssessedCost' => (float) ($properties['Cost'] ?? 0), 'Cost' => 80]]);
    break;

  default:
    $respond([], FALSE, ["Unknown method $method"]);
}
