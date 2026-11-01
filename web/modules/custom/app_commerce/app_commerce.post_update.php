<?php

/**
 * @file
 * Post update functions for App Commerce.
 */

/**
 * Ensures the cart clear resource configuration is present.
 */
function app_commerce_post_update_install_cart_clear_resource() {
  // No-op: the REST resource configuration ships in config/install.
}

/**
 * Ensures the cart coupons resource configuration is present.
 */
function app_commerce_post_update_install_cart_coupons_resource() {
  // No-op: the REST resource configuration ships in config/install.
}
