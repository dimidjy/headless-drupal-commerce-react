<?php

namespace Drupal\app_core\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Configuration form for page UUIDs.
 */
class FrontPagesConfigForm extends ConfigFormBase {

  /**
   * The entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * Constructs a PageUuidConfigForm object.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager.
   */
  public function __construct(EntityTypeManagerInterface $entity_type_manager) {
    $this->entityTypeManager = $entity_type_manager;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('entity_type.manager')
    );
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return ['app_core.page_uuids'];
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'app_core_page_uuid_config_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config('app_core.page_uuids');

    // Get node titles for autocomplete.
    $node_storage = $this->entityTypeManager->getStorage('node');
    
    // Required pages section.
    $form['required_pages'] = [
      '#type' => 'details',
      '#title' => $this->t('Required pages'),
      '#open' => TRUE,
    ];
    
    $required_pages = [
      'homepage' => $this->t('Homepage'),
      'catalog' => $this->t('Catalog'),
      'about_us' => $this->t('About us'),
      'contact_page' => $this->t('Contact page'),
      'blog' => $this->t('Blog'),
    ];
    
    foreach ($required_pages as $key => $label) {
      $form['required_pages'][$key] = [
        '#type' => 'entity_autocomplete',
        '#title' => $label,
        '#target_type' => 'node',
        '#default_value' => $this->getNodeFromUuid($config->get("required_pages.$key")),
        '#description' => $this->t('Select the @page page.', ['@page' => $label]),
      ];
    }
    
    // Additional pages section.
    $form['additional_pages'] = [
      '#type' => 'details',
      '#title' => $this->t('Additional pages'),
      '#open' => TRUE,
    ];
    
    $additional_pages = $config->get('additional_pages') ?: [];
    
    // Container for additional pages.
    $form['additional_pages']['container'] = [
      '#type' => 'container',
      '#attributes' => ['id' => 'additional-pages-container'],
      '#tree' => TRUE,
    ];
    
    // Add existing additional pages.
    $page_count = $form_state->get('page_count');
    if ($page_count === NULL) {
      $page_count = count($additional_pages) > 0 ? count($additional_pages) : 1;
      $form_state->set('page_count', $page_count);
    }
    
    for ($i = 0; $i < $page_count; $i++) {
      $form['additional_pages']['container'][$i] = [
        '#type' => 'container',
        '#attributes' => ['class' => ['container-inline', 'additional-page-row']],
      ];
      
      $form['additional_pages']['container'][$i]['machine_name'] = [
        '#type' => 'textfield',
        '#title' => $this->t('Machine name'),
        '#size' => 30,
        '#default_value' => isset($additional_pages[$i]['machine_name']) ? $additional_pages[$i]['machine_name'] : '',
        '#description' => $this->t('Machine name for the page (e.g., "news", "products").'),
      ];
      
      $form['additional_pages']['container'][$i]['title'] = [
        '#type' => 'textfield',
        '#title' => $this->t('Title'),
        '#size' => 30,
        '#default_value' => isset($additional_pages[$i]['title']) ? $additional_pages[$i]['title'] : '',
        '#description' => $this->t('Human-readable title for the page.'),
      ];
      
      $form['additional_pages']['container'][$i]['page'] = [
        '#type' => 'entity_autocomplete',
        '#title' => $this->t('Page'),
        '#target_type' => 'node',
        '#default_value' => $this->getNodeFromUuid(isset($additional_pages[$i]['uuid']) ? $additional_pages[$i]['uuid'] : NULL),
        '#description' => $this->t('Select a page.'),
      ];
    }
    
    // Add more button.
    $form['additional_pages']['add_more'] = [
      '#type' => 'submit',
      '#value' => $this->t('Add another page'),
      '#submit' => ['::addMoreSubmit'],
      '#ajax' => [
        'callback' => '::addMoreCallback',
        'wrapper' => 'additional-pages-container',
      ],
    ];
    
    return parent::buildForm($form, $form_state);
  }
  
  /**
   * Ajax callback for the "Add another page" button.
   */
  public function addMoreCallback(array &$form, FormStateInterface $form_state) {
    return $form['additional_pages']['container'];
  }
  
  /**
   * Submit handler for the "Add another page" button.
   */
  public function addMoreSubmit(array &$form, FormStateInterface $form_state) {
    $page_count = $form_state->get('page_count');
    $form_state->set('page_count', $page_count + 1);
    $form_state->setRebuild();
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    // Validate machine names for additional pages.
    $additional_pages = $form_state->getValue(['additional_pages', 'container']);
    $machine_names = [];
    
    foreach ($additional_pages as $delta => $page) {
      if (!empty($page['machine_name'])) {
        // Check for valid machine name format.
        if (!preg_match('/^[a-z0-9_]+$/', $page['machine_name'])) {
          $form_state->setError(
            $form['additional_pages']['container'][$delta]['machine_name'],
            $this->t('Machine name must contain only lowercase letters, numbers, and underscores.')
          );
        }
        
        // Check for duplicate machine names.
        if (in_array($page['machine_name'], $machine_names)) {
          $form_state->setError(
            $form['additional_pages']['container'][$delta]['machine_name'],
            $this->t('Machine name must be unique.')
          );
        }
        
        $machine_names[] = $page['machine_name'];
      }
    }
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $config = $this->config('app_core.page_uuids');
    
    // Save required pages.
    $required_pages = [];
    foreach (['homepage', 'catalog', 'about_us', 'contact_page', 'blog'] as $key) {
      $node_id = $form_state->getValue($key);
      $required_pages[$key] = $node_id ? $this->getUuidFromNodeId($node_id) : '';
    }
    $config->set('required_pages', $required_pages);
    
    // Save additional pages.
    $additional_pages = [];
    $pages = $form_state->getValue(['additional_pages', 'container']);
    
    foreach ($pages as $page) {
      if (!empty($page['machine_name']) && !empty($page['page'])) {
        $additional_pages[] = [
          'machine_name' => $page['machine_name'],
          'title' => $page['title'],
          'uuid' => $this->getUuidFromNodeId($page['page']),
        ];
      }
    }
    
    $config->set('additional_pages', $additional_pages);
    $config->save();
    
    parent::submitForm($form, $form_state);
  }
  
  /**
   * Gets a node entity from a UUID.
   *
   * @param string|null $uuid
   *   The UUID of the node.
   *
   * @return \Drupal\node\NodeInterface|null
   *   The node entity or NULL if not found.
   */
  protected function getNodeFromUuid($uuid) {
    if (empty($uuid)) {
      return NULL;
    }
    
    $nodes = $this->entityTypeManager->getStorage('node')->loadByProperties(['uuid' => $uuid]);
    return $nodes ? reset($nodes) : NULL;
  }
  
  /**
   * Gets the UUID from a node ID.
   *
   * @param int $nid
   *   The node ID.
   *
   * @return string
   *   The UUID of the node.
   */
  protected function getUuidFromNodeId($nid) {
    $node = $this->entityTypeManager->getStorage('node')->load($nid);
    return $node ? $node->uuid() : '';
  }

}