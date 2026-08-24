<?php

/**
 * Plugin Name: TOI CMS API
 * Plugin URI: https://iamkolkata.co.in
 * Description: Gold CMS API.
 * Version: 1.0
 * Author: iamkolkata
 * Author URI: https://iamkolkata.co.in
 * */
require_once plugin_dir_path(__FILE__) . 'inc/cmsgoldapitoi-functions.php';

function iamkolkata_video_api_assets() {
    wp_enqueue_script('slike', 'https://tvid.in/sdk/loader.js',array('jquery'), '', true);
//    wp_enqueue_script('toi', WP_PLUGIN_URL . '/toi-cms-api/assets/script.js', array('jquery'), '', true);
}

add_action('wp_enqueue_scripts', 'iamkolkata_video_api_assets');

function custom_cron_endpoint_callback() {
    // Your code to be executed by the cron job goes here
    $apiserver = 'https://cmsgold.timesgroup.com/api/v1';
    $apichannel = '6492e9bc51e7b4d201f6ca7e';

    getCategoriesAndSyncWithWordpress($apiserver, $apichannel);
    getSubCategoriesAndSyncWithWordpress($apiserver, $apichannel);
    getPostsToWordpress($apiserver, $apichannel);

    // It's good practice to log the activity for debugging purposes
    error_log('Cron job executed successfully.');

    // Return a response (optional)
    return rest_ensure_response(array('message' => 'Cron job executed successfully.'));
}

add_action('rest_api_init', function () {
    register_rest_route('timesgroup', '/sync', array(
        'methods' => 'GET',
        'callback' => 'custom_cron_endpoint_callback',
    ));
});

/**
 * articles_only
 * @since 1.0.0
 * @param \WP_Query $query The WordPress query instance.
 */
function articles_only_query($query) {

    // Get current meta Query
    $meta_query = $query->get('meta_query');

    // If there is no meta query when this filter runs, it should be initialized as an empty array.
    if (!$meta_query) {
        $meta_query = [];
    }

    // Append our meta query
    $meta_query[] = [
        'key' => 'slike_id',
        'value' => '',
        'compare' => '=',
    ];

    $query->set('meta_query', $meta_query);
}

add_action('elementor/query/articles_only', 'articles_only_query');

/**
 * videos_only
 * @since 1.0.0
 * @param \WP_Query $query The WordPress query instance.
 */
function videos_only_query($query) {

    // Get current meta Query
    $meta_query = $query->get('meta_query');

    // If there is no meta query when this filter runs, it should be initialized as an empty array.
    if (!$meta_query) {
        $meta_query = [];
    }

    // Append our meta query
    $meta_query[] = [
        'key' => 'slike_id',
        'value' => '',
        'compare' => '!=',
    ];

    $query->set('meta_query', $meta_query);
}

add_action('elementor/query/videos_only', 'videos_only_query');