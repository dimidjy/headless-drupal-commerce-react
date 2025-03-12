<?php

namespace Drupal\app_core\GraphQL\Resolver;

use Drupal\commerce_cart\CartManagerInterface;
use Drupal\commerce_cart\CartProviderInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\graphql\GraphQL\Resolver\ResolverInterface;

/**
 * Resolver for Commerce Cart operations.
 */
class CommerceCartResolver implements ResolverInterface {

  /**
   * The entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * The cart provider.
   *
   * @var \Drupal\commerce_cart\CartProviderInterface
   */
  protected $cartProvider;

  /**
   * The cart manager.
   *
   * @var \Drupal\commerce_cart\CartManagerInterface
   */
  protected $cartManager;

  /**
   * Constructs a CommerceCartResolver object.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager.
   * @param \Drupal\commerce_cart\CartProviderInterface $cart_provider
   *   The cart provider.
   * @param \Drupal\commerce_cart\CartManagerInterface $cart_manager
   *   The cart manager.
   */
  public function __construct(
    EntityTypeManagerInterface $entity_type_manager,
    CartProviderInterface $cart_provider,
    CartManagerInterface $cart_manager
  ) {
    $this->entityTypeManager = $entity_type_manager;
    $this->cartProvider = $cart_provider;
    $this->cartManager = $cart_manager;
  }

  /**
   * Resolves the current cart.
   *
   * @param mixed $value
   *   The parent value.
   * @param array $args
   *   The arguments.
   *
   * @return \Drupal\commerce_order\Entity\OrderInterface|null
   *   The cart order or NULL if not found.
   */
  public function resolveCart($value, array $args) {
    $carts = $this->cartProvider->getCarts();
    return !empty($carts) ? reset($carts) : NULL;
  }

  /**
   * Adds an item to the cart.
   *
   * @param mixed $value
   *   The parent value.
   * @param array $args
   *   The arguments.
   *
   * @return array
   *   The response with cart and errors.
   */
  public function addToCart($value, array $args) {
    $response = [
      'cart' => NULL,
      'errors' => [],
    ];

    try {
      // Load the product variation.
      $variation = $this->entityTypeManager->getStorage('commerce_product_variation')
        ->load($args['productVariationId']);

      if (!$variation) {
        $response['errors'][] = 'Product variation not found.';
        return $response;
      }

      // Get the store.
      $stores = $variation->getProduct()->getStores();
      if (empty($stores)) {
        $response['errors'][] = 'No stores available for this product.';
        return $response;
      }
      $store = reset($stores);

      // Get or create the cart.
      $cart = $this->cartProvider->getCart('default', $store);
      if (!$cart) {
        $cart = $this->cartProvider->createCart('default', $store);
      }

      // Add the item to the cart.
      $quantity = isset($args['quantity']) ? $args['quantity'] : 1;
      $this->cartManager->addEntity($cart, $variation, $quantity);

      $response['cart'] = $cart;
    }
    catch (\Exception $e) {
      $response['errors'][] = $e->getMessage();
    }

    return $response;
  }

  /**
   * Updates a cart item.
   *
   * @param mixed $value
   *   The parent value.
   * @param array $args
   *   The arguments.
   *
   * @return array
   *   The response with cart and errors.
   */
  public function updateCartItem($value, array $args) {
    $response = [
      'cart' => NULL,
      'errors' => [],
    ];

    try {
      // Load the order item.
      $order_item = $this->entityTypeManager->getStorage('commerce_order_item')
        ->load($args['orderItemId']);

      if (!$order_item) {
        $response['errors'][] = 'Order item not found.';
        return $response;
      }

      // Get the cart.
      $cart = $order_item->getOrder();
      if (!$cart) {
        $response['errors'][] = 'Cart not found.';
        return $response;
      }

      // Update the quantity.
      $order_item->setQuantity($args['quantity']);
      $order_item->save();
      $this->cartManager->updateOrderItem($cart, $order_item);

      $response['cart'] = $cart;
    }
    catch (\Exception $e) {
      $response['errors'][] = $e->getMessage();
    }

    return $response;
  }

  /**
   * Removes a cart item.
   *
   * @param mixed $value
   *   The parent value.
   * @param array $args
   *   The arguments.
   *
   * @return array
   *   The response with cart and errors.
   */
  public function removeCartItem($value, array $args) {
    $response = [
      'cart' => NULL,
      'errors' => [],
    ];

    try {
      // Load the order item.
      $order_item = $this->entityTypeManager->getStorage('commerce_order_item')
        ->load($args['orderItemId']);

      if (!$order_item) {
        $response['errors'][] = 'Order item not found.';
        return $response;
      }

      // Get the cart.
      $cart = $order_item->getOrder();
      if (!$cart) {
        $response['errors'][] = 'Cart not found.';
        return $response;
      }

      // Remove the item from the cart.
      $this->cartManager->removeOrderItem($cart, $order_item);

      $response['cart'] = $cart;
    }
    catch (\Exception $e) {
      $response['errors'][] = $e->getMessage();
    }

    return $response;
  }

} 