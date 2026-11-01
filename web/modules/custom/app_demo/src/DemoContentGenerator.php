<?php

declare(strict_types=1);

namespace Drupal\app_demo;

use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\File\FileExists;
use Drupal\Core\File\FileSystemInterface;
use Drupal\file\FileRepositoryInterface;

/**
 * Creates a self-contained demo catalogue and homepage for the storefront.
 *
 * Everything is generated locally: product photos are placeholder images
 * drawn with GD, so the demo ships no third-party assets. The demo video is
 * Big Buck Bunny (Blender Foundation, CC BY 3.0) embedded from YouTube.
 */
final class DemoContentGenerator {

  private const IMAGE_DIR = 'public://demo';

  private const PALETTE = [
    ['#e9d8c4', '#8c6a4f'],
    ['#d6e4e1', '#3f6b63'],
    ['#efe1d1', '#b0704a'],
    ['#dfe3ec', '#4b5a7a'],
    ['#f1e6e6', '#9b5c66'],
    ['#e5e8d8', '#6b7346'],
  ];

  private const CATEGORIES = ['Living room', 'Bedroom', 'Kitchen'];

  private const PRODUCTS = [
    ['Linen cushion cover', 'SOFT-CUSHION', '24.00', 0],
    ['Ceramic table lamp', 'LAMP-CERAMIC', '89.00', 0],
    ['Wool throw blanket', 'THROW-WOOL', '64.00', 1],
    ['Oak bedside table', 'TABLE-OAK', '149.00', 1],
    ['Stoneware dinner set', 'DINNER-SET', '119.00', 2],
    ['Glass carafe', 'CARAFE-GLASS', '29.00', 2],
  ];

  public function __construct(
    private readonly EntityTypeManagerInterface $entityTypeManager,
    private readonly ConfigFactoryInterface $configFactory,
    private readonly FileSystemInterface $fileSystem,
    private readonly FileRepositoryInterface $fileRepository,
  ) {}

  /**
   * Returns TRUE when the demo homepage already exists.
   */
  public function exists(): bool {
    $uuid = $this->homepageUuid();
    return $uuid !== '' && (bool) $this->entityTypeManager->getStorage('node')
      ->loadByProperties(['uuid' => $uuid]);
  }

  /**
   * Generates the demo content and returns a summary per entity type.
   *
   * @return array<string, int>
   *   Number of created entities keyed by label.
   */
  public function generate(): array {
    // The homepage is created first so it gets node ID 1, which is what
    // system.site:page.front points to; paragraphs are attached at the end.
    $homepage = $this->create('node', [
      'type' => 'page',
      'title' => 'Home',
      'uuid' => $this->homepageUuid() ?: NULL,
      // The React app resolves "/" through /path-to-uuid?path=/home.
      'path' => ['alias' => '/home'],
      'status' => 1,
    ]);

    $store = $this->createStore();
    // OrderShippingInfoResource assigns shipping method 1 to every shipment.
    $this->createShippingMethod($store);

    $categories = [];
    foreach (self::CATEGORIES as $i => $name) {
      $categories[] = $this->create('taxonomy_term', [
        'vid' => 'shop',
        'name' => $name,
        'field_shop_image' => $this->media($name, $i),
      ]);
    }

    $products = [];
    foreach (self::PRODUCTS as $i => [$title, $sku, $price]) {
      $image = $this->media($title, $i);
      $variation = $this->create('commerce_product_variation', [
        'type' => 'default',
        'sku' => $sku,
        'price' => ['number' => $price, 'currency_code' => 'USD'],
        'field_product_image' => $image,
        'status' => 1,
      ]);
      $products[] = $this->create('commerce_product', [
        'type' => 'default',
        'title' => $title,
        'stores' => [$store],
        'variations' => [$variation],
        'field_image' => $image,
        'body' => [
          'value' => "<p>{$title} from the demo catalogue. Prices and stock are sample data.</p>",
          'format' => 'basic_html',
        ],
        'status' => 1,
      ]);
    }

    $articles = [];
    foreach (['Styling a small living room', 'Five materials that age well', 'Setting the table for guests'] as $i => $title) {
      $articles[] = $this->create('node', [
        'type' => 'article',
        'title' => $title,
        'body' => ['value' => "<p>{$title}: a short demo article.</p>", 'format' => 'basic_html'],
        'field_image' => ['target_id' => $this->file($title, $i + 3)->id(), 'alt' => $title],
        'status' => 1,
      ]);
    }

    $homepage->set('field_paragraphs', $this->homepageParagraphs($categories, $products, $articles));
    $homepage->save();

    $this->createMenus();

    return [
      'stores' => 1,
      'categories' => count($categories),
      'products' => count($products),
      'articles' => count($articles),
      'homepage paragraphs' => count($homepage->get('field_paragraphs')),
    ];
  }

