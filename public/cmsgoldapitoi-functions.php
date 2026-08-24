<?php
// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
    exit; // Prevent direct access
}
// Assuming you have the REST API endpoint URL and pagination parameters
$apiserver = 'https://cmsgold.timesgroup.com/api/v1';
$apichannel = '6492e9bc51e7b4d201f6ca7e';

function pr($pre) {
    echo "<pre>";
    print_r($pre);
    echo "</pre>";
//    die('dd');
}

function getCategoriesAndSyncWithWordpress($apiserver, $apichannel) {

    $page = 1; // Starting page
    $apiEndpoint = $apiserver . '/vikings/categories/find-by-channel/' . $apichannel . '/';

// Fetch categories from the REST API
    $response = wp_remote_get($apiEndpoint . $page);

    if (is_wp_error($response)) {
        // Handle error case
        echo 'Failed to retrieve categories.';
        return;
    }

// Parse the response data
    $responsedata = json_decode(wp_remote_retrieve_body($response), true);
// Create/update WordPress categories
    if ($responsedata['total_categories']) {
        $categories = $responsedata['data'];
        foreach ($categories as $category) {
            // Check if the category already exists
            saveCategoriesToWordpress($category);
        }
    }

// Handle pagination if necessary
    if ($responsedata['total_pages'] > 1) {
// Fetch categories from remaining pages
        for ($page = 2; $page <= $responsedata['total_pages']; $page++) {
            $response = wp_remote_get($apiEndpoint . $page);

            if (is_wp_error($response)) {
                // Handle error case
                echo 'Failed to retrieve categories for page ' . $page . '.';
                continue;
            }

            // Parse the response data
            $responsedata = json_decode(wp_remote_retrieve_body($response), true);
            $categories = $responsedata['data'];
            // Create/update WordPress categories
            foreach ($categories as $category) {
                // Same category creation/update logic as above
                saveCategoriesToWordpress($category);
            }
        }
    }
}

function getSubCategoriesAndSyncWithWordpress($apiserver, $apichannel) {

    $page = 1; // Starting page
    $apiEndpoint = $apiserver . '/vikings/sub-categories/find-by-channel/' . $apichannel . '/';

// Fetch categories from the REST API
    $response = wp_remote_get($apiEndpoint . $page);

    if (is_wp_error($response)) {
        // Handle error case
        echo 'Failed to retrieve categories.';
        return;
    }

// Parse the response data
    $responsedata = json_decode(wp_remote_retrieve_body($response), true);
// Create/update WordPress categories
    if ($responsedata['total_sub_categories']) {
        $categories = $responsedata['data'];
        foreach ($categories as $category) {
            // Check if the category already exists
            saveCategoriesToWordpress($category);
        }
    }

// Handle pagination if necessary
    if ($responsedata['total_pages'] > 1) {
// Fetch categories from remaining pages
        for ($page = 2; $page <= $responsedata['total_pages']; $page++) {
            $response = wp_remote_get($apiEndpoint . $page);

            if (is_wp_error($response)) {
                // Handle error case
                echo 'Failed to retrieve categories for page ' . $page . '.';
                continue;
            }

            // Parse the response data
            $responsedata = json_decode(wp_remote_retrieve_body($response), true);
            $categories = $responsedata['data'];
            // Create/update WordPress categories
            foreach ($categories as $category) {
                // Same category creation/update logic as above
                saveCategoriesToWordpress($category);
            }
        }
    }
}

function saveCategoriesToWordpress($category) {
    $existingCategory = get_category_by_slug($category['slug']);
    $category_parent = '';
    if (isset($category['category_id'])) {
//    echo $category['category_id'].'==';
        $args = array(
            'taxonomy' => 'category',
            'meta_query' => array(
                array(
                    'key' => 'category_id',
                    'value' => $category['category_id'],
                    'compare' => '='
                )
            )
        );

        $parentcategories = get_terms($args);
        if (!empty($parentcategories)) {
            $parentcategory = $parentcategories[0]; // Assuming there is only one category matching the term meta
            $category_parent = $parentcategory->term_id;
        }
//        echo $category_parent.'---';
    }
    if ($existingCategory) {
        // Update existing category
        $categoryData = array(
            'cat_ID' => $existingCategory->term_id,
            'cat_name' => $category['name'],
            'category_description' => $category['description'],
            'category_nicename' => $category['slug'],
            'category_parent' => $category_parent
                // Add more fields as needed
        );
//        wp_update_category($categoryData);
        wp_update_term($existingCategory->term_id, 'category', $categoryData);
        update_term_meta($existingCategory->term_id, 'meta_data', $category['meta_data']);
        update_term_meta($existingCategory->term_id, 'category_id', $category['_id']);
    } else {
        // Create new category
  $categoryData = array(
    'description' => $category['description'],
    'slug' => $category['slug'],
    'parent' => $category_parent
    // Add more fields as needed
);

$term = wp_insert_term($category['name'], 'category', $categoryData);

if (!is_wp_error($term)) {
    $term_id = $term['term_id'];
    update_term_meta($term_id, 'meta_data', $category['meta_data']);
    update_term_meta($term_id, 'category_id', $category['_id']);
}
    }
}

