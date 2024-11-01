jQuery(document).ready(function($){
    //Create a variable for the CarQuery object.  You can call it whatever you like.
	var carquery = new CarQuery();

    //Run the carquery init function to get things started:
    function getClass (){
	var yourArray = [];
	var a = 1;
	$('.cuztom-select').each(function (){
		var selected = $(this).attr('class').split(' ');
		
		if (selected[3] && selected[4]) {
			var selected = selected[2]+' '+selected[3]+' '+selected[4];
		}else if (selected[3]) {
			var selected = selected[2]+' '+selected[3];
		}else {
			var selected = selected[2];
		}
		
		if (selected) {
			yourArray.push(selected);
		}
	a++; });
	
	return yourArray;
	}
	
	var check = getClass ();
	if (check) {
		
		carquery.init(check[0],check[1],check[2]);
	}else {
	carquery.init();

    //Optional: Pass sold_in_us:true to the setFilters method to show only US models. 
    carquery.setFilters( {sold_in_us:true} );

    //Optional: initialize the year, make, model, and trim drop downs by providing their element IDs
    
	}
	carquery.initYearMakeModelTrim("_car_info_year", "_car_info_make", "_car_info_model");
});