  /**
   * Builds the homepage: one paragraph of every type the storefront renders.
   */
  private function homepageParagraphs(array $categories, array $products, array $articles): array {
    $slides = [];
    foreach (['New season, calm colours', 'Made to be lived with'] as $i => $title) {
      $slides[] = $this->paragraph('billboard_slide', [
        'field_title' => $title,
        'field_description' => 'Demo slide generated by app_demo.',
        'field_image' => $this->media($title, $i, 1600, 700),
        'field_link' => ['uri' => 'internal:/products', 'title' => 'Shop now'],
      ]);
    }

    $features = [];
    foreach (['Free delivery', 'Easy returns', 'Secure payment'] as $i => $title) {
      $features[] = $this->paragraph('features_item', [
        'field_title' => $title,
        'field_description' => "{$title} on every demo order.",
        'field_feature_image' => $this->media($title, $i + 2, 160, 160),
      ]);
    }

    $testimonials = [];
    $quotes = [
      ['Olena', 'Fast delivery to my Nova Poshta branch.'],
      ['Max', 'The lamp looks even better at home.'],
      ['Iryna', 'Simple checkout, great quality.'],
    ];
    foreach ($quotes as [$author, $quote]) {
      $testimonials[] = $this->paragraph('testimonials_item', [
        'field_author' => $author,
        'field_response' => $quote,
      ]);
    }

    $paragraphs = [
      $this->paragraph('billboard', [
        'field_title' => 'Chic Nest',
        'field_description' => 'Headless Drupal Commerce demo store',
        'field_slides' => $slides,
      ]),
      $this->paragraph('categories', ['field_categories' => $categories]),
      $this->paragraph('products_slider', [
        'field_title' => 'Best sellers',
        'field_products_list' => $products,
      ]),
      $this->paragraph('features', ['field_items' => $features]),
      $this->paragraph('text_and_image', [
        'field_title' => 'Designed in Ukraine',
        'field_description' => 'Content on this page is managed with Drupal Paragraphs and rendered by React.',
        'field_image' => $this->media('Designed in Ukraine', 4, 1000, 800),
        'field_link' => ['uri' => 'internal:/products', 'title' => 'Browse the catalogue'],
      ]),
      $this->paragraph('testimonials', [
        'field_title' => 'What customers say',
        'field_testimonials' => $testimonials,
      ]),
      $this->paragraph('blog_posts', ['field_posts' => $articles]),
      $this->paragraph('logo_bar', ['field_image' => $this->media('Partner', 5, 400, 160)]),
      $this->paragraph('follow_us', [
        'field_title' => 'Follow us',
        'field_image' => $this->media('Follow us', 1, 600, 600),
      ]),
      $this->paragraph('webform', [
        'field_title' => 'Questions?',
        'field_description' => 'Send us a message.',
        'field_webform' => 'contact',
      ]),
    ];

    $video = $this->remoteVideo();
    if ($video) {
      array_splice($paragraphs, 5, 0, [$this->paragraph('video', ['field_video' => $video])]);
    }

    return $paragraphs;
  }

  /**
   * Creates the default online store.
   */
  private function createStore(): EntityInterface {
    $store = $this->create('commerce_store', [
      'type' => 'online',
      'name' => 'Chic Nest Demo',
      'mail' => 'shop@example.com',
      'default_currency' => 'USD',
      'timezone' => 'Europe/Kyiv',
      'address' => [
        'country_code' => 'UA',
        'locality' => 'Kyiv',
        'postal_code' => '01001',
        'address_line1' => 'Khreshchatyk St, 1',
      ],
    ]);
    $this->entityTypeManager->getStorage('commerce_store')->markAsDefault($store);
    return $store;
  }

