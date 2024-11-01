jQuery(document).ready(function ($){
	$('#wp-car-colo-pick').colpick({
	layout:'hex',
	submit:0,
	colorScheme:'dark',
	onChange:function(hsb,hex,rgb,el,bySetColor) {
		$(el).css('border-color','#'+hex);
		// Fill the text box just if the color was set using the picker, and not the colpickSetColor function.
		if(!bySetColor) $(el).val(hex);
	}
}).keyup(function(){
	$(this).colpickSetColor(this.value);
});
	$('.car-select-item').live('click',function (){
		
		
		if ($(this).hasClass('item-active')) {
			<!-- Remove value and class-->
			var liveOption = $(this).attr('ID');	
			var orgVal = $('#wp-car-search-option').val();
			var newVal = orgVal.replace(','+liveOption, '');
			$('#wp-car-search-option').val(newVal);
			$(this).removeClass('item-active');
		}else {
			<!-- Add new value and class -->
			var liveOption = $(this).attr('ID');	
			var orgVal = $('#wp-car-search-option').val();
			var newVal = orgVal+','+liveOption;
			$('#wp-car-search-option').val(newVal);
			$(this).addClass('item-active');
		}
	})
})