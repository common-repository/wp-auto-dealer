<?php 
function wp_get_car($postID) {
	
	 $price = get_post_meta($postID,"_car_info_price",true);
	 $km = get_post_meta($postID,"_car_info_kilo",true);
	 $type = get_post_meta($postID,"_car_info_caryype",true);
	 $year = get_post_meta($postID,"_car_info_year",true);
	 $firstImg = get_post_meta($postID,'_car_pic_carpic1',true);
	 $firstImg = wp_get_attachment_image($firstImg,'large' );
	 
	 switch ($type) {
		case '0':
			$class= "";
			$text = "";
			break;
		case '1':
			$class= "wp-car-green";
			$text = "Featured";
			break;
		case '2':
			$class= "wp-car-red";
			$text = "On Sale";
			break;
		case '3':
			$class= "wp-car-blue";
			$text = "New Arrival";
			break;
	}
	$return.='
	<div id="ID'.get_the_ID().'" class="wp-car-item wp-car-large-4-5 wp-car-small-12 wp-car-left">
		<div class="wp-car-img-wrap">
			'.$firstImg.'
		</div>
		<div class="wp-car-badge">
			<div class="wp-car-class '.$class.'">'.$text.'</div>
			<div class="wp-car-large-12 clearAfter wp-car-badge-inner">
				<h3 class="wp-car-white-text wp-style-text">
					'.get_the_title($postID).' ('.$year.')
				</h3>
				Price: $'.($price == "" ? "N/A" : number_format($price,0)).' | '.'
				Miles: '.($km == "" ? "N/A" : number_format($km,0)).'
				
			</div>
		</div>
	</div>';
	return $return;	
}

function getYears () {
	query_posts(array ('post_type' => -1, 'post_type'=>'wp_car'));	
	$baseArray= array();
	while(have_posts()):the_post();
		$year = get_post_meta(get_the_ID(),"_car_info_year",true);
		echo $year.'<br>';
		if (!in_array($year, $baseArray)) {
			$baseArray[] = $year; 
		}
		$year = '';
	endwhile; wp_reset_query();
	print_r($baseArray);
}