  /**
   * Creates the Nova Poshta shipping method used by checkout.
   */
  private function createShippingMethod(EntityInterface $store): void {
    $rate = ['number' => '1', 'currency_code' => 'UAH'];
    $this->create('commerce_shipping_method', [
      'name' => 'Nova Poshta',
      'stores' => [$store],
      'plugin' => [
        'target_plugin_id' => 'novaposhta',
        'target_plugin_configuration' => [
          'options' => [
            'rate_type' => 'flat',
            'rate_amount' => ['Doors' => $rate, 'Warehouse' => $rate, 'Postomat' => $rate],
            'novaposhta' => NULL,
          ],
          'default_package_type' => 'custom_box',
          'services' => ['Doors', 'Warehouse', 'Postomat'],
          'workflow' => 'shipment_default',
        ],
      ],
      'status' => 1,
    ]);
  }

  /**
   * Adds storefront links to the main and footer menus.
   */
  private function createMenus(): void {
    $links = [
      'main' => ['Home' => '/', 'Shop' => '/products', 'Cart' => '/cart'],
      'footer' => ['Shop' => '/products', 'Cart' => '/cart'],
    ];
    foreach ($links as $menu => $items) {
      $weight = 0;
      foreach ($items as $title => $path) {
        $this->create('menu_link_content', [
          'menu_name' => $menu,
          'title' => $title,
          'link' => ['uri' => $path === '/' ? 'internal:/' : "internal:{$path}"],
          'weight' => $weight++,
        ]);
      }
    }
  }

  /**
   * Creates a remote video media item; skipped when oEmbed is unreachable.
   */
  private function remoteVideo(): ?EntityInterface {
    try {
      return $this->create('media', [
        'bundle' => 'remote_video',
        'name' => 'Big Buck Bunny (Blender Foundation, CC BY 3.0)',
        'field_media_oembed_video' => 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
      ]);
    }
    catch (\Throwable) {
      return NULL;
    }
  }

  /**
   * Creates a paragraph of the given type.
   */
  private function paragraph(string $type, array $values): EntityInterface {
    return $this->create('paragraph', ['type' => $type] + $values);
  }

  /**
   * Creates an image media entity with a generated placeholder.
   */
  private function media(string $label, int $color, int $width = 1200, int $height = 900): EntityInterface {
    return $this->create('media', [
      'bundle' => 'image',
      'name' => $label,
      'field_media_image' => [
        'target_id' => $this->file($label, $color, $width, $height)->id(),
        'alt' => $label,
      ],
    ]);
  }

  /**
   * Draws a text-free placeholder (two-tone backdrop with a round object).
   */
  private function file(string $label, int $color, int $width = 1200, int $height = 900): EntityInterface {
    [$background, $accent] = self::PALETTE[$color % count(self::PALETTE)];

    $image = imagecreatetruecolor($width, $height);
    imagefill($image, 0, 0, $this->allocate($image, $background));
    $accentColor = $this->allocate($image, $accent);
    // A "table" band along the bottom and an object resting on it.
    $horizon = intdiv($height * 2, 3);
    imagefilledrectangle($image, 0, $horizon, $width, $height, $accentColor);
    $diameter = (int) (min($width, $height) * 0.42);
    imagefilledellipse($image, intdiv($width, 2), $horizon - intdiv($diameter, 3), $diameter, $diameter, $accentColor);

    ob_start();
    imagejpeg($image, NULL, 85);
    $data = (string) ob_get_clean();

    $directory = self::IMAGE_DIR;
    $this->fileSystem->prepareDirectory($directory, FileSystemInterface::CREATE_DIRECTORY);
    $name = preg_replace('/[^a-z0-9]+/', '-', strtolower($label)) . "-{$width}x{$height}.jpg";
    return $this->fileRepository->writeData($data, "{$directory}/{$name}", FileExists::Replace);
  }

  /**
   * Allocates a colour from a hex string such as #e9d8c4.
   *
   * @param \GdImage $image
   *   The image to allocate the colour in.
   * @param string $hex
   *   The colour in #rrggbb notation.
   */
  private function allocate($image, string $hex): int {
    [$r, $g, $b] = sscanf($hex, '#%02x%02x%02x');
    return (int) imagecolorallocate($image, $r, $g, $b);
  }

  /**
   * Creates and saves an entity.
   */
  private function create(string $entityType, array $values): EntityInterface {
    $entity = $this->entityTypeManager->getStorage($entityType)->create($values);
    $entity->save();
    return $entity;
  }

  /**
   * Returns the homepage UUID configured in app_core.page_uuids.
   */
  private function homepageUuid(): string {
    return (string) $this->configFactory->get('app_core.page_uuids')->get('required_pages.homepage');
  }

}
