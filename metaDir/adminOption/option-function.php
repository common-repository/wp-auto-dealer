<?php
add_action('admin_menu' , 'wp_car_admin_fire');

function wp_car_admin_fire() {
add_submenu_page('edit.php?post_type=wp_car', 'Custom Post Type Admin', 'Custom Settings', 'edit_posts', basename(__FILE__), 'wp_car_theme_settings_page');
}
wp_enqueue_style( 'wp-car-admin-style', get_plugin_url ().'metaDir/adminOption/option-style.css');
wp_enqueue_style( 'wp-car-color-pick', get_plugin_url ().'metaDir/adminOption/color-pick-style.css');
wp_enqueue_script( 'wp-car-color-pick', get_plugin_url ().'metaDir/adminOption/option-java.js', array(), '1.0.0', true );
wp_enqueue_script( 'wp-car-admin-js', get_plugin_url ().'metaDir/adminOption/color-pick-js.js', array(), '1.0.0', true );

require_once('regis-option.php');

function wp_car_theme_settings_page() {
    global $themename,$theme_options;
    $i=0;
    $message='';
    if ( 'save' == $_REQUEST['action'] ) {
      
        foreach ($theme_options as $value) {
            update_option( $value['id'], $_REQUEST[ $value['id'] ] ); }
      
        foreach ($theme_options as $value) {
            if( isset( $_REQUEST[ $value['id'] ] ) ){ 
				update_option( $value['id'], $_REQUEST[ $value['id'] ]  ); 
			} else { 
				delete_option( $value['id'] ); } 
			}
        $message='saved';
    }else if( 'reset' == $_REQUEST['action'] ) {
        foreach ($theme_options as $value) {
            delete_option( $value['id'] ); }
        $message='reset';       
    }
  
    ?>
    <div class="wrap options_wrap">
        <h2>WP Car Options</h2>
        <?php
        if ( $message=='saved' ) {
			echo '<div class="updated settings-error" id="setting-error-settings_updated">
        	<p>'.$themename.' settings saved.</strong></p></div>';
		}
        if ( $message=='reset' ) {
			echo '<div class="updated settings-error" id="setting-error-settings_updated">
        	<p>'.$themename.' settings reset.</strong></p></div>';
		}
        ?>
        
    <div class="content_options">
    	<form method="post">
  
	<?php 
	foreach ($theme_options as $value) {
          
		switch ( $value['type'] ) {
              
                    case "open": 
                    break;
                  
                    case "close":
                    	echo '</div></div><br/>';
                    break;
                  
                    case 'text': 	
                    	echo '<div class="option_input option_text">
                    	<div class="option_label_input">'.$value['name'].'</div>
                    	<input id="" type="'.$value['type'].'" name="'.$value['id'].'" value="'.( get_settings( $value['id'] ) != "" ? stripslashes(get_settings( $value['id'])  ) : $value['std'] ).'" />
						<small>'.$value['desc'].'</small>
						<div class="clearfix"></div>
						</div>';
                    break;
					
					case 'color': 	
                    	echo '<div class="option_input option_text">
                    	<div class="option_label_input">'.$value['name'].'</div>
                    	# <input value="'.get_settings($value['id']).'" type="text" name="'.$value['id'].'" id="'.$value['id'].'"></input>
						<small>'.$value['desc'].'</small>
						<div class="clearfix"></div>
						</div>';
                    break;
                  
                    case 'textarea': ?>
                    <div class="option_input option_textarea">
                    <div class="option_label_input"><?php echo $value['name']; ?></div>
                    <textarea name="<?php echo $value['id']; ?>" rows="" cols=""><?php if ( get_settings( $value['id'] ) != "") { echo stripslashes(get_settings( $value['id']) ); } else { echo $value['std']; } ?></textarea>
                    <small><?php echo $value['desc']; ?></small>
                    <div class="clearfix"></div>
                    </div>
                    <?php break;
                  
                    case 'select': ?>
                    <div class="option_input option_select">
                    <div class="option_label_input"><?php echo $value['name']; ?></div>
                    <select name="<?php echo $value['id']; ?>" id="<?php echo $value['id']; ?>">
                    <?php foreach ($value['options'] as $optionkey => $optionVal) { ?>
                            <option value="<?php echo $optionkey ?>" <?php if (get_settings( $value['id'] ) == $optionVal) { echo 'selected="selected"'; } ?>><?php echo $optionVal; ?></option>
                    <?php } ?>
                    </select>
                    <small><?php echo $value['desc']; ?></small>
                    <div class="clearfix"></div>
                    </div>
                    <?php break;
                    
					case "searchOption": 
					echo '
						<div class="option_input option_text">
						<div class="option_label_input">'.$value['name'].'</div>
                    	<input hidden="hidden" id="'.$value['id'].'"  type="'.$value['type'].'" name="'.$value['id'].'" value="'.( get_settings( $value['id'] ) != "" ? stripslashes(get_settings( $value['id'])  ) : $value['std'] ).'" />';
						$valArray = explode(',',get_settings($value['id']));
						foreach ($value['options'] as $optionkey => $optionVal) {
							if (in_array($optionkey, $valArray)) {$class = 'item-active';}else {$class = '';}
							echo '<div class="car-select-item '.$class.'" id="'.$optionkey.'">
								'.$optionVal.'
							</div>';	
						}
						
						echo '<div class="clearfix"></div>
						<small>'.$value['desc'].'</small>
						<div class="clearfix"></div>
						</div>';
					break;
					
                    case "checkbox": ?>
                    <div class="option_input option_checkbox">
                    <label for="<?php echo $value['id']; ?>"><?php echo $value['name']; ?></label>
                    <?php if(get_option($value['id'])){ $checked = "checked=\"checked\""; }else{ $checked = "";} ?>
                    <input id="<?php echo $value['id']; ?>" type="checkbox" name="<?php echo $value['id']; ?>" value="true" <?php echo $checked; ?> />
                    <small><?php echo $value['desc']; ?></small>
                    <div class="clearfix"></div>
                    </div>
                    <?php break;
                  
                    case "section":
                    $i++; ?>
                    <div class="input_section">
                    <input name="save<?php echo $i; ?>" type="submit" class="options-submit" value="Save changes" />
                    <input name="reset" type="submit" class="options-reset" value="Reset" />
                    <div class="clearfix"></div>
                    </div>
                    <div class="all_options">
                    <?php break;
                     
                }
            }?>
          <input type="hidden" name="action" value="save" />
          </form>
        </div>
        
    </div>
 <?php   
}

?>