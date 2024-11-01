<?php
function wpcars( $atts ) {
	wp_enqueue_script( 'jplane', get_plugin_url ().'assets/mouseWheel.js', array(), '1.0.0', true );
	wp_enqueue_style( 'wp-car-style', get_plugin_url ().'assets/wp-ultimate-style.css');
	wp_enqueue_style( 'wp-car-scroll', get_plugin_url ().'assets/mScroll.css');
	
	$color = get_option("wp-car-colo-pick");
	if ($color == '') {$color = '#6DB510';}
	
	if ($atts == '') {
		$perPage = '10';
		$excludeArray = '';
		
	}else {
		
		 $excludeArray = array();
		 if ($atts["paged"] != '') {$perPage = $atts["paged"];}else {$perPage = 9;}
		 if ($atts["exclude"] != '') {$exclude = $atts["exclude"]; $excludeArray = explode('/',$exclude);}
		 
	}
	 $return = "
	 <style>
	 #wp-car-send-email {
	 	border:1px solid #".$color.";
		
	 }
	 #active-page {
		border:1px solid #".$color.";	 
	 }
	 .wp-car-single-price {
		background-color:#".$color.";
	 }
	 .wp-car-detail-spec span {
		color:#".$color.";
	 }
	 #wp-car-active {
		border:	1px solid #".$color.";
	}
	 </style>
	 <script>
	 jQuery(document).ready(function ($){
	 $('.wp-car-badge').live('click',function (){
		var postID = $(this).parent().attr('ID'); 
		$('.wp-car-overLay').toggle();
		$('.wp-car-contact-wrap').toggle();
		$('.wp-car-overLay').animate({
			opacity: 1,
		}, 500, function() {
			$('.wp-car-contact-wrap').animate({opacity: 1,}, 500);
			$('.wp-car-load-lrg').show();
			var ajaxurl = '".get_bloginfo('wpurl')."/wp-admin/admin-ajax.php';
				var data = {
				action: 'get_single_car',
				postID: postID,
			};
				
			$.post(ajaxurl, data, function(response) {
				$('.wp-car-load-lrg').hide();
				$('.wp-car-single').html(response);
			});
		});
		
	});
	$('.wp-car-close-contact').click(function (){
		
		$('.wp-car-contact-wrap').animate({opacity:0,}, 500, function() {
			$('.wp-car-contact-wrap').toggle();
			$('.wp-car-overLay').animate({opacity: 0,}, 500, function() {
				$('.wp-car-overLay').toggle();
				$('.wp-car-single').html('');
			});
		});
		
	});
	$('.wp-car-gallery-item').live('click',function (){
		var nextImg = $(this).next().html();
		$('.wp-car-gallery-screen').html(nextImg);
		$('.wp-car-gallery-item').each(function (){ $(this).removeAttr('ID') });
		$(this).attr('ID','wp-car-active');
	})
	
	$('.wp-car-contact-wrap').mCustomScrollbar({theme:\"dark\"});
	});</script>";
	
	 $return .= wpCarSearch ($perPage);
	 $return .= '<div class="wp-car-overLay"> 
	 </div> <div class="wp-car-contact-wrap"> 
	 <div class="wp-car-close-contact"> X </div>
	 <div class="wp-car-load-lrg"></div>
	 <div class="wp-car-single wp-car-margin-top-med">
	 </div>
	 </div>';
	 global $wp_query;
	 query_posts(array (
	 	'post_type'=>'wp_car',
		'posts_per_page'=>$perPage,
		'post__not_in' =>$excludeArray,
		'order'=>'ASC'
	));
	 $return .= '<div class="" id="wp-car-results" class="wp-car-clearAfter">';
	 while(have_posts()):the_post();
	 	$return .= wp_get_car(get_the_ID());
	 endwhile; 
	 $maxPage = $wp_query->max_num_pages;
	 $postsFound = $wp_query->found_posts;
	 wp_reset_query();
	 
	 $return .= wp_car_get_paged ($postsFound,$maxPage,$perPage,'1');
	 $return .='<div class="wp-car-right">
	 			<a href="'.get_option("linkVal").'">Powered by WP Auto Dealer</a>
				</div>';
	 $return .='</div>'; 
	 
	 return $return;
}
function wpCarSearch ($perPage) {
	//getYears ();
	wp_enqueue_script( 'car-api', get_plugin_url ().'/metaDir/assets/js/carAPI.js', array(), '1.0.0', true );
	wp_enqueue_script( 'car-ready', get_plugin_url ().'/assets/wp-ultimate-java.js', array(), '1.0.0', true );
	
	$return .="
	<script>
	jQuery(document).ready(function($) {
		var ajaxurl = '".get_bloginfo('wpurl')."/wp-admin/admin-ajax.php';
			var data = {
				action: 'get_make',
				yearMin: 1960,
				yearMax: 2015,
			};
				
		$.post(ajaxurl, data, function(response) {
				$('#wp-car-make').html(response);
		});
		
		$('#wp-car-year-min,#wp-car-year-max').live('change',function (){
		var minYear = $('#wp-car-year-min').val();
		var maxYear = $('#wp-car-year-max').val();
		var ajaxurl = '".get_bloginfo('wpurl')."/wp-admin/admin-ajax.php';
			var data = {
				action: 'get_make',
				yearMin: minYear,
				yearMax: maxYear,
			};
		
		
		$.post(ajaxurl, data, function(response) {
				$('#wp-car-make').html(response);
		});
		});
		
		$('#wp-car-make').live('change',function (){
			var carmake = $('#wp-car-make').val();
			var ajaxurl = '".get_bloginfo('wpurl')."/wp-admin/admin-ajax.php';
			var data = {
				action: 'get_model',
				yearMin: 1960,
				yearMax: 2015,
				make: carmake
				
			};
				
			$.post(ajaxurl, data, function(response) {
					$('#wp-car-model').append(response);
			});
		})
		
		$('.wp-car-item').live('mouseenter',function (){
			$(this).children('.wp-car-badge').fadeIn('fast')
		});
		$('.wp-car-item').live('mouseleave',function (){
			$(this).children('.wp-car-badge').fadeOut('fast')
		});
		$('#wp-car-search,.wp-car-nav-item').live('click',function(){
			$('#wp-car-search').animate({width: '70%',}, 200, function() {
				$('.wp-car-load-sm').show();
			});
			var search = $('.wp-car-search :input').serialize();
			
			if ($(this).hasClass('wp-car-nav-item')) {
				var curPage = $(this).html();
				
			}else {
				var curPage = 1;	
			}
			
			var ajaxurl = '".get_bloginfo('wpurl')."/wp-admin/admin-ajax.php';
				var data = {
				action: 'wp_car_search',
				term: search,
				paged: curPage,
				perpage: ".$perPage.",
			};
				
			$.post(ajaxurl, data, function(response) {
				$('.wp-car-load-sm').hide();
				$('#wp-car-search').animate({width: '100%',}, 200);
				$('#wp-car-results').html(response);
			});
		});
	});
	</script>
	";
	$min = 1965;
	$max = 2015;
	$return .='
	<div class="wp-car-search wp-car-clearAfter">
		<div class="wp-car-search-item wp-car-large-2-8 wp-car-small-12">
			<label> Year </label>
			<select name="_car_info_year_min" class="wp-car-large-5 wp-car-left" id="wp-car-year-min">';
			$return .= '<option value="">Min Year</option>';
			while ($max != $min) {
				$return .= '<option value="'.$max.'">'.$max.'</option>';
				$max = $max-1;
			}
			$return .='</select>
			<select name="_car_info_year_max" class="wp-car-large-5 wp-car-right" id="wp-car-year-max">';
			$min = 1965;
			$max = 2015;
			$return .= '<option value="">Max Year</option>';
			while ($max != $min) {
				$return .= '<option value="'.$max.'">'.$max.'</option>';
				$max = $max-1;
			}
			$return .='</select>
		</div>
		<div class="wp-car-search-item wp-car-large-2-8 wp-car-small-12">
			<label> Make </label>
			<select name="_car_info_make" id="wp-car-make"></select>
		</div>
		<div class="wp-car-search-item wp-car-large-2-8 wp-car-small-12">
			<label> Model </label>
			<select name="_car_info_model" id="wp-car-model"></select>
		</div>
		<div class="wp-car-search-item wp-car-large-2-8 wp-car-small-12">
			<label> Price </label>
			<input placeholder="Min" class="wp-car-large-5 wp-car-left" type="text" name="priceMin" id="priceMin"/>
			<input placeholder="Max" class="wp-car-large-5 wp-car-right" type="text" name="priceMax" id="priceMax"/>
		</div>
		<div class="wp-car-large-12 wp-car-small-12 wp-car-clearAfter"></div>
		<div class="wp-car-search-item wp-car-large-2-8 wp-car-small-12">
			<label> Body Type </label>
			<select name="_car_info_bodytype" id="bodyType">
				<option value="" selected="selected">Body Types (any)</option>
				<option value="0">Convertible</option>
				<option value="1">Coupe</option>
				<option value="2">Hatchback</option>
				<option value="3">Other</option>
				<option value="4">Truck</option>
				<option value="5">Sedan</option>
				<option value="6">SUV</option>
				<option value="7">Wagon</option>
			</select>
		</div>
		<div class="wp-car-search-item wp-car-large-2-8 wp-car-small-12">
			<label> Transmission </label>
			<select name="_car_info_trans" id="transType">
				<option value="" selected="selected">Any</option>
				<option value="0">Manual</option>
				<option value="1">Automatic</option>
			</select>
		</div>
		<div class="wp-car-search-item wp-car-large-2-8 wp-car-small-12">
			<label> Fuel Type </label>
			<select name="_car_info_fueltype" id="fuelType">
				<option value="">Any</option>
				<option value="0">Diesel</option>
				<option value="1">Gasoline</option>
				<option value="2">Hybrid</option>
				<option value="3">Other</option>
				<option value="4">Electric</option>
			</select>
		</div>
		<div class="wp-car-search-item wp-car-large-2-8 wp-car-small-12">
			<label> Sort </label>
			<select name="_price_sort" id="priceSort">
				<option value="">Any</option>
				<option value="0">Price: Low to High</option>
				<option value="1">Price: High to Low</option>
				<option value="2">Miles: Low to High</option>
				<option value="3">Miles: High to Low</option>
				<option value="4">Years: Low to High</option>
				<option value="5">Years: High to Low</option>
			</select>
		</div>
		<div class="wp-car-search-item wp-car-large-2-8 wp-car-small-12">
		<div id="wp-car-search"> Search </div> <div class="wp-car-load-sm"> </div>
		</div>
	</div>
	';
	return $return;
}
add_shortcode('wp-search', 'wpCarSearch');
add_shortcode('wp-cars', 'wpcars');
?>