function wp_car_get_paged ($postsFound,$maxPage,$perPage,$current) {
	if ($maxPage != 1) {
		$i = 1;
		$return .='<div class="wp-car-left wp-car-nav-wrap wp-car-clearAfter">';
		while($i <= $maxPage) {
			$return .='<div id="'.($i == $current ? "active-page" : "").'" class="wp-car-left wp-car-nav-item">'.$i.'</div>';
			$i++;	
		}
		$return .='</div>';
	}
	return $return;
}
function get_mpg_rating ($postID) {
	$cty = get_post_meta($postID,'_car_info_cfeco',true);
	$hwy = get_post_meta($postID,'_car_info_hfeco',true);
	$display = get_option("wp-car-fuel-eco");
	$combined = ($cty + $hwy)/2;
	$return = '
		<div class="wp-car-large-4 wp-car-left wp-car-small-12 wp-car-c-fuel-eco">
			<span style="font-size:.7rem">City Fuel Economy</span>
			<h3>'.$cty.' '.$display.' </h3>
		</div>
		<div class="wp-car-large-4 wp-car-left wp-car-small-12 wp-car-h-fuel-eco">
			<span style="font-size:.7rem">Highway Fuel Economy</span>
			<h3>'.$hwy.' '.$display.' </h3>
		</div>
		<div class="wp-car-large-4 wp-car-left wp-car-small-12 wp-car-com-fuel-eco">
			<span style="font-size:.7rem">Combined Fuel Economy</span>
			<h3>'.$combined.' '.$display.' </h3>
		</div>
	';
	return $return;
}
function get_detal_spec($postID,$arrayTerm) {
	$arrayTerm = explode(',',$arrayTerm);
	foreach ($arrayTerm as $term) {
		$meta = get_post_meta($postID,$term,true);	
		if ($meta != '') {
			switch ($term) {
				case '_car_info_trans':
					$label = 'Transmission'; 
					if ($meta == 0) {$qTerm = 'Manual';} else {$qTerm = 'Automatic';}
					break;
				case '_car_info_excolor':
					$label = 'Exterior Colour'; $qTerm = $meta;
					break;
				case '_car_info_incolor':
					$label = 'Interior Colour'; $qTerm = $meta;
					break;
				case '_car_info_passen':
					$label = 'Passengers'; $qTerm = $meta;
					break;
				case '_car_info_doors':
					$label = 'Doors'; $qTerm = $meta;
					break;
				case '_car_info_fueltype':
					$label = 'Fuel Type'; 
					if ($meta == 0){$qTerm = 'Diesel';} elseif($meta == 1){$qTerm = 'Gasoline';} 
					elseif($meta == 2){$qTerm = 'Hybrid';} elseif($meta == 3){$qTerm = 'Other';} 
					elseif($meta == 4){$qTerm = 'Electric';} 
					break;
				case '_car_info_bodytype':
					$label = 'Body Type'; 
					if ($meta == 0){$qTerm = 'Convertible';} elseif($meta == 1){$qTerm = 'Coupe';} 
					elseif($meta == 2){$qTerm = 'Hatchback';} elseif($meta == 3){$qTerm = 'Other';} 
					elseif($meta == 4){$qTerm = 'Truck';} elseif($meta == 5){$qTerm = 'Sedan';} 
					elseif($meta == 6){$qTerm = 'SUV';} elseif($meta == 7){$qTerm = 'Wagon';} 
					break;
				case '_car_info_engtype':
					$label = 'Engine'; $qTerm = $meta;
					break;
				case '_car_info_drivetr':
					$label = 'Drivetrain'; 
					if ($meta ==0) {$qTerm = 'FWD';} elseif ($qTerm == 1) {$qTerm = 'RWD';} else {$qTerm = 'AWD';}
					break;
				
			}
			$return .= '
			<div class="wp-car-large-4 wp-car-left wp-car-small-12 wp-car-detail-item">
				<div class="wp-car-left wp-car-single-icon '.$term.'"> </div>
				<span class="wp-car-detail-spec">
					'.$label.' : <span>'.$qTerm.'</span>
				</span>
			</div>';
		}
	}
	return $return;
}
function get_single_car_call ($postID) {
	
	$price = get_post_meta($postID,"_car_info_price",true);
	$km = get_post_meta($postID,"_car_info_kilo",true);
	$type = get_post_meta($postID,"_car_info_caryype",true);
	$year = get_post_meta($postID,"_car_info_year",true);
	$make = get_post_meta($postID,"_car_info_make",true);
	$model = get_post_meta($postID,"_car_info_model",true);
	$firstImg = get_post_meta($postID,'_car_pic_carpic1',true);
	$firstImg = wp_get_attachment_image($firstImg,'large' );
	$return .= '
		<div class="wp-car-large-12 wp-car-clearAfter">
				
			<div class="wp-car-large-12 wp-car-clearAfter">
			<div class="wp-car-large-5 wp-car-small-12 wp-car-left">
				<h3 class="wp-style-text">'.$year.' '.$make.' '.$model.'</h3>
			</div>
			<div class="wp-car-large-6 wp-car-small-12 wp-car-right">
				<div class="wp-car-large-5 wp-car-left wp-car-single-price"> 
					'.($price == "" ? "N/A" : get_option("wp-car-currency").number_format($price,0)).'
				</div>
				<div class="wp-car-large-6 wp-car-left wp-car-single-kilo"> 
					'.($km == "" ? "N/A" : number_format($km,0).' '.get_option("wp-car-kilo")).'
				</div>
			</div>
			</div>
				
			<div class="wp-car-large-12 wp-car-clearAfter wp-car-margin-top-lrg">
				<div class="wp-car-large-5 wp-car-small-12 wp-car-left wp-car-gallery-wrap">
					<div class="wp-car-gallery-screen">'.$firstImg.'</div>
					<div class="wp-car-gallery-item-wrap">';
					
					$i = 1;
					while($i != 6) {
						$img = get_post_meta($postID,'_car_pic_carpic'.$i,true);
						if ($img != '') {
							$imgArray[] = $img; 
						}
						$i++;	
					}
					$b = 1;
					if ($imgArray) {
					foreach ($imgArray as $sinImg) {
						$return .= '<div id="'.($b == 1 ? "wp-car-active" : "").'" class="wp-car-gallery-item wp-car-left wp-car-large-3">'.
							wp_get_attachment_image($sinImg,'thumbnail' )
							.'</div><div class="wp-car-image-hidden">'.
							wp_get_attachment_image($sinImg,'large' ).
							'</div>';	
					$b++;
					}
					}
				$return .='</div></div>
				<div class="wp-car-large-6 wp-car-small-12 wp-car-right">
					<p>'.get_the_content().'</p>
					<div class="wp-car-large-12 wp-car-clearAfter wp-car-margin-top-sm">
						'.get_mpg_rating ($postID).'
					</div>
				</div>
			</div>
				
			<div class="wp-car-large-12 wp-car-clearAfter wp-car-margin-top-lrg wp-car-details">
				'.get_detal_spec($postID,'_car_info_trans,_car_info_excolor,_car_info_incolor,_car_info_passen,_car_info_doors,_car_info_fueltype,_car_info_bodytype,_car_info_engtype,_car_info_drivetr').'
			</div>
			
			<div class="wp-car-large-12 wp-car-small-12 clearAfter wp-car-margin-top-med">
				<div class="wp-car-large-4 wp-car-small-12 wp-car-left wp-car-phone">
					<h6>Contact Us by phone </h6>
					<h3> '.get_option("wp-car_phone").'</h3>
				</div>
				<div class="wp-car-large-7 wp-car-small-12 wp-car-right wp-car-email">
					<h6>Or send us an email </h6>
					<div class="wp-car-large-12 wp-car-small-12 clearAfter">
					<div class="wp-car-contact-field wp-car-large-4 wp-car-left wp-car-small-12"> 
						<input type="text" name="fullName" class="wp-car-input" placeholder="your name"> 
					</div>
					<div class="wp-car-contact-field wp-car-large-4 wp-car-left wp-car-small-12"> 
						<input class="wp-car-input" type="text" name="fullName" placeholder="your email"> 
					</div>
					<div class="wp-car-contact-field wp-car-large-3 wp-car-left wp-car-small-12"> 
						<div id="wp-car-send-email"> Send </div>
					</div>
					</div>
				</div>
			</div>
			
		</div>
		';
		return $return;
}
