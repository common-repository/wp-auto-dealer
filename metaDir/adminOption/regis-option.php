<?php
$shortname = 'wp-car';
$theme_options = array (
 

/* ---------------------------------------------------------
General section
----------------------------------------------------------- */
array( "name" => "General",
"type" => "section"),
array( "type" => "open"),
 
array( "name" => "Contact Phone",
"desc" => "Enter the Phone number you wish to display for contact",
"id" => $shortname."_phone",
"type" => "text",
"std" => ""),

array( "name" => "Contact Email",
"desc" => "Enter the email address you wish to display for contact",
"id" => $shortname."_email",
"type" => "text",
"std" => ""),
 
array( "name" => "Currency",
	"desc" => "Choose a currency for the site",
	"id" => $shortname."-currency",
	"type" => "select",
	"options" => array (
		'&#36;'=>'$',
		'&#163;'=>'£',
		'&#165;'=>'¥',
		'&#8355;'=>'₣',
		'&#128;'=>'€',
		'&#8361;'=>'₩',
		'&#8369; '=>'₱',
		'&#x20B9;'=>'₹'
	),
	"std" => "Select a category"
),

array( "name" => "Miles/KM",
	"desc" => "Should the cars be rated in KM's or Miles",
	"id" => $shortname."-kilo",
	"type" => "select",
	"options" => array (
		'miles'=>'Miles',
		'km'=>'KM',
	),
	"std" => "Select a category"
), 
array( "name" => "MPG / L/100KM",
	"desc" => "Should the fuel economy be rated in Miles or KM",
	"id" => $shortname."-fuel-eco",
	"type" => "select",
	"options" => array (
		'mpg'=>'MPG',
		'lkm'=>'L/100KM',
	),
	"std" => "Select a category"
), 
array( "name" => "Color",
"desc" => "Pick a color to use as a highlight color",
"id" => $shortname."-colo-pick",
"type" => "color",
"std" => ""),

array( "name" => "Search Options",
	"desc" => "Enable or disable the search items",
	"id" => $shortname."-search-option",
	"type" => "searchOption",
	"options" => array (
		'_car_info_price'=>'Price',
		'_car_info_year'=>'Year',
		'_car_info_trans'=>'Transmission',
		'_car_info_fueltype'=>'Fuel Type',
		'_car_info_bodytype'=>'Body Type',
		'_car_sort_option'=>'Sort Option',
	),
	"std" => ",_car_info_bodytype,_car_sort_option,_car_info_price,_car_info_year,_car_info_trans,_car_info_fueltype"
),
array( "type" => "close"),

 
);