function getPostsToWordpress($apiserver, $apichannel) {
    // Assuming you have the REST API endpoint URL and pagination parameters
    $page = 1; // Starting page
    $limit = 100; // Starting page
    $apiEndpoint = $apiserver . '/vikings/posts/find-by-channel/' . $apichannel . '/';
// Fetch posts from the REST API
    $response = wp_remote_get($apiEndpoint . $page . '/' . $limit . '/null');

    if (is_wp_error($response)) {
        // Handle error case
        echo 'Failed to retrieve posts.';
        return;
    }

// Parse the response data
    $data = json_decode(wp_remote_retrieve_body($response), true);
// Create/update WordPress posts
    if ($data['data']) {
        insertUpdatePosts($data['data']);
    } else {
        return;
    }

// Handle pagination if necessary
    $totalPages = $data['total_pages'];

// Fetch posts from remaining pages
    for ($page = 2; $page <= $totalPages; $page++) {
        $response = wp_remote_get($apiEndpoint . $page . '/' . $limit . '/null');

        if (is_wp_error($response)) {
            // Handle error case
            echo 'Failed to retrieve posts for page ' . $page . '.';
            continue;
        }

        // Parse the response data and create/update WordPress posts
        if ($response['data']) {
            insertUpdatePosts($response['data']);
        } else {
            return;
        }
    }
}

function insertUpdatePosts($posts) {
    foreach ($posts as $post) {
        // Check if the post already exists
        $existingPost = getPostByCustomField('post_id', $post['post_id']);
        $catAndSubcat = array_merge($post['category'], $post['sub_category']);
        $postCategories = getCategoriesIds($catAndSubcat);
        $originalDate = $post['publishing_date'];
		
				$found = array_filter($post['category'], function($element) {
    return in_array($element['_id'], [
        '66dedc54d2e8cca961d4c755',
        '67ee270fbdf2755d14d769b6'
    ]);
});

if ($found) {
    continue;
}

        // Convert the date format
        $postDate = date('Y-m-d H:i:s', strtotime($originalDate));
//pr($post);
        if ($existingPost) {
            // Update existing post
            // ...
            $postData = array(
                'ID' => $existingPost,
                'post_title' => $post['title'],
                'post_name' => $post['url'],
                'post_date' => $postDate,
                'post_status' => 'publish'
            );
            wp_update_post($postData);
            if (!empty($postCategories)) {
                wp_set_post_categories($existingPost, $postCategories);
            }

            update_post_meta($existingPost, 'feature_image', $post['feature_image']);
            update_post_meta($existingPost, 'slike_id', $post['feature_image']['slike_id']);
            update_post_meta($existingPost, 'authors', $post['authors']);
            update_post_meta($existingPost, 'keywords', $post['keywords']);
            update_post_meta($existingPost, 'post_id', $post['post_id']);
        } else {
            // Create new post
            $postData = array(
                'post_title' => $post['title'],
                'post_name' => $post['url'],
                'post_date' => $postDate,
                'post_status' => 'publish'
            );

            // Insert the post
            $postId = wp_insert_post($postData);

            // Assign categories to the post
            if (!empty($postCategories)) {
                wp_set_post_categories($postId, $postCategories);
            }
            update_post_meta($postId, 'feature_image', $post['feature_image']);
             update_post_meta($postId, 'slike_id', $post['feature_image']['slike_id']);
            update_post_meta($postId, 'authors', $post['authors']);
            update_post_meta($postId, 'keywords', $post['keywords']);
            update_post_meta($postId, 'post_id', $post['post_id']);
        }
    }
}

function getPostByCustomField($customFieldKey, $customFieldValue) {

// Query posts based on the custom field value
    $args = array(
        'post_type' => 'post',
        'meta_query' => array(
            array(
                'key' => $customFieldKey,
                'value' => $customFieldValue,
                'compare' => '='
            )
        )
    );

    $posts = get_posts($args);
    if ($posts) {
        return $posts[0]->ID;
    } else {
        return;
    }
}

