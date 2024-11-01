<?php
if( ! defined( 'ABSPATH' ) ) exit;

class Cuztom_Field_CarYear extends Cuztom_Field
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
	
	function _output( $value )
	{
		$output = '<select ' . $this->output_name() . ' ' . $this->output_id() . ' class="cuztom-input cuztom-select '.$value.'">';
			
		$output .= '</select>';

		$output .= $this->output_explanation();

		return $output;
	}
}