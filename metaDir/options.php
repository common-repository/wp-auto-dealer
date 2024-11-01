<?php
add_action('admin_menu' , 'wp_car_admin_fire');

function wp_car_admin_fire() {
add_submenu_page('edit.php?post_type=wp_car', 'Custom Post Type Admin', 'Custom Settings', 'edit_posts', basename(__FILE__), 'wp_car_theme_settings_page');
}
$theme_options = array (
 
array( "name" => $themename." Options",
"type" => "title"),
 
/* ---------------------------------------------------------
General section
----------------------------------------------------------- */
array( "name" => "General",
"type" => "section"),
array( "type" => "open"),
 
array( "name" => "Logo URL",
"desc" => "Enter the link to your logo image",
"id" => $shortname."_logo",
"type" => "text",
"std" => ""),
 
array( "name" => "Custom Favicon",
"desc" => "A favicon is a 16x16 pixel icon that represents your site; paste the URL to a .ico image that you want to use as the image",
"id" => $shortname."_favicon",
"type" => "text",
"std" => get_bloginfo('url') ."/images/favicon.ico"),
 
array( "type" => "close"),
 
/* ---------------------------------------------------------
Home section
----------------------------------------------------------- */
array( "name" => "Homepage",
"type" => "section"),
array( "type" => "open"),
 
array( "name" => "Homepage Featured",
"desc" => "Choose a category from which featured posts are drawn",
"id" => $shortname."_feat_cat",
"type" => "select",
"options" => $all_cats,
"std" => "Select a category"),
 
array( "type" => "close"),
 
/* ---------------------------------------------------------
Footer section
----------------------------------------------------------- */
array( "name" => "Footer",
"type" => "section"),
array( "type" => "open"),
 
array( "name" => "Footer Credit",
"desc" => "You can customize footer credit on footer area her.",
"id" => $shortname."_footer_text",
"type" => "text",
"std" => ""),
 
array( "type" => "close")
 
);
function wp_car_theme_settings_page() {
    global $themename,$theme_options;
    $i=0;
    $message='';
    if ( 'save' == $_REQUEST['action'] ) {
      
        foreach ($theme_options as $value) {
            update_option( $value['id'], $_REQUEST[ $value['id'] ] ); }
      
        foreach ($theme_options as $value) {
            if( isset( $_REQUEST[ $value['id'] ] ) ) { update_option( $value['id'], $_REQUEST[ $value['id'] ]  ); } else { delete_option( $value['id'] ); } }
        $message='saved';
    }
    else if( 'reset' == $_REQUEST['action'] ) {
          
        foreach ($theme_options as $value) {
            delete_option( $value['id'] ); }
        $message='reset';       
    }
  
    ?>
    <div class="wrap options_wrap">
        <div id="icon-options-general"></div>
        <h2><?php _e( ' Theme Options' ) //your admin panel title ?></h2>
        <?php
        if ( $message=='saved' ) echo '<div class="updated settings-error" id="setting-error-settings_updated">
        <p>'.$themename.' settings saved.</strong></p></div>';
        if ( $message=='reset' ) echo '<div class="updated settings-error" id="setting-error-settings_updated">
        <p>'.$themename.' settings reset.</strong></p></div>';
        ?>
        
        <div class="content_options">
            <form method="post">
  
<?php foreach ($theme_options as $value) {
          
	switch ( $value['type'] ) {
              
                    case "open": 
                    break;
                  
                    case "close": ?>
                    </div>
                    </div><br />
                    <?php break;
                  
                    case "title": ?>
                    <div class="message">
                        <p>To easily use the <?php echo $themename;?> theme options, you can use the options below.</p>
                    </div>
                    <?php break;
                  
                    case 'text': ?>
                    <div class="option_input option_text">
                    <label for="<?php echo $value['id']; ?>">
                    <?php echo $value['name']; ?></label>
                    <input id="" type="<?php echo $value['type']; ?>" name="<?php echo $value['id']; ?>" value="<?php if ( get_settings( $value['id'] ) != "") { echo stripslashes(get_settings( $value['id'])  ); } else { echo $value['std']; } ?>" />
                    <small><?php echo $value['desc']; ?></small>
                    <div class="clearfix"></div>
                    </div>
                    <?php break;
                  
                    case 'textarea': ?>
                    <div class="option_input option_textarea">
                    <label for="<?php echo $value['id']; ?>"><?php echo $value['name']; ?></label>
                    <textarea name="<?php echo $value['id']; ?>" rows="" cols=""><?php if ( get_settings( $value['id'] ) != "") { echo stripslashes(get_settings( $value['id']) ); } else { echo $value['std']; } ?></textarea>
                    <small><?php echo $value['desc']; ?></small>
                    <div class="clearfix"></div>
                    </div>
                    <?php break;
                  
                    case 'select': ?>
                    <div class="option_input option_select">
                    <label for="<?php echo $value['id']; ?>"><?php echo $value['name']; ?></label>
                    <select name="<?php echo $value['id']; ?>" id="<?php echo $value['id']; ?>">
                    <?php foreach ($value['options'] as $option) { ?>
                            <option <?php if (get_settings( $value['id'] ) == $option) { echo 'selected="selected"'; } ?>><?php echo $option; ?></option>
                    <?php } ?>
                    </select>
                    <small><?php echo $value['desc']; ?></small>
                    <div class="clearfix"></div>
                    </div>
                    <?php break;
                  
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
                    <div class="input_title">
                         
                        <h3><img src="<?php echo get_template_directory_uri();?>/images/options.png" alt="">&nbsp;<?php echo $value['name']; ?></h3>
                        <span class="submit"><input name="save<?php echo $i; ?>" type="submit" class="button-primary" value="Save changes" /></span>
                        <div class="clearfix"></div>
                    </div>
                    <div class="all_options">
                    <?php break;
                     
                }
            }?>
          <input type="hidden" name="action" value="save" />
          </form>
          <form method="post">
              <p class="submit">
              <input name="reset" type="submit" value="Reset" />
              <input type="hidden" name="action" value="reset" />
              </p>
          </form>
        </div>
        
    </div>
 <?php   
}

?>