<?php

// Translations
class Jetpack_JSON_API_Translations_Endpoint extends Jetpack_JSON_API_Endpoint {
	// GET /sites/%s/translations
	// POST /sites/%s/translations/update
	protected $needed_capabilities = array( 'update_core', 'update_plugins', 'update_themes' );
	protected $log;

	public function result() {
		error_log( 'show resulsts...' );
		return array(
			'translations' => wp_get_translation_updates(),
			'autoupdate' => Jetpack_Options::get_option( 'autoupdate_translations', false ),
			'log'        => $this->log,
		);
	}
}

