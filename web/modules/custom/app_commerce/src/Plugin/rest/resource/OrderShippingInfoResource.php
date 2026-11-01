<?php

namespace Drupal\app_commerce\Plugin\rest\resource;

use Drupal\commerce_cart\CartProviderInterface;
use Drupal\commerce_order\Entity\OrderInterface;
use Drupal\commerce_shipping\Entity\Shipment;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\profile\Entity\Profile;
use Drupal\rest\ModifiedResourceResponse;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Provides a resource for saving shipping information to an order.
 *
 * @RestResource(
 *   id = "commerce_order_shipping_info",
 *   label = @Translation("Order shipping information"),
 *   uri_paths = {
 *     "create" = "/api/commerce/order/shipping-info"
 *   }
 * )
 */
class OrderShippingInfoResource extends CartResourceBase {

  /**
   * The entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * The current user.
   *
   * @var \Drupal\Core\Session\AccountInterface
   */
  protected $currentUser;

  /**
   * Constructs a new OrderShippingInfoResource object.
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
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager.
   * @param \Drupal\Core\Session\AccountInterface $current_user
   *   The current user.
   * @param \Drupal\commerce_cart\CartProviderInterface $cart_provider
   *   The cart provider.
   * @param \Drupal\commerce_cart\CartManagerInterface $cart_manager
   *   The cart manager.
   */
  public function __construct(
    array $configuration,
    $plugin_id,
    $plugin_definition,
    array $serializer_formats,
    LoggerInterface $logger,
    EntityTypeManagerInterface $entity_type_manager,
    AccountInterface $current_user,
    CartProviderInterface $cart_provider,
    $cart_manager,
  ) {
    parent::__construct($configuration, $plugin_id, $plugin_definition, $serializer_formats, $logger, $cart_provider, $cart_manager);
    $this->entityTypeManager = $entity_type_manager;
    $this->currentUser = $current_user;
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
      $container->get('entity_type.manager'),
      $container->get('current_user'),
      $container->get('commerce_cart.cart_provider'),
      $container->get('commerce_cart.cart_manager')
    );
  }

  /**
   * Saves shipping information to an order.
   *
   * @param array $data
   *   The unserialized request body.
   * @param \Symfony\Component\HttpFoundation\Request $request
   *   The request.
   *
   * @return \Drupal\rest\ModifiedResourceResponse
   *   The HTTP response object.
   *
   * @throws \Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException
   * @throws \Drupal\Component\Plugin\Exception\PluginNotFoundException
   * @throws \Drupal\Core\Entity\EntityStorageException
   */
  public function post(array $data, Request $request) {
    // Validate required data.
    if (empty($data['order_id']) && empty($data['cart_id'])) {
      throw new BadRequestHttpException('Either order_id or cart_id must be provided.');
    }

    // Load the order from the provided id or from the current cart.
    $order = NULL;
    if (!empty($data['order_id'])) {
      $order_storage = $this->entityTypeManager->getStorage('commerce_order');
      $order = $order_storage->load($data['order_id']);
    }
    elseif (!empty($data['cart_id'])) {
      $order_storage = $this->entityTypeManager->getStorage('commerce_order');
      $order = $order_storage->load($data['cart_id']);
    }
    else {
      // Get the current cart if no order_id was provided.
      $carts = $this->cartProvider->getCarts();
      if (!empty($carts)) {
        $order = reset($carts);
      }
    }

    if (!$order instanceof OrderInterface) {
      throw new NotFoundHttpException('Order not found.');
    }

    // Only save email to order, other customer information will be in profile.
    if (!empty($data['email'])) {
      $order->setEmail($data['email']);
    }

    $address_data = [
    // Ukraine.
      'country_code' => 'UA',
      'given_name' => !empty($data['firstName']) ? $data['firstName'] : '',
      'additional_name' => !empty($data['lastName']) ? $data['lastName'] : '',
      'family_name' => !empty($data['lastName']) ? $data['lastName'] : '',
      'locality' => !empty($data['novaposhtaCity']) ? $data['novaposhtaCity'] : '',
      'address_line1' => !empty($data['novaposhtaWarehouse']) ? $data['novaposhtaWarehouse'] : '',
      'administrative_area' => !empty($data['novaposhtaRegion']) ? $data['novaposhtaRegion'] : '',
    ];

    // Prepare Novaposhta field data.
    $novaposhta_data = [
      'region' => !empty($data['novaposhtaRegion']) ? $data['novaposhtaRegion'] : '',
      'city' => !empty($data['novaposhtaCity']) ? $data['novaposhtaCity'] : '',
      'warehouse' => !empty($data['novaposhtaWarehouse']) ? $data['novaposhtaWarehouse'] : '',
      'region_data' => !empty($data['novaposhtaRegionData']) ? $data['novaposhtaRegionData'] : [],
      'city_data' => !empty($data['novaposhtaCityData']) ? $data['novaposhtaCityData'] : [],
      'warehouse_data' => !empty($data['novaposhtaWarehouseData']) ? $data['novaposhtaWarehouseData'] : [],
    ];

    // Create a shipping profile.
    $shipping_profile = Profile::create([
      'type' => 'customer',
      'uid' => $order->getCustomerId(),
      'address' => $address_data,
      'address_novaposhta' => $novaposhta_data,
    ]);

    $shipping_profile->save();

    // Create a shipment for the order.
    $shipment = Shipment::create([
      'type' => 'default',
      'order_id' => $order->id(),
      'shipping_profile' => $shipping_profile,
      'shipping_method' => '1',
      'shipping_service' => 'default',
    // This should be dynamic based on the chosen shipping method.
      'amount' => ['number' => '0', 'currency_code' => 'USD'],
    ]);
    $shipment->save();

    // Mark checkout step as complete.
    $order->set('checkout_step', 'shipping');

    // Save the order.
    $order->save();

    // Return the updated order data.
    $response_data = [
      'order_id' => $order->id(),
      'status' => 'success',
      'message' => 'Shipping information saved successfully.',
    ];

    return new ModifiedResourceResponse($response_data, 200);
  }

}
