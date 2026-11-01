<?php

declare(strict_types=1);

namespace Drupal\app_demo\Drush\Commands;

use Drupal\app_demo\DemoContentGenerator;
use Drush\Attributes as CLI;
use Drush\Commands\DrushCommands;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Drush commands for the demo storefront content.
 */
final class AppDemoCommands extends DrushCommands {

  public function __construct(
    private readonly DemoContentGenerator $generator,
  ) {
    parent::__construct();
  }

  public static function create(ContainerInterface $container): self {
    return new self($container->get('app_demo.generator'));
  }

  /**
   * Generate the demo store, catalogue, homepage and menus.
   */
  #[CLI\Command(name: 'app-demo:generate', aliases: ['demo'])]
  #[CLI\Usage(name: 'drush app-demo:generate', description: 'Create demo content on a fresh install.')]
  public function generate(): int {
    if ($this->generator->exists()) {
      $this->logger()->warning('Demo homepage already exists; nothing to do.');
      return self::EXIT_SUCCESS;
    }
    foreach ($this->generator->generate() as $label => $count) {
      $this->logger()->success("Created {$count} {$label}.");
    }
    return self::EXIT_SUCCESS;
  }

}
