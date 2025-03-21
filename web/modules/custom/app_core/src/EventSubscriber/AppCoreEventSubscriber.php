<?php

namespace Drupal\app_core\EventSubscriber;

use Drupal\Core\Logger\LoggerChannelFactoryInterface;
use Drupal\Core\Session\AccountInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;

/**
 * Event subscriber to handle HTTP method requests.
 */
class AppCoreEventSubscriber implements EventSubscriberInterface {

  /**
   * The current user.
   *
   * @var \Drupal\Core\Session\AccountInterface
   */
  protected $currentUser;

  /**
   * The logger channel factory.
   *
   * @var \Drupal\Core\Logger\LoggerChannelFactoryInterface
   */
  protected $loggerFactory;

  /**
   * Constructs a new AppCoreEventSubscriber object.
   *
   * @param \Drupal\Core\Session\AccountInterface $current_user
   *   The current user.
   * @param \Drupal\Core\Logger\LoggerChannelFactoryInterface $logger_factory
   *   The logger channel factory.
   */
  public function __construct(
    AccountInterface $current_user,
    LoggerChannelFactoryInterface $logger_factory = NULL
  ) {
    $this->currentUser = $current_user;
    $this->loggerFactory = $logger_factory;
  }

  /**
   * Handles HTTP request method override for requests that can't use DELETE directly.
   *
   * @param \Symfony\Component\HttpKernel\Event\RequestEvent $event
   *   The request event.
   */
  public function onKernelRequest(RequestEvent $event) {
    $request = $event->getRequest();
    
    // Log the request method and URI for troubleshooting
    if ($this->loggerFactory) {
      $logger = $this->loggerFactory->get('app_core');
      $logger->notice('Request method: @method, URI: @uri', [
        '@method' => $request->getMethod(),
        '@uri' => $request->getRequestUri(),
      ]);
      
      // Log headers for debugging
      $headers = [];
      foreach ($request->headers->all() as $key => $value) {
        $headers[$key] = is_array($value) ? implode(', ', $value) : $value;
      }
      $logger->notice('Request headers: @headers', [
        '@headers' => print_r($headers, TRUE),
      ]);
    }
    
    // Check for X-HTTP-Method-Override header.
    if ($request->headers->has('X-HTTP-Method-Override')) {
      $method = $request->headers->get('X-HTTP-Method-Override');
      $request->setMethod($method);
      
      if ($this->loggerFactory) {
        $logger = $this->loggerFactory->get('app_core');
        $logger->notice('Method overridden by header to: @method', [
          '@method' => $method,
        ]);
      }
    }
    
    // Check for _method query parameter.
    if ($request->query->has('_method')) {
      $method = strtoupper($request->query->get('_method'));
      $request->setMethod($method);
      
      if ($this->loggerFactory) {
        $logger = $this->loggerFactory->get('app_core');
        $logger->notice('Method overridden by query parameter to: @method', [
          '@method' => $method,
        ]);
      }
    }
    
    // Check for POST requests with _method form parameter.
    if ($request->isMethod('POST') && $request->request->has('_method')) {
      $method = strtoupper($request->request->get('_method'));
      $request->setMethod($method);
      
      if ($this->loggerFactory) {
        $logger = $this->loggerFactory->get('app_core');
        $logger->notice('Method overridden by form parameter to: @method', [
          '@method' => $method,
        ]);
      }
    }
  }

  /**
   * {@inheritdoc}
   */
  public static function getSubscribedEvents() {
    $events[KernelEvents::REQUEST][] = ['onKernelRequest', 100];
    return $events;
  }

} 