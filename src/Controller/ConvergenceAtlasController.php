<?php

namespace Drupal\convergence_atlas\Controller;

use Drupal\Core\Controller\ControllerBase;

/**
 * Controller for the Convergence Atlas route.
 */
class ConvergenceAtlasController extends ControllerBase {

  /**
   * Renders the article and interactive model inside the Forseti site.
   *
   * @return array
   *   The page render array.
   */
  public function page() {
    return [
      '#theme' => 'convergence_atlas_page',
      '#attached' => ['library' => ['convergence_atlas/article']],
    ];
  }

}
