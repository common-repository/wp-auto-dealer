<?php

if( ! defined( 'ABSPATH' ) ) exit;

class Cuztom_Field_Wysiwyg extends Cuztom_Field
{
	var $_supports_repeatable 	= true;
	var $_supports_ajax			= true;
	var $_supports_bundle		= true;

	var $css_classes 			= array( 'cuztom-input cuztom-select' );
	var $data_attributes 		= array( 'default-value' => null );

	function __construct( $field, $parent )
	{
		parent::__construct( $field, $parent );
		
		$this->data_attributes['default-value'] = $this->default_value;
	}
	
	function _output( $value ){
		if ($handle = opendir(CUZTOM_DIR . 'assets/images/icon')) {
			$arrayList = array ();
			while (false !== ($entry = readdir($handle))) {
				if (strpos($entry,'.psd') == false) {
					if (strpos($entry,'.xcf') == false) {
						$arrayList[]= $entry;
					}
				}
				
			} 
		closedir($handle); 
		}
		
		foreach ($arrayList as $list) {
			$output .= '
				<style> 
					select#selectWPic option[value="'.$list.'"]   { 
						background-image:url("'.get_bloginfo("stylesheet_directory").'/img/icon/'.$list.'"); 
						
					}  
				</style>';
		}
		$output .= '<select id="selectWPic" ' . $this->output_name() . ' ' . $this->output_id() . ' ' . $this->output_css_class() . ' ' . $this->output_data_attributes() . '>';
		
		foreach ($arrayList as $list) {
				
				$output .= '<option value="'.$list.'" ' . ( ! empty( $value ) ? selected( $list, $value, false ) : selected( $this->default_value, $list, false ) ) . '>'.$list.'</option>';				

				}		 
				
		
		$output .= '</select>';

		$output .= $this->output_explanation();
		
		
		return $output;
	}
}