function getCategoriesIds($categories) {
    // Get the category IDs
    $categoryIDs = array();
    $categories = array_filter($categories);
    foreach ($categories as $category) {
        $term = get_term_by('slug', $category['slug'], 'category');

        if ($term) {
            $categoryIDs[] = $term->term_id;
        }
    }
    return $categoryIDs;
}

function feature_image_shortcode($atts) {
    // Extract the attributes
    $atts = shortcode_atts(array(
        'field' => '', // The name/key of the custom field
        'before' => '', // The name/key of the custom field
        'after' => '', // The name/key of the custom field
        'id' => 'get_the_ID()' // The ID of the post (defaults to current post)
            ), $atts);
    global $post;
    // Retrieve the custom field value
    $customFieldValue = get_post_meta($post->ID, 'feature_image', true);
    $imgHtml = '';
    if ($customFieldValue['image']) {
        $imgSrc = $customFieldValue['image'];
        $imgTitle = $customFieldValue['image_title'];
        $imgAlt = $customFieldValue['image_alt'];
        $imgType = $customFieldValue['type'];
        $imgSlikeId = $customFieldValue['slike_id'];
        if ($imgType == "slike") {
            $imgHtml = '<div class="playercontroller" id="playercontroller' . $imgSlikeId . '" data-slike="' . $imgSlikeId . '"><div class="imgwrap"><img  src="'.$imgSrc.'" title="' . $imgTitle . '" alt="' . $imgAlt . '" /><svg width="67" height="67" viewBox="0 0 24 24" ><path d="M0 0h24v24H0z" fill="none"></path><path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path></svg></div></div>';
//            $imgHtml = '<div class="playercontroller" id="playercontroller' . $imgSlikeId . '" data-slike="' . $imgSlikeId . '"></div>';
//                $imgHtml = '<div class="playercontroller" id="playercontroller'.$imgSlikeId.'" data-slike="'.$imgSlikeId.'"></div>';
        } else {
            $imgHtml = '<img  src="https://cmsimages.timesgroup.com/image-resizer/iAmKolkata?s3_path=iAmKolkata' . $imgSrc . '&w=350&q=50" title="' . $imgTitle . '" alt="' . $imgAlt . '" />';
        }
    }
    // Return the custom field value
    return $imgHtml;
}

add_shortcode('feature_image', 'feature_image_shortcode');

function custom_field_shortcode($atts) {
    // Extract the attributes
    $atts = shortcode_atts(array(
        'field' => '', // The name/key of the custom field
        'before' => '', // The name/key of the custom field
        'after' => '', // The name/key of the custom field
        'id' => get_the_ID() // The ID of the post (defaults to current post)
            ), $atts);

    // Retrieve the custom field value
    $customFieldValue = get_post_meta($atts['id'], $atts['field'], true);

    if ($atts['field'] == 'authors' && count($customFieldValue) > 0) {
        $customFieldValue = $atts['before'] . $customFieldValue[0]['full_name'] . $atts['after'];
    } else if ($atts['field'] == 'authors') {
        $customFieldValue = '';
    }
    // Return the custom field value
    return $customFieldValue;
}

add_shortcode('custom_field', 'custom_field_shortcode');

// single blog data
function post_content_Api() {
    // Extract the attributes
    $atts = shortcode_atts(array(
        'field' => '', // The name/key of the custom field
        'before' => '', // The name/key of the custom field
        'after' => '', // The name/key of the custom field
        'id' => get_the_ID() // The ID of the post (defaults to current post)
            ), $atts);

    $apiserver = 'https://cmsgold.timesgroup.com/api/v1';
    $apichannel = '6492e9bc51e7b4d201f6ca7e';

    // Retrieve the custom field value
    $postID = get_post_meta($atts['id'], 'post_id', true);
    // Check if the custom field value exists
    if (!empty($postID)) {

        $apiEndpoint = $apiserver . '/vikings/channels/' . $apichannel . '/post/';

// Fetch categories from the REST API
        $response = wp_remote_get($apiEndpoint . $postID);

        if (is_wp_error($response)) {
            // Handle error case
            echo 'Failed to retrieve categories.';
            return;
        }

// Parse the response data
        $responsedata = json_decode(wp_remote_retrieve_body($response), true);
//        pr($responsedata);
        // Append the custom field value to the post content
        $content = $responsedata['article_data'][0]['data']['html'];
        $content = str_replace('$$embedded_image$$',"https://cmsimages.timesgroup.com/image-resizer/iAmKolkata?s3_path=iAmKolkata",$content);
        return $content;
    }
}

add_shortcode('post_content_Api', 'post_content_Api');