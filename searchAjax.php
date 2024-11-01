<?php
add_action('wp_ajax_wp_car_search', 'wp_car_search_callback');
add_action('wp_ajax_nopriv_wp_car_search', 'wp_car_search_callback');

function wp_car_search_callback() {
    //global $wpdb; // this is how you get access to the database
	$terms = $_POST['term'];
	$paged = $_POST['paged'];
	$perPage = $_POST['perpage'];
	$params = array();
	parse_str($terms, $params);
	
	foreach ($params as $paramKey => $paramVal ) {
		if ($paramKey == '_price_sort') {
			if ($paramVal % 2 == 0) {
				$order = 'ASC';
			}else {
				$order = 'DESC';
			}
			switch ($paramVal) {
				case '0': case '1':
					$meta_key = '_car_info_price';
					break;
				case '2': case '3':
					$meta_key = '_car_info_kilo';
					break;
				case '4': case '5':
					$meta_key = '_car_info_year';
					break;
			}
			$orderby = 'meta_value';
			
		}elseif (($paramKey == '_car_info_year_min') || ($paramKey == '_car_info_year_max') && $yearA == '') {
			if (($params['_car_info_year_min'] == '') && ($params['_car_info_year_max'] != '')) {
				$yearMin = 0; $yearMax = $params['_car_info_year_max']; 	
			}elseif (($params['_car_info_year_min'] == '') && ($params['_car_info_year_max'] == '')) {
				$yearMin = 0; $yearMax = 999999999; 	
			}elseif (($params['_car_info_year_min'] != '') && ($params['_car_info_year_max'] == '')) {
				$yearMin = $params['_car_info_year_min']; $yearMax = 999999999; 	
			}else {
				$yearMin = $params['_car_info_year_min']; $yearMax = $params['_car_info_year_max'];
			}
			$newArray[] = array (
				'key' => '_car_info_year',
				'value'=>array($yearMin,$yearMax),
				'compare' => 'BETWEEN',
				'type' => 'NUMERIC'
			);
			$yearA = 'fill';
		}elseif (($paramKey == 'priceMin') || ($paramKey == 'priceMin') && $priceA == '') {
			if (($params['priceMin'] == '') && ($params['priceMax'] != '')) {
				$priceMin = 0; $priceMax = $params['priceMax']; 	
			}elseif (($params['priceMin'] == '') && ($params['priceMax'] == '')) {
				$priceMin = 0; $priceMax = 999999999; 	
			}elseif (($params['priceMin'] != '') && ($params['priceMax'] == '')) {
				$priceMin = $params['priceMin']; $priceMax = 999999999; 	
			}else {
				$priceMin = $params['priceMin']; $priceMax = $params['priceMax'];
			}
			$newArray[] = array (
				'key' => '_car_info_price',
				'value'=>array($priceMin,$priceMax),
				'compare' => 'BETWEEN',
				'type' => 'NUMERIC'
			);
			$priceA = 'fill';
		}elseif (($paramVal != '') && ($paramKey != 'priceMin')&& ($paramKey != 'priceMax')&& ($paramKey != '_car_info_year_min')&& ($paramKey != '_car_info_year_max')) {
			$newArray[] = array ('key' => $paramKey,'value'=>$paramVal);
		}
	}
	
	global $wp_query;
    query_posts(
		array (
			'post_type' => 'wp_car',
			'posts_per_page' => $perPage,
			'paged' => $paged,
			'order' => $order,
        	'orderby' => $orderby,
			'meta_key' => $meta_key,
			'meta_query' => $newArray
		)
	);
	$return = '<div class="wrapWP-large-12 wrapWP-small-12 wrapWP-clearAfter">';
	while(have_posts()):the_post();
		$return .= wp_get_car(get_the_ID());
	endwhile; 
	
	$maxPage = $wp_query->max_num_pages;
	$postsFound = $wp_query->found_posts;
	wp_reset_query();
	$return .= wp_car_get_paged ($postsFound,$maxPage,$perPage,$paged);
	$return .='</div>'; 
	 
	echo $return;
    die(); // this is required to return a proper result
}
add_action('wp_ajax_get_make', 'get_make_callback');
add_action('wp_ajax_nopriv_get_make', 'get_make_callback');

function get_make_callback () {
	$yearMin = $_POST['yearMin'];
	$yearMax = $_POST['yearMax'];
	if ($yearMax == '' && $yearMin == '' ) {$yearMax = 9999; $yearMin = 0;}
	if ($yearMax != '' && $yearMin == '' ) {$yearMax = $yearMax; $yearMin = 0;}
	if ($yearMax == '' && $yearMin != '' ) {$yearMax = 9999; $yearMin = $yearMin;}
	$makeArray = array ();
	query_posts(array (
		'post_type' => 'wp_car',
		'meta_query' => array (
		array (
			'key' => '_car_info_year',
			'value'=>array($yearMin,$yearMax),
			'compare' => 'BETWEEN',
			'type' => 'NUMERIC'
		)
		)
	));
	while(have_posts()):the_post();
		$make = get_post_meta(get_the_ID(),'_car_info_make',true);
		if (!in_array($make, $makeArray)) {
			$makeArray[]=  $make;
		}
	endwhile; wp_reset_query();
	$return .='<option value="">Choose a Make</option>';
	foreach ($makeArray as $car) {
		$return .='<option value="'.$car.'">'.$car.'</option>';	
	}
	echo $return;
	die();
}

add_action('wp_ajax_get_model', 'get_model_callback');
add_action('wp_ajax_nopriv_get_model', 'get_model_callback');

function get_model_callback () {
	
	$yearMin = $_POST['yearMin'];
	$yearMax = $_POST['yearMax'];
	if ($yearMax == '' && $yearMin == '' ) {$yearMax = 9999; $yearMin = 0;}
	if ($yearMax != '' && $yearMin == '' ) {$yearMax = $yearMax; $yearMin = 0;}
	if ($yearMax == '' && $yearMin != '' ) {$yearMax = 9999; $yearMin = $yearMin;}
	$make = $_POST['make'];
	$makeArray = array ();
	query_posts(array (
		'post_type' => 'wp_car',
		'meta_query' => array (
		array (
			'key' => '_car_info_year',
			'value'=>array($yearMin,$yearMax),
			'compare' => 'BETWEEN',
			'type' => 'NUMERIC'
		),
		array (
			'key' => '_car_info_make',
			'value'=>$make,
			'compare' => '='
		),
		)
	));
	while(have_posts()):the_post();
		$make = get_post_meta(get_the_ID(),'_car_info_model',true);
		if (!in_array($make, $makeArray)) {
			$makeArray[]=  $make;
		}
	endwhile; wp_reset_query();
	$return .='<option value="">Choose a Model</option>';
	foreach ($makeArray as $car) {
		$return .='<option value="'.$car.'">'.$car.'</option>';	
	}
	echo $return;
	die();
}

add_action('wp_ajax_get_single_car', 'get_single_car_callback');
add_action('wp_ajax_nopriv_get_single_car', 'get_single_car_callback');

function get_single_car_callback () {
	$postID = $_POST['postID'];
	$postID = str_replace ('ID','',$postID);
	query_posts(array ('post_type' => 'wp_car','post__in'=> array ($postID)));
	while(have_posts()):the_post();
		$return .= get_single_car_call (get_the_ID());
	endwhile; wp_reset_query();	
	echo $return;
	die();
}