var CarQuery = function(){}

CarQuery.prototype = {

    base_url: 		"http://www.carqueryapi.com/api/0.3/",
    body:		"",
    body_id:		"cq-body",
    color_ext_select_id:null,
    color_int_select_id:null,
    cookie_name:	"cq-settings",
    cur_make: 		"",      
    cur_model: 		"",      
    cur_trim: 		"",  
    cur_year: 		"",
    default_trim_name:	"None",
    doors: 		"",   
    doors_id: 		"cq-doors",  
    drive: 		"",
    drive_id: 		"cq-drive",    
    empty_option_html: 	"<option value=''>---</option>",    
    engine_position_id: "cq-engine-position",    
    engine_type_id: 	"cq-engine-type",    
    engine_type: 	"",    
    fuel_type_id: 	"cq-fuel-type",    
    fuel_type: 		"",    
    keyword: 		"",    
    make_list_id: 	"",    
    make_select_id: 	"",    
    max_cylinders: 	"",    
    max_cylinders_id: 	"cq-max-cylinders",    
    max_lkm_hwy: 	"",       
    max_mpg_hwy_id: 	"cq-max-mpg-hwy",    
    max_power: 		"",           
    max_power_id: 	"cq-max-power",   
    max_top_speed: 	"",   
    max_top_speed_id: 	"cq-max-top-speed",    
    max_torque: 	"",                
    max_torque_id: 	"cq-max-torque",
    max_weight:		"",    
    max_weight_id: 	"cq-max-weight",    
    max_year: 		"",    
    max_year_id: 	"cq-max-year",    
    min_cylinders:	"",
    min_cylinders_id: 	"cq-min-cylinders",    
    min_lkm_hwy: 	"",    
    min_mpg_hwy_id: 	"cq-min-mpg-hwy",   
    min_power: 		"",        
    min_power_id: 	"cq-min-power",    
    min_top_speed: 	"",        
    min_top_speed_id: 	"cq-min-top-speed",    
    min_torque: 	"",                    
    min_torque_id: 	"cq-min-torque",        
    min_weight: 	"",    
    min_weight_id: 	"cq-min-weight",    
    min_year: 		"",
    min_year_id: 	"cq-min-year",    
    model_data_id: 	"",
    model_list_id: 	"",    
    model_select_id: 	"",
    search_controls_id:	"cq-search-controls",    
    search_input_id: 	"cq-search-input",    
    search_result_id: 	"cq-search-result",        
    search_results_id: 	"cq-search-results",    
    seats: 		"",
    seats_id: 		"cq-seats",
    settings:		null,
    sold_in_us: 	"",        
    sold_in_us_id: 	"cq-sold-in-us",    
    trim_data_list_id: 	"",    
    trim_list_id: 	"",    
    trim_select_id: 	"",      
    year_select_id: 	"",
    year_select_min:	null,
    year_select_max:	null,
    
    init : function(year, make_id, model, trim)
    {
	jQuery.ajaxSetup({
	  "error":function() {   
	    alert('Bad Response from CarQuery API.\nThe service may not be avilable at this time.');
	}});
	
	//Check if initial values were set
	this.settings = new Object();
	if(year != null)
		this.saveSetting('year', year);
	if(make_id != null)
		this.saveSetting('make', make_id);
	if(model != null)
		this.saveSetting('model', model);
	if(trim != null)
		this.saveSetting('trim', trim);
	
	//Load settings from cookie if it exists
	this.loadSettings(this.cookie_name);
    },
    
    initSearchInterface : function(args)
    {
    	//allow for no argument
    	if(args == null) args = ({});
    
    	//Set ids for the search elements
    	
    	if(args.search_controls_id != null) this.search_controls_id = args.search_controls_id;
    	if(args.search_results_id != null) this.search_results_id = args.search_results_id;
    	if(args.search_result_id != null) this.search_result_id = args.search_result_id;
    	
    	var sender = this;
    	
    	//SEARCH KEYWORD INPUT
    	if(args.search_input_id != null) this.search_input_id = args.search_input_id;
	jQuery("#"+this.search_input_id).val(args.default_search_text);  
	jQuery("#"+this.search_input_id).focus(function() {
		jQuery(this).css("color", "#333");
		if(this.value == args.default_search_text) this.value = "";
	});
	jQuery("#"+this.search_input_id).keyup(function() {
		sender.setFilters( {keyword:this.value} );
	});
	
	
	//SOLD IN US
    	if(args.sold_in_us_id != null) this.sold_in_us_id = args.sold_in_us_id;
    	jQuery("#"+this.sold_in_us_id).click(function() {
		sender.setFilters( {sold_in_us:this.checked} );
	});
    	
    	
    	//YEAR FILTERS
    	if(args.min_year_id != null) this.min_year_id = args.min_year_id;
    	if(args.max_year_id != null) this.max_year_id = args.max_year_id;
    	jQuery("#"+this.min_year_id).change(function() {
		sender.setFilters( {min_year:this.value} );
	});
	jQuery("#"+this.max_year_id).change(function() {
		sender.setFilters( {max_year:this.value} );
	});
    	this.populateYearFilter(this.min_year_id);
    	this.populateYearFilter(this.max_year_id);
    	
    	
    	//ENGINE POSITION
    	if(args.engine_position_id != null) this.engine_position_id = args.engine_position_id;
    	jQuery("#"+this.engine_position_id).change(function() {
		sender.setFilters( {engine_position:this.value} );
	});
	this.populateAttributeSelect(this.engine_position_id, 'model_engine_position');
	
	
	//BODY STYLE
    	if(args.body_id != null) this.body_id = args.body_id;
    	jQuery("#"+this.body_id).change(function() {
		sender.setFilters( {body:this.value} );
	});
	this.populateAttributeSelect(this.body_id, 'model_body');
		
	
	//CYLINDERS
	if(args.min_cylinders_id != null) this.min_cylinders_id = args.min_cylinders_id;
	if(args.max_cylinders_id != null) this.max_cylinders_id = args.max_cylinders_id;
	jQuery("#"+this.max_cylinders_id).change(function() {
		sender.setFilters( {max_cylinders:this.value} );
	});
	jQuery("#"+this.min_cylinders_id).change(function() {
		sender.setFilters( {min_cylinders:this.value} );
	});
	this.populateAttributeSelect(this.max_cylinders_id, 'model_engine_cyl');
	this.populateAttributeSelect(this.min_cylinders_id, 'model_engine_cyl');
	
	
	//POWER
	if(args.min_power_id != null) this.min_power_id = args.min_power_id;
	if(args.max_power_id != null) this.max_power_id = args.max_power_id;
        //Convert to PS
	jQuery("#"+this.max_power_id).keyup(function() {
		var val = "";
		if(this.value != "") val = Math.round(this.value  * 1.01387);
		sender.setFilters( {max_power:val } );
	});
	jQuery("#"+this.min_power_id).keyup(function() {
		var val = "";
		if(this.value != "") val = Math.round(this.value  * 1.01387);
		sender.setFilters( {min_power:val }  );
	});
	
	
	//TORQUE
	if(args.min_torque_id != null) this.min_torque_id = args.min_torque_id;
	if(args.max_torque_id != null) this.max_torque_id = args.max_torque_id;
        //Convert to NM
	jQuery("#"+this.max_torque_id).keyup(function() {
	
		var val = "";
		if(this.value != "") val = Math.round(this.value / 0.7384);
		sender.setFilters( {max_torque:val } );
	});
	jQuery("#"+this.min_torque_id).keyup(function() {
		var val = "";
		if(this.value != "") val = Math.round(this.value / 0.7384);
		sender.setFilters( {min_torque:val }  );
	});	

	
	//TOP SPEED
	if(args.min_top_speed_id != null) this.min_top_speed_id = args.min_top_speed_id;
	if(args.max_top_speed_id != null) this.max_top_speed_id = args.max_top_speed_id;
	//Convert to KMH
	jQuery("#"+this.max_top_speed_id).keyup(function() {
		var val = "";
		if(this.value != "") val = Math.round(this.value  * 1.609);
		sender.setFilters( {max_top_speed:val } );
	});
	jQuery("#"+this.min_top_speed_id).keyup(function() {
		var val = "";
		if(this.value != "") val = Math.round(this.value  * 1.609);
		sender.setFilters( {min_top_speed:val } );
	});
	
	
	//ENGINE TYPE
    	if(args.engine_type_id != null) this.engine_type_id = args.engine_type_id;
    	jQuery("#"+this.engine_type_id).change(function() {
		sender.setFilters( {engine_type:this.value} );
	});
	this.populateAttributeSelect(this.engine_type_id, 'model_engine_type'); 
	
	
	//FUEL TYPE
    	if(args.fuel_type_id != null) this.fuel_type_id = args.fuel_type_id;
    	jQuery("#"+this.fuel_type_id).change(function() {
		sender.setFilters( {fuel_type:this.value} );
	});
	this.populateAttributeSelect(this.fuel_type_id, 'model_engine_fuel');
	
	
	//DRIVETRAIN
	if(args.drive_id != null) this.drive_id = args.drive_id;
	jQuery("#"+this.drive_id).change(function() {
		sender.setFilters( {drive:this.value} );
	});
	this.populateAttributeSelect(this.drive_id, 'model_drive');
	
	//SEATS
	if(args.seats_id != null) this.seats_id = args.seats_id;
	jQuery("#"+this.seats_id).change(function() {
		sender.setFilters( {seats:this.value} );
	});
	this.populateAttributeSelect(this.seats_id, 'model_seats');
	
	
	//DOORS
	if(args.doors_id != null) this.doors_id = args.doors_id;	
	jQuery("#"+this.doors_id).change(function() {
		sender.setFilters( {doors:this.value} );
	});
	this.populateAttributeSelect(this.doors_id, 'model_doors');
	
	
	//WEIGHT
	if(args.min_weight_id != null) this.min_weight_id = args.min_weight_id;
	if(args.max_weight_id != null) this.max_weight_id = args.max_weight_id;
        //Convert to KG
	jQuery("#"+this.max_weight_id).keyup(function() {
	
		var val = "";
		if(this.value != "") val = Math.round(this.value * 0.4536);
		sender.setFilters( {max_weight:val } );
	});
	jQuery("#"+this.min_weight_id).keyup(function() {
		var val = "";
		if(this.value != "") val = Math.round(this.value * 0.4536);
		sender.setFilters( {min_weight:val }  );
	});
	
	
	//MPG
	if(args.min_mpg_hwy_id != null) this.min_mpg_hwy_id = args.min_mpg_hwy_id;
	if(args.max_mpg_hwy_id != null) this.max_mpg_hwy_id = args.max_mpg_hwy_id;
        //Convert to LKM (NOTE: lower lkm = higher mpg)
	jQuery("#"+this.max_mpg_hwy_id).keyup(function() {
	
		var val = "";
		if(this.value != "") val = 235.2 / this.value;
		sender.setFilters( {min_lkm_hwy:val } );  
	});
	jQuery("#"+this.min_mpg_hwy_id).keyup(function() {
		var val = "";
		if(this.value != "") val = 235.2 / this.value;
		sender.setFilters( {max_lkm_hwy:val }  );
	});	
	
	
	//Limit Input Lengths
	jQuery( "#"+this.max_power_id + 
	  ',#'+this.min_power_id +
	  ',#'+this.max_top_speed_id +
	  ',#'+this.min_top_speed_id +
	  ",#"+this.max_torque_id +
	  ',#'+this.min_torque_id +
	  ',#'+this.max_weight_id +
	  ',#'+this.min_weight_id +
	  ',#'+this.max_mpg_hwy_id +
	  ',#'+this.min_mpg_hwy_id
	  ).attr('maxLength','5');
	
	
	//Force numerical only inputs
	jQuery( "#"+this.max_power_id + 
	  ',#'+this.min_power_id +
	  ',#'+this.max_top_speed_id +
	  ',#'+this.min_top_speed_id +
	  ",#"+this.max_torque_id +
	  ',#'+this.min_torque_id +
	  ',#'+this.max_weight_id +
	  ',#'+this.min_weight_id +
	  ',#'+this.max_mpg_hwy_id +
	  ',#'+this.min_mpg_hwy_id
	).keydown(function() {
		if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 ) && event.keyCode != 46 && event.keyCode != 8 && event.keyCode != 9)
	            event.preventDefault(); 
        });
    },
    
    search: function()
    {
    	jQuery('#'+this.search_results_id).html("Loading Results...");
    	
    	var sender = this;

   	 //Get Car Model JSON for the search criteria
    	jQuery.getJSON(this.base_url+"?callback=?", {
    	
    		 cmd:"getTrims"
    		,body:this.body
    		,doors:this.doors
    		,drive:this.drive
    		,engine_position:this.engine_position
    		,engine_type:this.engine_type
    		,fuel_type:this.fuel_type
    		,keyword:this.keyword
    		,min_cylinders:this.min_cylinders
    		,min_lkm_hwy:this.min_lkm_hwy
    		,min_power:this.min_power
    		,min_top_speed:this.min_top_speed
    		,min_torque:this.min_torque
    		,min_weight:this.min_weight
    		,min_year:this.min_year
    		,max_cylinders:this.max_cylinders
    		,max_lkm_hwy:this.max_lkm_hwy
    		,max_power:this.max_power
    		,max_top_speed:this.max_top_speed
    		,max_torque:this.max_torque
    		,max_weight:this.max_weight
    		,max_year:this.max_year
    		,seats:this.seats
    		,sold_in_us:this.sold_in_us
    		,full_results:0
    		
    	  }, function(data) {
    		
    	  if(!sender.responseError(data))
    	  {		
    	    	var trims = data.Trims;
    	    	var numResults = data.Trims.length;
    	    	var ul = document.createElement('ul');
    	    	var msg = '';
    	    	
    	    	if(numResults > 0)
    			msg = 'Showing ' + numResults + ' results:';
    		else
    			msg = 'No Matching Vehicles Found';
    			
    		for (var i = 0; i < trims.length; i++)
    		{	
 			var li = document.createElement('li');
			var a = document.createElement('a');

			var model_id = trims[i].model_id;

			jQuery(a).bind('click', {model_id:model_id}, function(event) {
				sender.populateSearchResult(event.data.model_id);
			});

			jQuery(a).html(trims[i].model_year + ' ' + trims[i].make_display + ' ' + trims[i].model_name + ' ' + trims[i].model_trim).attr("href", "javascript:void(0)");

			jQuery(li).append(a);
			jQuery(ul).append(li);
    		}

		var p = document.createElement('p');
		var div = document.createElement('div');

		jQuery(p).html(msg);
		jQuery(div).addClass("scrollable");
		jQuery(div).append(ul);

		jQuery("#"+sender.search_results_id).html("");
		jQuery("#"+sender.search_results_id).append(p);
		jQuery("#"+sender.search_results_id).append(div);	
	  }
	});
    },
    
    initMakeModelTrimList: function(make_list_id, model_list_id, trim_list_id, trim_data_list_id)
    {
        //Set the ids for the list elements
    	this.make_list_id  	=  make_list_id;
    	this.model_list_id 	=  model_list_id;
    	this.trim_list_id 	=  trim_list_id;
    	this.trim_data_list_id  =  trim_data_list_id;
    	
    	//Populate the make-list
    	this.populateMakeList();
    },
    
    initYearMakeModel: function(year_select_id, make_select_id, model_select_id)
    {
    	//Set the ids for the select elements
	this.year_select_id =  year_select_id;
	this.make_select_id =  make_select_id;
	this.model_select_id = model_select_id;
	
	//Populate the car-years select element
	this.populateYearSelect();
	
	var sender = this;
	
	//Set the change event for the years dropdown to populate the makes select
	jQuery("select#"+year_select_id).bind('change', function(){sender.yearSelectChange();});
	
	//Set the change event for the makes dropdown to populate the models select
	jQuery("select#"+make_select_id).bind('change', function(){sender.makeSelectChange();});
	
	//Set the change event for the models dropdown to save the selected model
    	jQuery("select#"+model_select_id).bind('change', function(){sender.modelSelectChange();});
    },
    
    initYearMakeModelTrim: function(year_select_id, make_select_id, model_select_id, trim_select_id)
    {
        //Set the ids for the select elements
    	this.year_select_id =  year_select_id;
    	this.make_select_id =  make_select_id;
    	this.model_select_id = model_select_id;
    	this.trim_select_id = trim_select_id;    	
    	
    	//Populate the car-years select element
    	this.populateYearSelect();
    	
    	var sender = this;
    	
    	//Set the change event for the years dropdown to populate the makes select
    	jQuery("select#"+year_select_id).bind('change', function(){sender.yearSelectChange();});
    	
    	//Set the change event for the makes dropdown to populate the models select
    	jQuery("select#"+make_select_id).bind('change', function(){sender.makeSelectChange();});
    	
    	//Set the change event for the models dropdown to populate the trims select
    	jQuery("select#"+model_select_id).bind('change', function(){sender.modelSelectChange();});
    	
    	//Set the change event for the trim dropdown to save the selected trim
    	jQuery("select#"+trim_select_id).bind('change', function(){sender.trimSelectChange();});
    },
    
    initModelData: function(model_data_id)
    {
    	this.model_data_id = model_data_id;
    },
    
    setColorSelect : function(elemId, colorType)
    {
	if(colorType == 'int'){
		this.color_int_select_id = elemId;
		jQuery('#'+this.color_int_select_id).html(this.empty_option_html);
	}
	else if(colorType == 'ext'){
		this.color_ext_select_id = elemId;
		jQuery('#'+this.color_ext_select_id).html(this.empty_option_html);
	}
    },
    
    setFilters: function(args)
    {
    	if(args.keyword != undefined) this.keyword = args.keyword;
    	if(args.min_year != undefined) this.min_year = args.min_year;
        if(args.max_year != undefined) this.max_year = args.max_year;
        if(args.body != undefined) this.body = args.body;
    	if(args.engine_position != undefined) this.engine_position = args.engine_position;
    	if(args.engine_type != undefined) this.engine_type = args.engine_type;
    	if(args.min_cylinders != undefined) this.min_cylinders = args.min_cylinders;
    	if(args.max_cylinders != undefined) this.max_cylinders = args.max_cylinders;
	if(args.min_power != undefined) this.min_power = args.min_power;
    	if(args.max_power != undefined) this.max_power = args.max_power;
	if(args.min_torque != undefined) this.min_torque = args.min_torque;
    	if(args.max_torque != undefined) this.max_torque = args.max_torque;
	if(args.min_top_speed != undefined) this.min_top_speed = args.min_top_speed;
    	if(args.max_top_speed != undefined) this.max_top_speed = args.max_top_speed;
    	if(args.fuel_type != undefined) this.fuel_type = args.fuel_type;
    	if(args.drive != undefined) this.drive = args.drive;
    	if(args.seats != undefined) this.seats = args.seats;
    	if(args.doors != undefined) this.doors = args.doors;
    	if(args.max_weight != undefined) this.max_weight = args.max_weight;
    	if(args.min_weight != undefined) this.min_weight = args.min_weight;
    	if(args.min_lkm_hwy != undefined) this.min_lkm_hwy = args.min_lkm_hwy;
    	if(args.max_lkm_hwy != undefined) this.max_lkm_hwy = args.max_lkm_hwy;
    	
   	if(args.sold_in_us != undefined){
    		if(args.sold_in_us) this.sold_in_us = 1;
    		else this.sold_in_us = -1;
    		
    		//Refresh year select if applicable
    		if(this.year_select_id != "") this.yearSelectChange();
    	}	
    	  
    },
    
    populateTrimList: function(make_id, model_name)
    {
    	//Show the trim data
        jQuery("#"+this.trim_list_id).show();
    
    	//Set a loading message while we retrieve the data
        jQuery("#"+this.trim_list_id).html("<fieldset><p>Model Years / Trims:</p><div class='scrollable'><p>Loading Model Data...</p></div></fieldset>");
        
        //Clear Active Model
        jQuery("#"+this.model_list_id + " a").removeClass('active');
        
        var sender = this;

    	//Get Car Model JSON for the selected make
	jQuery.getJSON(this.base_url+"?callback=?", {cmd:"getTrims", make:make_id, year:-1, model:model_name, sold_in_us:this.sold_in_us, full_results:0}, function(data) {
		
		if(!sender.responseError(data))
		{		
	    		var trims = data.Trims;
	    		var ul = document.createElement('ul');
			
			for (var i = 0; i < trims.length; i++)
			{
				var li = document.createElement('li');
				var a = document.createElement('a');

				var model_id = trims[i].model_id

				jQuery(a).bind('click', {model_id:model_id}, function(event) {
					sender.populateCarDataList(event.data.model_id);
				});

				jQuery(a).html(trims[i].model_year+' '+trims[i].model_name+' '+trims[i].model_trim).attr("href", "javascript:void(0)");

				jQuery(li).append(a);
				jQuery(ul).append(li);

			}
			    
      			var fieldset = document.createElement('fieldset');
			var p = document.createElement('p');
			var div = document.createElement('div');

			jQuery(p).html("Model Years / Trims:");
			jQuery(div).addClass("scrollable");

			jQuery(fieldset).append(p);
			jQuery(p).append(div);
			jQuery(div).append(ul);

			jQuery("#"+sender.trim_list_id).html("");
			jQuery("#"+sender.trim_list_id).append(fieldset);
	        }
    	});
    },
    
    populateModelList: function(make_id)
    {
    	//Make sure list is visible
    	jQuery("#"+this.model_list_id).show();
    	jQuery("#"+this.make_list_id).show();
    
    	//Hide other lists
    	jQuery("#"+this.trim_data_list_id).hide();
    	jQuery("#"+this.trim_list_id).hide();
    	
    
    	//Set a loading message while we retrieve the data
        jQuery("#"+this.model_list_id).html("<fieldset><p>Models:</p><div class='scrollable'><p>Loading Models...</p></div></fieldset>");
        
        //Clear Active Make
        jQuery("#"+this.make_list_id + " a").removeClass('active');
        
        var sender = this;

    	//Get Car Model JSON for the selected make
	jQuery.getJSON(this.base_url+"?callback=?", {cmd:"getModels", make:make_id, sold_in_us:this.sold_in_us}, function(data) {
		
		if(!sender.responseError(data))
		{		
	    		var models = data.Models;
	    		var ul = document.createElement('ul');
			
			for (var i = 0; i < models.length; i++)
			{
				var li = document.createElement('li');
				var a = document.createElement('a');
				
				var make_id = models[i].model_make_id;
				var model_name = models[i].model_name;

				jQuery(a).bind('click', {make: make_id, model:model_name}, function(event) {
					sender.populateTrimList(event.data.make, event.data.model);
					jQuery(this).addClass('active');
				});
				
				jQuery(a).html(models[i].model_name).attr("href", "javascript:void(0)");

				jQuery(li).append(a);
				jQuery(ul).append(li);
			}
      			
      			var fieldset = document.createElement('fieldset');
			var p = document.createElement('p');
			var div = document.createElement('div');

			jQuery(p).html("Models:");
			jQuery(div).addClass("scrollable");

			jQuery(fieldset).append(p);
			jQuery(p).append(div);
			jQuery(div).append(ul);

			jQuery("#"+sender.model_list_id).html("");
			jQuery("#"+sender.model_list_id).append(fieldset);
	        }
    	});
    },
    
    populateMakeList: function()
    {    
    	//Make sure list is visible
    	jQuery("#"+this.make_list_id).show();
    
    	//Hide other lists
    	jQuery("#"+this.trim_data_list_id).hide();
    	jQuery("#"+this.trim_list_id).hide();
    	jQuery("#"+this.model_list_id).hide();
    
	//Set a loading message while we retrieve the data
        jQuery("#"+this.make_list_id).html("<fieldset><p>Makes:</p><div class='scrollable'><p>Loading Makes...</p></div></fieldset>");
            
        var sender = this; 
            
   	//Retrieve All Makes
      	jQuery.getJSON(this.base_url+"?callback=?", {cmd:"getMakes", sold_in_us:this.sold_in_us}, function(data) {
      	
      		if(!sender.responseError(data))
      		{
      			var makes = data.Makes;
      			var ul = document.createElement('ul');
      			
			for (var key in makes)
			{
			   if (makes.hasOwnProperty(key))
			   {
				var li = document.createElement('li');
				var a = document.createElement('a');
				
				var make_id = makes[key].make_id;
				
				jQuery(a).bind('click', {make: make_id}, function(event) {
					sender.populateModelList( event.data.make );
					jQuery(this).addClass('active');
				});
						
				jQuery(a).html(makes[key].make_display).attr("href", "javascript:void(0)");
				
				jQuery(li).append(a);
				jQuery(ul).append(li);
			   }
			}
			
			var fieldset = document.createElement('fieldset');
			var p = document.createElement('p');
			var div = document.createElement('div');
			
			jQuery(p).html("Makes:");
			jQuery(div).addClass("scrollable");
			
			jQuery(fieldset).append(p);
			jQuery(p).append(div);
			jQuery(div).append(ul);
			
			jQuery("#"+sender.make_list_id).html("");
			jQuery("#"+sender.make_list_id).append(fieldset);
        	}
        });
    },
    
    populateYearSelect: function()
    {    
    	//Set a loading message while we retrieve the data
    	jQuery("select#"+this.year_select_id).html("<option value=''>Loading Years...</option>");
        
        var sender = this;
           
        jQuery.getJSON(this.base_url+"?callback=?", {cmd:"getYears"}, function(data) {
    
    	if(!sender.responseError(data))
    	{
        	var options = sender.empty_option_html;
        	
        	//Set min and max year range
        	var minYear = data.Years.min_year;
        	var maxYear = data.Years.max_year;
        	
        	if(sender.year_select_min != null && minYear < sender.year_select_min )
        		minYear = sender.year_select_min;
        	if(sender.year_select_max != null && maxYear > sender.year_select_max )
        		maxYear = sender.year_select_max;
        	
        	for (var i = maxYear; i >= minYear; i--)
        	{
          		options += '<option value="' + i + '">' + i + '</option>';
        	}
    	
    		jQuery("select#"+sender.year_select_id).html(options);
    		
    		jQuery("select#"+sender.make_select_id).html(sender.empty_option_html);
		jQuery("select#"+sender.model_select_id).html(sender.empty_option_html);
		
		
		if(sender.settings.year != null)
		{
    			jQuery('select#'+sender.year_select_id).val(sender.settings.year);
    			sender.yearSelectChange();
    		}
    	}
    	
    	});
    },
    
    populateAttributeSelect: function(elemId, fieldName)
    {    
    	//Set a loading message while we retrieve the data
    	jQuery('#'+elemId).html("<option value='-1'>Loading...</option>");
    	
    	var sender = this;
        
        jQuery.getJSON(this.base_url+"?callback=?", {cmd:"GetFieldValues", field_name:fieldName}, function(data) {

    	if(!sender.responseError(data))
    	{
        	var options = '<option value="">Any</option>';
        	
        	for (var i = 0; i < data.Values.length; i++)
    		{
    		     if(data.Values[i].value != null)
          	    	options += '<option>' + data.Values[i].value + '</option>';
        	}
    	
    		jQuery('#'+elemId).html(options);
    	}
    	
    	});
    },
    
    populateYearFilter: function(elemId)
    {    
    	//Set a loading message while we retrieve the data
    	jQuery('#'+elemId).html("<option value='-1'>Loading Years...</option>");
        
        var sender = this;
        
        jQuery.getJSON(this.base_url+"?callback=?", {cmd:"getYears"}, function(data) {
    
    	if(!sender.responseError(data))
    	{
        	var options = '<option value="-1">Any</option>';
        	
        	for (var i = data.Years.max_year; i >= data.Years.min_year; i--)
        	{
          	    options += '<option value="' + i + '">' + i + '</option>';
        	}
    	
    		jQuery('#'+elemId).html(options);
    	}
    	});
    		
    },
    
    populateMakeSelect: function(data)
    {
	if(!this.responseError(data))
	{
    	   	var options = '<option value="">Please choose a make</option>';
		var makes = data.Makes;
		for (var key in makes)
		{
	   	   if (makes.hasOwnProperty(key))
	   	   {
	   	   	var s = '';
	   	   	if(this.settings.make != null && this.settings.make == makes[key].make_id) s = 'selected="selected"';
	   	   
			options += '<option value="' + makes[key].make_id + '" '+s+'>' + makes[key].make_display + '</option>';
		   }
		}
	
		jQuery("select#"+this.make_select_id).html(options);
	}
    },
    
    populateModelSelect: function(data)
    {    
    	var models = data.Models;
    
        var options = '';
        for (var i = 0; i < models.length; i++)
        {
           var s = '';
	   if(this.settings.model != null && this.settings.model == models[i].model_name) s = 'selected="selected"';
        
           options += '<option value="' + models[i].model_name + '" '+s+'>' + models[i].model_name + '</option>';
        }
    
      	jQuery("select#"+this.model_select_id).html(options);
    },
    
    populateTrimSelect: function(data)
    {    
        var trims = data.Trims;
        var display;
        
        var options = '';
        for (var i = 0; i < trims.length; i++)
        {
        	var s = '';
	   	if(this.settings.trim != null && this.settings.trim == trims[i].model_id) s = 'selected="selected"';
        
        	trim_display = trims[i].model_trim;
        	if(trim_display == "") trim_display = this.default_trim_name;
        		
         	options += '<option value="' + trims[i].model_id + '" '+s+'>' +  trim_display + '</option>';
        }
        
      	jQuery("select#"+this.trim_select_id).html(options);
      	
      	this.cur_trim = jQuery("select#"+this.trim_select_id).val();
      	
	//If we have set color option dropdowns, populate them
	if(this.color_int_select_id != null || this.color_ext_select_id != null)
	this.populateColorSelects(this.cur_trim);
    },
    
    carColorHTML : function(colorData)
    {
    	var out = '';
        
        if(colorData.length == 0) return 'Not Available';
        
        for (var i = 0; i < colorData.length; i++)
        {
             out += colorData[i].color_name + '<br/>';
        }
    	
    	return out;
    },
    
    carDataHTML : function(data)
    {
    	var sold_in_us = "No";
    	if(data.model_sold_in_us == "1") sold_in_us = "Yes";
    
	var out = '<table class="model-data">';
    		
    	out += '<tr><th colspan="2">'+data.model_year+' '+data.make_display+' '+data.model_name+' '+data.model_trim+'</th></tr>';
    		
    	out += '<tr><td colspan="2"><hr/></td></tr>';	
    	out += '<tr><td>Country of Origin:</td><td>'+data.make_country+'</td></tr>';
    	out += '<tr><td>Sold in US:</td><td>'+sold_in_us+'</td></tr>';
    	out += '<tr><td>Body Style:</td><td>'+data.model_body+'</td></tr>';
    	
    	//Output Color Data
    	out += '<tr><td colspan="2"><hr/></td></tr>';
    	out += '<tr><td valign="top">Exterior Colors:</td><td>';
    	out += this.carColorHTML(data.ExtColors) + '</td></tr>';
    	out += '<tr><td valign="top">Interior Colors:</td><td>';
    	out += this.carColorHTML(data.IntColors) + '</td></tr>';
    		
    	out += '<tr><td colspan="2"><hr/></td></tr>';
    	out += '<tr><td>Engine Location:</td><td>'+data.model_engine_position+'</td></tr>';
    	out += '<tr><td>Engine Type:</td><td>'+data.model_engine_type+'</td></tr>';
    	out += '<tr><td>Engine Cylinders:</td><td>'+data.model_engine_cyl+'</td></tr>';
    	out += '<tr><td>Engine Displacement (cc):</td><td>'+data.model_engine_cc+'</td></tr>';
    	out += '<tr><td>Engine Displacement (l):</td><td>'+data.model_engine_l+'</td></tr>';
    	out += '<tr><td>Engine Displacement (cubic inches):</td><td>'+data.model_engine_ci+'</td></tr>';
    	out += '<tr><td>Engine Bore (mm):</td><td>'+data.model_engine_bore_mm+'</td></tr>';
    	out += '<tr><td>Engine Bore (in):</td><td>'+data.model_engine_bore_in+'</td></tr>';
    	out += '<tr><td>Engine Stroke (mm):</td><td>'+data.model_engine_stroke_mm+'</td></tr>';
    	out += '<tr><td>Engine Stroke (in):</td><td>'+data.model_engine_stroke_in+'</td></tr>';
    	out += '<tr><td>Engine Valves Per Cylinder:</td><td>'+data.model_engine_valves_per_cyl+'</td></tr>';
    	out += '<tr><td>Engine Valves:</td><td>'+data.model_engine_valves+'</td></tr>';
    	out += '<tr><td>Engine Max Power (HP):</td><td>'+data.model_engine_power_hp+'</td></tr>';
    	out += '<tr><td>Engine Max Power (PS):</td><td>'+data.model_engine_power_ps+'</td></tr>';
    	out += '<tr><td>Engine Max Power (kW):</td><td>'+data.model_engine_power_kw+'</td></tr>';
    	out += '<tr><td>Engine Max Power RPM:</td><td>'+data.model_engine_power_rpm+'</td></tr>';
    	out += '<tr><td>Engine Max Torque (Nm):</td><td>'+data.model_engine_torque_nm+'</td></tr>';
    	out += '<tr><td>Engine Max Torque (Lb-Ft):</td><td>'+data.model_engine_torque_lbft+'</td></tr>';
    	out += '<tr><td>Engine Max Torque (kgf-m):</td><td>'+data.model_engine_torque_kgm+'</td></tr>';
    	out += '<tr><td>Engine Max Torque RPM:</td><td>'+data.model_engine_torque_rpm+'</td></tr>';
    	out += '<tr><td>Engine Compression Ratio:</td><td>'+data.model_engine_compression+'</td></tr>';
    	out += '<tr><td>Engine Fuel Type:</td><td>'+data.model_engine_fuel+'</td></tr>';
    		
    	out += '<tr><td colspan="2"><hr/></td></tr>';
    	out += '<tr><td>Drive:</td><td>'+data.model_drive+'</td></tr>';
    	out += '<tr><td>Transmission Type:</td><td>'+data.model_transmission_type+'</td></tr>';
    	out += '<tr><td>Top Speed (KPH):</td><td>'+data.model_top_speed_kph+'</td></tr>';
    	out += '<tr><td>Top Speed (MPH):</td><td>'+data.model_top_speed_mph+'</td></tr>';
    	out += '<tr><td>0-100 kph (0-62mph):</td><td>'+data.model_0_to_100_kph+'</td></tr>';
    		
    	out += '<tr><td colspan="2"><hr/></td></tr>';
    	out += '<tr><td>Doors:</td><td>'+data.model_doors+'</td></tr>';
    	out += '<tr><td>Seats:</td><td>'+data.model_seats+'</td></tr>';
    	out += '<tr><td>Weight (kg):</td><td>'+data.model_weight_kg+'</td></tr>';
    	out += '<tr><td>Weight (lbs):</td><td>'+data.model_weight_lbs+'</td></tr>';
    	out += '<tr><td>Length (mm):</td><td>'+data.model_length_mm+'</td></tr>';
    	out += '<tr><td>Length (in):</td><td>'+data.model_length_in+'</td></tr>';
    	out += '<tr><td>Width (mm):</td><td>'+data.model_width_mm+'</td></tr>';
    	out += '<tr><td>Width (in):</td><td>'+data.model_width_in+'</td></tr>';
    	out += '<tr><td>Height (mm):</td><td>'+data.model_height_mm+'</td></tr>';
    	out += '<tr><td>Height (in):</td><td>'+data.model_height_in+'</td></tr>';
    	out += '<tr><td>Wheelbase (mm):</td><td>'+data.model_wheelbase_mm+'</td></tr>';
    	out += '<tr><td>Wheelbase (in):</td><td>'+data.model_wheelbase_in+'</td></tr>';
    	out += '<tr><td>Fuel Economy City(l/100km):</td><td>'+data.model_lkm_city+'</td></tr>';
    	out += '<tr><td>Fuel Economy City(mpg):</td><td>'+data.model_mpg_city+'</td></tr>';
    	out += '<tr><td>Fuel Economy HWY(l/100km):</td><td>'+data.model_lkm_hwy+'</td></tr>';
    	out += '<tr><td>Fuel Economy HWY(mpg):</td><td>'+data.model_mpg_hwy+'</td></tr>';
    	out += '<tr><td>Fuel Economy Mixed(l/100km):</td><td>'+data.model_lkm_mixed+'</td></tr>';
    	out += '<tr><td>Fuel Economy Mixed(mpg):</td><td>'+data.model_mpg_mixed+'</td></tr>';
    	out += '<tr><td>Fuel Capacity(l):</td><td>'+data.model_fuel_cap_l+'</td></tr>';
    	out += '<tr><td>Fuel Capacity(g):</td><td>'+data.model_fuel_cap_g+'</td></tr>';
    		
    	out += '</table>';
    		
    	out = out.replace(/>null</g, ">Not Available<");
    		
    	return out;
    },
   
    populateCarDataList : function(model_id)
    {
    	//Show this list
    	jQuery("#"+this.trim_data_list_id).show();
    
    	//Hide the lists
    	jQuery("#"+this.trim_list_id).hide();
    	jQuery("#"+this.model_list_id).hide();
    	jQuery("#"+this.make_list_id).hide();
    
    	//Set loading message
    	jQuery("#"+this.trim_data_list_id).html('Loading Model Data...');
    	
    	var sender = this;
    	 
    	//Get Car Model JSON for the selected make
	jQuery.getJSON(this.base_url+"?callback=?", {cmd:"getModel", model:model_id}, function(data) {
	
	    if(!sender.responseError(data))
	    {
	        var out = '<div class="car_data_breadcrumbs"><a href="javascript:void()" onclick="jQuery(\'#'+sender.trim_data_list_id+'\').hide();jQuery(\'#'+sender.make_list_id+'\').show();jQuery(\'#'+sender.model_list_id+'\').show();">'+data[0].make_display+'</a> > ';
	        out +=	  '<a href="javascript:void()"  onclick="jQuery(\'#'+sender.trim_data_list_id+'\').hide();jQuery(\'#'+sender.make_list_id+'\').show();jQuery(\'#'+sender.model_list_id+'\').show();jQuery(\'#'+sender.trim_list_id+'\').show();">'+data[0].model_name+'</a></div><fieldset>';
	    
	   	out += sender.carDataHTML(data[0]) + '</fieldset>';
	   
	       	jQuery("#"+sender.trim_data_list_id).html(out);
	    }
        });
    },
    
    populateCarData : function(model_data_id)
    {
    	this.model_data_id = model_data_id;
	this.cur_trim = jQuery("select#"+this.trim_select_id).val();
	
	//Make sure there is a trim selected
	if(this.cur_trim == null || this.cur_trim == "")
	{
		jQuery("#"+this.model_data_id).html("");
		alert('Please select a year, make, and model.');
		return;
	}
    	
 	//Set a loading message while we retrieve the data
        jQuery("#"+this.model_data_id).html("Loading Model Data...");

        var sender = this;
        
        //Get Car Model JSON for the selected make
    	jQuery.getJSON(this.base_url+"?callback=?", {cmd:"getModel", model:this.cur_trim}, function(data) {
    	
    	if(!sender.responseError(data))
    	{
    		var out = sender.carDataHTML(data[0]);
        	
        	jQuery("#"+sender.model_data_id).html(out);
        }
        });
    },
    
    populateSearchResult : function(model_id)
    {
    	this.cur_trim = model_id;
    
     	//Set a loading message while we retrieve the data
     	jQuery("#"+this.search_controls_id).hide();
     	jQuery("#"+this.search_result_id).show();
        jQuery("#"+this.search_result_id).html("Loading Model Data...");
        
        var sender = this;
            
        //Get Car Model JSON for the selected make
       	jQuery.getJSON(this.base_url+"?callback=?", {cmd:"getModel", model:this.cur_trim}, function(data) {
     	
       	  if(!sender.responseError(data))
       	  {
       		var out = '<b><a href="javascript:void()" onclick="jQuery(\'#'+sender.search_result_id+'\').hide();jQuery(\'#'+sender.search_controls_id+'\').show();">Back to Search Results</a></b>';       		
       		out += '<fieldset>' + sender.carDataHTML(data[0]) + '</fieldset>'; 
            	jQuery("#"+sender.search_result_id).html(out);
          }
        });
    },
    
    loadSettings : function (c_name)
    {
	var i,x,y,ARRcookies=document.cookie.split(";");
	var cookie = '';
	
	for (i=0;i<ARRcookies.length;i++)
	{
		x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
		y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
		x=x.replace(/^\s+|\s+jQuery/g,"");
		if (x==c_name) {
			cookie = unescape(y);
			break;
		}
 	}
 	this.settings = new Object();
 	if(cookie != '') this.settings = jQuery.parseJSON(cookie); 
 		
    },

    saveSetting : function(setting, value)
    {   
    	//JSON library is required to manage settings
    	if(typeof JSON == 'undefined') return;
    
    	this.settings[setting] = value;
	document.cookie = this.cookie_name + "=" + JSON.stringify(this.settings);
    },
    
    yearSelectChange: function ()
    {        
        this.cur_year = jQuery("select#"+this.year_select_id).val();
        
        //Set Cookie to save year selection
        this.saveSetting('year', this.cur_year);
        
         //if no year supplied, clear makes, models, return;
	if(this.cur_year == "")
	{
		jQuery("select#"+this.make_select_id).html(this.empty_option_html);
		jQuery("select#"+this.model_select_id).html(this.empty_option_html);
		jQuery("select#"+this.trim_select_id).html(this.empty_option_html);
	    	return;
    	}
    	
    	 //Set a loading message while we retrieve the data
        jQuery("select#"+this.make_select_id).html("<option value=''>Loading Makes...</option>");
        
        var sender = this;
        
        //Get Car Model JSON for the selected make
    	jQuery.getJSON(this.base_url+"?callback=?", {cmd:"getMakes", year:this.cur_year, sold_in_us:this.sold_in_us}, function(data) {
    	
    	if(!sender.responseError(data))
    	{
        	sender.populateMakeSelect(data);
        	sender.makeSelectChange();
        }
        });
    },
    
    makeSelectChange: function ()
    {
    	this.cur_make = jQuery("select#"+this.make_select_id).val();
    	
    	//If value has been selected, save make selection
    	if(this.cur_make != "" && this.cur_make != null)
        	this.saveSetting('make', this.cur_make);
    	
    	//if no make supplied, clear models, return;
    	if(this.cur_make == "")
    	{
    		jQuery("select#"+this.model_select_id).html(this.empty_option_html);
			jQuery("select#"+this.trim_select_id).html(this.empty_option_html);
    		return;
    	}
    
    	//Set a loading message while we retrieve the data
    	jQuery("select#"+this.model_select_id).html("<option value=''>Loading Models...</option>");
    
    	var sender = this;
    
    	//Get Car Model JSON for the selected make
	jQuery.getJSON(this.base_url+"?callback=?", {cmd:"getModels", make:this.cur_make, year:this.cur_year, sold_in_us:this.sold_in_us}, function(data) {
	
		if(!sender.responseError(data))
		{
    			sender.populateModelSelect(data);
			
        		sender.cur_model = jQuery('select#'+sender.model_select_id).val();
        		
        		//Re-populate the trim select
        		sender.modelSelectChange();
        	}
    	});
    },
    
    modelSelectChange: function ()
    {
        this.cur_model = jQuery("select#"+this.model_select_id).val();
        
        //If value has been selected, save model selection
        if(this.cur_model != "" && this.cur_model != null)
        	this.saveSetting('model', this.cur_model);

        //If there is no trim select, we don't need to do anything else here
        if(this.trim_select_id == '' || this.trim_select_id == null) return;
        	
        //if no model supplied, clear trim, return;
        if(this.cur_model == "")
        {
        	jQuery("select#"+this.trim_select_id).html(this.empty_option_html);
        	return;
        }
        
        //Set a loading message while we retrieve the data
        jQuery("select#"+this.trim_select_id).html("<option value=''>Loading Trims...</option>");
        
        var sender = this;
        
        //Get Car Model JSON for the selected make
    	jQuery.getJSON(this.base_url+"?callback=?", {cmd:"getTrims", make:this.cur_make, year:this.cur_year, model:this.cur_model, sold_in_us:this.sold_in_us, full_results:0 }, function(data) {
    	
    		if(!sender.responseError(data))
        		sender.populateTrimSelect(data);
    		
            	sender.cur_trim = jQuery('select#'+sender.trim_select_id).val();
        });
    },
    
    trimSelectChange: function ()
    {
    	this.cur_trim = jQuery("select#"+this.trim_select_id).val();

	//If value has been selected, save trim selection
	if(this.cur_trim != "" && this.cur_trim != null)
		this.saveSetting('trim', this.cur_trim);
	    
	//If we have set color option dropdowns, populate them
    	if(this.color_int_select_id != null || this.color_ext_select_id != null)
    		this.populateColorSelects(this.cur_trim);
    },
    
    populateColorSelects: function(model_id)
    {
    	var sender = this;
    
    	jQuery.getJSON(this.base_url+"?callback=?", {cmd:"getModel", model:model_id}, function(data) {
		
	    if(!sender.responseError(data))
	    {
	    	var intColors = data[0].IntColors;
	    	var extColors = data[0].ExtColors;
		var outInt = sender.empty_option_html;
		var outExt = sender.empty_option_html;

		for (var i = 0; i < intColors.length; i++)
        	{
		    outInt += "<option value=\""+intColors[i].color_id+"\">"+intColors[i].color_name+"</option>";
		}
		
		for (var i = 0; i < extColors.length; i++)
		{
		    outExt += "<option value=\""+extColors[i].color_id+"\">"+extColors[i].color_name+"</option>";
		}

		if(sender.color_int_select_id != null) jQuery('#'+sender.color_int_select_id).html(outInt);
		if(sender.color_ext_select_id != null) jQuery('#'+sender.color_ext_select_id).html(outExt); 
	    }	    
        });
        
        
    },
    
    responseError: function (data)
    {
    	if(typeof data.error != 'undefined' && data.error != '')
	{
	 	alert(data.error);
		return true;
	}
	else
		return false;
    }
}

if (typeof jQuerytmp != 'undefined') var jQuery = jQuerytmp;/*******************************************************************/
/* carquery.0.3.4.js 						   */
/* javascript object for interacting with the CarQuery JSON API    */
/* Copyright (C) 2011  Daniel Mancusi (dan@carqueryapi.com)   	   */
/* http://www.carqueryapi.com					   */
/* 								   */
/* This program is free software; you can redistribute it and/or   */
/* modify it under the terms of the GNU General Public License     */
/* as published by the Free Software Foundation; either version 2  */
/* of the License, or (at your option) any later version.          */
/* 								   */
/* This code is distributed in the hope that it will be useful,    */
/* but WITHOUT ANY WARRANTY; without even the implied warranty of  */
/* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the   */
/* GNU General Public License for more details.			   */
/*******************************************************************/

//If jQuery is being used instead of jQuery temporarily re-assign the variable name
if(typeof jQuery == 'function')
{
	//If jQuery is already in use by something else, save it, and restore it when carquery is done.
	if (typeof jQuery != 'undefined')
		var jQuerytmp = jQuery;
		
	var jQuery = jQuery;
}

var CarQuery = function(){}

CarQuery.prototype = {

    base_url: 		"http://www.carqueryapi.com/api/0.3/",
    body:		"",
    body_id:		"cq-body",
    color_ext_select_id:null,
    color_int_select_id:null,
    cookie_name:	"cq-settings",
    cur_make: 		"",      
    cur_model: 		"",      
    cur_trim: 		"",  
    cur_year: 		"",
    default_trim_name:	"None",
    doors: 		"",   
    doors_id: 		"cq-doors",  
    drive: 		"",
    drive_id: 		"cq-drive",    
    empty_option_html: 	"<option value=''>---</option>",    
    engine_position_id: "cq-engine-position",    
    engine_type_id: 	"cq-engine-type",    
    engine_type: 	"",    
    fuel_type_id: 	"cq-fuel-type",    
    fuel_type: 		"",    
    keyword: 		"",    
    make_list_id: 	"",    
    make_select_id: 	"",    
    max_cylinders: 	"",    
    max_cylinders_id: 	"cq-max-cylinders",    
    max_lkm_hwy: 	"",       
    max_mpg_hwy_id: 	"cq-max-mpg-hwy",    
    max_power: 		"",           
    max_power_id: 	"cq-max-power",   
    max_top_speed: 	"",   
    max_top_speed_id: 	"cq-max-top-speed",    
    max_torque: 	"",                
    max_torque_id: 	"cq-max-torque",
    max_weight:		"",    
    max_weight_id: 	"cq-max-weight",    
    max_year: 		"",    
    max_year_id: 	"cq-max-year",    
    min_cylinders:	"",
    min_cylinders_id: 	"cq-min-cylinders",    
    min_lkm_hwy: 	"",    
    min_mpg_hwy_id: 	"cq-min-mpg-hwy",   
    min_power: 		"",        
    min_power_id: 	"cq-min-power",    
    min_top_speed: 	"",        
    min_top_speed_id: 	"cq-min-top-speed",    
    min_torque: 	"",                    
    min_torque_id: 	"cq-min-torque",        
    min_weight: 	"",    
    min_weight_id: 	"cq-min-weight",    
    min_year: 		"",
    min_year_id: 	"cq-min-year",    
    model_data_id: 	"",
    model_list_id: 	"",    
    model_select_id: 	"",
    search_controls_id:	"cq-search-controls",    
    search_input_id: 	"cq-search-input",    
    search_result_id: 	"cq-search-result",        
    search_results_id: 	"cq-search-results",    
    seats: 		"",
    seats_id: 		"cq-seats",
    settings:		null,
    sold_in_us: 	"",        
    sold_in_us_id: 	"cq-sold-in-us",    
    trim_data_list_id: 	"",    
    trim_list_id: 	"",    
    trim_select_id: 	"",      
    year_select_id: 	"",
    year_select_min:	null,
    year_select_max:	null,
    
    init : function(year, make_id, model, trim)
    {
	jQuery.ajaxSetup({
	  "error":function() {   
	    alert('Bad Response from CarQuery API.\nThe service may not be avilable at this time.');
	}});
	
	//Check if initial values were set
	this.settings = new Object();
	if(year != null)
		this.saveSetting('year', year);
	if(make_id != null)
		this.saveSetting('make', make_id);
	if(model != null)
		this.saveSetting('model', model);
	if(trim != null)
		this.saveSetting('trim', trim);
	
	//Load settings from cookie if it exists
	this.loadSettings(this.cookie_name);
    },
    
    initSearchInterface : function(args)
    {
    	//allow for no argument
    	if(args == null) args = ({});
    
    	//Set ids for the search elements
    	
    	if(args.search_controls_id != null) this.search_controls_id = args.search_controls_id;
    	if(args.search_results_id != null) this.search_results_id = args.search_results_id;
    	if(args.search_result_id != null) this.search_result_id = args.search_result_id;
    	
    	var sender = this;
    	
    	//SEARCH KEYWORD INPUT
    	if(args.search_input_id != null) this.search_input_id = args.search_input_id;
	jQuery("#"+this.search_input_id).val(args.default_search_text);  
	jQuery("#"+this.search_input_id).focus(function() {
		jQuery(this).css("color", "#333");
		if(this.value == args.default_search_text) this.value = "";
	});
	jQuery("#"+this.search_input_id).keyup(function() {
		sender.setFilters( {keyword:this.value} );
	});
	
	
	//SOLD IN US
    	if(args.sold_in_us_id != null) this.sold_in_us_id = args.sold_in_us_id;
    	jQuery("#"+this.sold_in_us_id).click(function() {
		sender.setFilters( {sold_in_us:this.checked} );
	});
    	
    	
    	//YEAR FILTERS
    	if(args.min_year_id != null) this.min_year_id = args.min_year_id;
    	if(args.max_year_id != null) this.max_year_id = args.max_year_id;
    	jQuery("#"+this.min_year_id).change(function() {
		sender.setFilters( {min_year:this.value} );
	});
	jQuery("#"+this.max_year_id).change(function() {
		sender.setFilters( {max_year:this.value} );
	});
    	this.populateYearFilter(this.min_year_id);
    	this.populateYearFilter(this.max_year_id);
    	
    	
    	//ENGINE POSITION
    	if(args.engine_position_id != null) this.engine_position_id = args.engine_position_id;
    	jQuery("#"+this.engine_position_id).change(function() {
		sender.setFilters( {engine_position:this.value} );
	});
	this.populateAttributeSelect(this.engine_position_id, 'model_engine_position');
	
	
	//BODY STYLE
    	if(args.body_id != null) this.body_id = args.body_id;
    	jQuery("#"+this.body_id).change(function() {
		sender.setFilters( {body:this.value} );
	});
	this.populateAttributeSelect(this.body_id, 'model_body');
		
	
	//CYLINDERS
	if(args.min_cylinders_id != null) this.min_cylinders_id = args.min_cylinders_id;
	if(args.max_cylinders_id != null) this.max_cylinders_id = args.max_cylinders_id;
	jQuery("#"+this.max_cylinders_id).change(function() {
		sender.setFilters( {max_cylinders:this.value} );
	});
	jQuery("#"+this.min_cylinders_id).change(function() {
		sender.setFilters( {min_cylinders:this.value} );
	});
	this.populateAttributeSelect(this.max_cylinders_id, 'model_engine_cyl');
	this.populateAttributeSelect(this.min_cylinders_id, 'model_engine_cyl');
	
	
	//POWER
	if(args.min_power_id != null) this.min_power_id = args.min_power_id;
	if(args.max_power_id != null) this.max_power_id = args.max_power_id;
        //Convert to PS
	jQuery("#"+this.max_power_id).keyup(function() {
		var val = "";
		if(this.value != "") val = Math.round(this.value  * 1.01387);
		sender.setFilters( {max_power:val } );
	});
	jQuery("#"+this.min_power_id).keyup(function() {
		var val = "";
		if(this.value != "") val = Math.round(this.value  * 1.01387);
		sender.setFilters( {min_power:val }  );
	});
	
	
	//TORQUE
	if(args.min_torque_id != null) this.min_torque_id = args.min_torque_id;
	if(args.max_torque_id != null) this.max_torque_id = args.max_torque_id;
        //Convert to NM
	jQuery("#"+this.max_torque_id).keyup(function() {
	
		var val = "";
		if(this.value != "") val = Math.round(this.value / 0.7384);
		sender.setFilters( {max_torque:val } );
	});
	jQuery("#"+this.min_torque_id).keyup(function() {
		var val = "";
		if(this.value != "") val = Math.round(this.value / 0.7384);
		sender.setFilters( {min_torque:val }  );
	});	

	
	//TOP SPEED
	if(args.min_top_speed_id != null) this.min_top_speed_id = args.min_top_speed_id;
	if(args.max_top_speed_id != null) this.max_top_speed_id = args.max_top_speed_id;
	//Convert to KMH
	jQuery("#"+this.max_top_speed_id).keyup(function() {
		var val = "";
		if(this.value != "") val = Math.round(this.value  * 1.609);
		sender.setFilters( {max_top_speed:val } );
	});
	jQuery("#"+this.min_top_speed_id).keyup(function() {
		var val = "";
		if(this.value != "") val = Math.round(this.value  * 1.609);
		sender.setFilters( {min_top_speed:val } );
	});
	
	
	//ENGINE TYPE
    	if(args.engine_type_id != null) this.engine_type_id = args.engine_type_id;
    	jQuery("#"+this.engine_type_id).change(function() {
		sender.setFilters( {engine_type:this.value} );
	});
	this.populateAttributeSelect(this.engine_type_id, 'model_engine_type'); 
	
	
	//FUEL TYPE
    	if(args.fuel_type_id != null) this.fuel_type_id = args.fuel_type_id;
    	jQuery("#"+this.fuel_type_id).change(function() {
		sender.setFilters( {fuel_type:this.value} );
	});
	this.populateAttributeSelect(this.fuel_type_id, 'model_engine_fuel');
	
	
	//DRIVETRAIN
	if(args.drive_id != null) this.drive_id = args.drive_id;
	jQuery("#"+this.drive_id).change(function() {
		sender.setFilters( {drive:this.value} );
	});
	this.populateAttributeSelect(this.drive_id, 'model_drive');
	
	//SEATS
	if(args.seats_id != null) this.seats_id = args.seats_id;
	jQuery("#"+this.seats_id).change(function() {
		sender.setFilters( {seats:this.value} );
	});
	this.populateAttributeSelect(this.seats_id, 'model_seats');
	
	
	//DOORS
	if(args.doors_id != null) this.doors_id = args.doors_id;	
	jQuery("#"+this.doors_id).change(function() {
		sender.setFilters( {doors:this.value} );
	});
	this.populateAttributeSelect(this.doors_id, 'model_doors');
	
	
	//WEIGHT
	if(args.min_weight_id != null) this.min_weight_id = args.min_weight_id;
	if(args.max_weight_id != null) this.max_weight_id = args.max_weight_id;
        //Convert to KG
	jQuery("#"+this.max_weight_id).keyup(function() {
	
		var val = "";
		if(this.value != "") val = Math.round(this.value * 0.4536);
		sender.setFilters( {max_weight:val } );
	});
	jQuery("#"+this.min_weight_id).keyup(function() {
		var val = "";
		if(this.value != "") val = Math.round(this.value * 0.4536);
		sender.setFilters( {min_weight:val }  );
	});
	
	
	//MPG
	if(args.min_mpg_hwy_id != null) this.min_mpg_hwy_id = args.min_mpg_hwy_id;
	if(args.max_mpg_hwy_id != null) this.max_mpg_hwy_id = args.max_mpg_hwy_id;
        //Convert to LKM (NOTE: lower lkm = higher mpg)
	jQuery("#"+this.max_mpg_hwy_id).keyup(function() {
	
		var val = "";
		if(this.value != "") val = 235.2 / this.value;
		sender.setFilters( {min_lkm_hwy:val } );  
	});
	jQuery("#"+this.min_mpg_hwy_id).keyup(function() {
		var val = "";
		if(this.value != "") val = 235.2 / this.value;
		sender.setFilters( {max_lkm_hwy:val }  );
	});	
	
	
	//Limit Input Lengths
	jQuery( "#"+this.max_power_id + 
	  ',#'+this.min_power_id +
	  ',#'+this.max_top_speed_id +
	  ',#'+this.min_top_speed_id +
	  ",#"+this.max_torque_id +
	  ',#'+this.min_torque_id +
	  ',#'+this.max_weight_id +
	  ',#'+this.min_weight_id +
	  ',#'+this.max_mpg_hwy_id +
	  ',#'+this.min_mpg_hwy_id
	  ).attr('maxLength','5');
	
	
	//Force numerical only inputs
	jQuery( "#"+this.max_power_id + 
	  ',#'+this.min_power_id +
	  ',#'+this.max_top_speed_id +
	  ',#'+this.min_top_speed_id +
	  ",#"+this.max_torque_id +
	  ',#'+this.min_torque_id +
	  ',#'+this.max_weight_id +
	  ',#'+this.min_weight_id +
	  ',#'+this.max_mpg_hwy_id +
	  ',#'+this.min_mpg_hwy_id
	).keydown(function() {
		if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 ) && event.keyCode != 46 && event.keyCode != 8 && event.keyCode != 9)
	            event.preventDefault(); 
        });
    },
    
    search: function()
    {
    	jQuery('#'+this.search_results_id).html("Loading Results...");
    	
    	var sender = this;

   	 //Get Car Model JSON for the search criteria
    	jQuery.getJSON(this.base_url+"?callback=?", {
    	
    		 cmd:"getTrims"
    		,body:this.body
    		,doors:this.doors
    		,drive:this.drive
    		,engine_position:this.engine_position
    		,engine_type:this.engine_type
    		,fuel_type:this.fuel_type
    		,keyword:this.keyword
    		,min_cylinders:this.min_cylinders
    		,min_lkm_hwy:this.min_lkm_hwy
    		,min_power:this.min_power
    		,min_top_speed:this.min_top_speed
    		,min_torque:this.min_torque
    		,min_weight:this.min_weight
    		,min_year:this.min_year
    		,max_cylinders:this.max_cylinders
    		,max_lkm_hwy:this.max_lkm_hwy
    		,max_power:this.max_power
    		,max_top_speed:this.max_top_speed
    		,max_torque:this.max_torque
    		,max_weight:this.max_weight
    		,max_year:this.max_year
    		,seats:this.seats
    		,sold_in_us:this.sold_in_us
    		,full_results:0
    		
    	  }, function(data) {
    		
    	  if(!sender.responseError(data))
    	  {		
    	    	var trims = data.Trims;
    	    	var numResults = data.Trims.length;
    	    	var ul = document.createElement('ul');
    	    	var msg = '';
    	    	
    	    	if(numResults > 0)
    			msg = 'Showing ' + numResults + ' results:';
    		else
    			msg = 'No Matching Vehicles Found';
    			
    		for (var i = 0; i < trims.length; i++)
    		{	
 			var li = document.createElement('li');
			var a = document.createElement('a');

			var model_id = trims[i].model_id;

			jQuery(a).bind('click', {model_id:model_id}, function(event) {
				sender.populateSearchResult(event.data.model_id);
			});

			jQuery(a).html(trims[i].model_year + ' ' + trims[i].make_display + ' ' + trims[i].model_name + ' ' + trims[i].model_trim).attr("href", "javascript:void(0)");

			jQuery(li).append(a);
			jQuery(ul).append(li);
    		}

		var p = document.createElement('p');
		var div = document.createElement('div');

		jQuery(p).html(msg);
		jQuery(div).addClass("scrollable");
		jQuery(div).append(ul);

		jQuery("#"+sender.search_results_id).html("");
		jQuery("#"+sender.search_results_id).append(p);
		jQuery("#"+sender.search_results_id).append(div);	
	  }
	});
    },
    
    initMakeModelTrimList: function(make_list_id, model_list_id, trim_list_id, trim_data_list_id)
    {
        //Set the ids for the list elements
    	this.make_list_id  	=  make_list_id;
    	this.model_list_id 	=  model_list_id;
    	this.trim_list_id 	=  trim_list_id;
    	this.trim_data_list_id  =  trim_data_list_id;
    	
    	//Populate the make-list
    	this.populateMakeList();
    },
    
    initYearMakeModel: function(year_select_id, make_select_id, model_select_id)
    {
    	//Set the ids for the select elements
	this.year_select_id =  year_select_id;
	this.make_select_id =  make_select_id;
	this.model_select_id = model_select_id;
	
	//Populate the car-years select element
	this.populateYearSelect();
	
	var sender = this;
	
	//Set the change event for the years dropdown to populate the makes select
	jQuery("select#"+year_select_id).bind('change', function(){sender.yearSelectChange();});
	
	//Set the change event for the makes dropdown to populate the models select
	jQuery("select#"+make_select_id).bind('change', function(){sender.makeSelectChange();});
	
	//Set the change event for the models dropdown to save the selected model
    	jQuery("select#"+model_select_id).bind('change', function(){sender.modelSelectChange();});
    },
    
    initYearMakeModelTrim: function(year_select_id, make_select_id, model_select_id, trim_select_id)
    {
        //Set the ids for the select elements
    	this.year_select_id =  year_select_id;
    	this.make_select_id =  make_select_id;
    	this.model_select_id = model_select_id;
    	this.trim_select_id = trim_select_id;    	
    	
    	//Populate the car-years select element
    	this.populateYearSelect();
    	
    	var sender = this;
    	
    	//Set the change event for the years dropdown to populate the makes select
    	jQuery("select#"+year_select_id).bind('change', function(){sender.yearSelectChange();});
    	
    	//Set the change event for the makes dropdown to populate the models select
    	jQuery("select#"+make_select_id).bind('change', function(){sender.makeSelectChange();});
    	
    	//Set the change event for the models dropdown to populate the trims select
    	jQuery("select#"+model_select_id).bind('change', function(){sender.modelSelectChange();});
    	
    	//Set the change event for the trim dropdown to save the selected trim
    	jQuery("select#"+trim_select_id).bind('change', function(){sender.trimSelectChange();});
    },
    
    initModelData: function(model_data_id)
    {
    	this.model_data_id = model_data_id;
    },
    
    setColorSelect : function(elemId, colorType)
    {
	if(colorType == 'int'){
		this.color_int_select_id = elemId;
		jQuery('#'+this.color_int_select_id).html(this.empty_option_html);
	}
	else if(colorType == 'ext'){
		this.color_ext_select_id = elemId;
		jQuery('#'+this.color_ext_select_id).html(this.empty_option_html);
	}
    },
    
    setFilters: function(args)
    {
    	if(args.keyword != undefined) this.keyword = args.keyword;
    	if(args.min_year != undefined) this.min_year = args.min_year;
        if(args.max_year != undefined) this.max_year = args.max_year;
        if(args.body != undefined) this.body = args.body;
    	if(args.engine_position != undefined) this.engine_position = args.engine_position;
    	if(args.engine_type != undefined) this.engine_type = args.engine_type;
    	if(args.min_cylinders != undefined) this.min_cylinders = args.min_cylinders;
    	if(args.max_cylinders != undefined) this.max_cylinders = args.max_cylinders;
	if(args.min_power != undefined) this.min_power = args.min_power;
    	if(args.max_power != undefined) this.max_power = args.max_power;
	if(args.min_torque != undefined) this.min_torque = args.min_torque;
    	if(args.max_torque != undefined) this.max_torque = args.max_torque;
	if(args.min_top_speed != undefined) this.min_top_speed = args.min_top_speed;
    	if(args.max_top_speed != undefined) this.max_top_speed = args.max_top_speed;
    	if(args.fuel_type != undefined) this.fuel_type = args.fuel_type;
    	if(args.drive != undefined) this.drive = args.drive;
    	if(args.seats != undefined) this.seats = args.seats;
    	if(args.doors != undefined) this.doors = args.doors;
    	if(args.max_weight != undefined) this.max_weight = args.max_weight;
    	if(args.min_weight != undefined) this.min_weight = args.min_weight;
    	if(args.min_lkm_hwy != undefined) this.min_lkm_hwy = args.min_lkm_hwy;
    	if(args.max_lkm_hwy != undefined) this.max_lkm_hwy = args.max_lkm_hwy;
    	
   	if(args.sold_in_us != undefined){
    		if(args.sold_in_us) this.sold_in_us = 1;
    		else this.sold_in_us = -1;
    		
    		//Refresh year select if applicable
    		if(this.year_select_id != "") this.yearSelectChange();
    	}	
    	  
    },
    
    populateTrimList: function(make_id, model_name)
    {
    	//Show the trim data
        jQuery("#"+this.trim_list_id).show();
    
    	//Set a loading message while we retrieve the data
        jQuery("#"+this.trim_list_id).html("<fieldset><p>Model Years / Trims:</p><div class='scrollable'><p>Loading Model Data...</p></div></fieldset>");
        
        //Clear Active Model
        jQuery("#"+this.model_list_id + " a").removeClass('active');
        
        var sender = this;

    	//Get Car Model JSON for the selected make
	jQuery.getJSON(this.base_url+"?callback=?", {cmd:"getTrims", make:make_id, year:-1, model:model_name, sold_in_us:this.sold_in_us, full_results:0}, function(data) {
		
		if(!sender.responseError(data))
		{		
	    		var trims = data.Trims;
	    		var ul = document.createElement('ul');
			
			for (var i = 0; i < trims.length; i++)
			{
				var li = document.createElement('li');
				var a = document.createElement('a');

				var model_id = trims[i].model_id

				jQuery(a).bind('click', {model_id:model_id}, function(event) {
					sender.populateCarDataList(event.data.model_id);
				});

				jQuery(a).html(trims[i].model_year+' '+trims[i].model_name+' '+trims[i].model_trim).attr("href", "javascript:void(0)");

				jQuery(li).append(a);
				jQuery(ul).append(li);

			}
			    
      			var fieldset = document.createElement('fieldset');
			var p = document.createElement('p');
			var div = document.createElement('div');

			jQuery(p).html("Model Years / Trims:");
			jQuery(div).addClass("scrollable");

			jQuery(fieldset).append(p);
			jQuery(p).append(div);
			jQuery(div).append(ul);

			jQuery("#"+sender.trim_list_id).html("");
			jQuery("#"+sender.trim_list_id).append(fieldset);
	        }
    	});
    },
    
    populateModelList: function(make_id)
    {
    	//Make sure list is visible
    	jQuery("#"+this.model_list_id).show();
    	jQuery("#"+this.make_list_id).show();
    
    	//Hide other lists
    	jQuery("#"+this.trim_data_list_id).hide();
    	jQuery("#"+this.trim_list_id).hide();
    	
    
    	//Set a loading message while we retrieve the data
        jQuery("#"+this.model_list_id).html("<fieldset><p>Models:</p><div class='scrollable'><p>Loading Models...</p></div></fieldset>");
        
        //Clear Active Make
        jQuery("#"+this.make_list_id + " a").removeClass('active');
        
        var sender = this;

    	//Get Car Model JSON for the selected make
	jQuery.getJSON(this.base_url+"?callback=?", {cmd:"getModels", make:make_id, sold_in_us:this.sold_in_us}, function(data) {
		
		if(!sender.responseError(data))
		{		
	    		var models = data.Models;
	    		var ul = document.createElement('ul');
			
			for (var i = 0; i < models.length; i++)
			{
				var li = document.createElement('li');
				var a = document.createElement('a');
				
				var make_id = models[i].model_make_id;
				var model_name = models[i].model_name;

				jQuery(a).bind('click', {make: make_id, model:model_name}, function(event) {
					sender.populateTrimList(event.data.make, event.data.model);
					jQuery(this).addClass('active');
				});
				
				jQuery(a).html(models[i].model_name).attr("href", "javascript:void(0)");

				jQuery(li).append(a);
				jQuery(ul).append(li);
			}
      			
      			var fieldset = document.createElement('fieldset');
			var p = document.createElement('p');
			var div = document.createElement('div');

			jQuery(p).html("Models:");
			jQuery(div).addClass("scrollable");

			jQuery(fieldset).append(p);
			jQuery(p).append(div);
			jQuery(div).append(ul);

			jQuery("#"+sender.model_list_id).html("");
			jQuery("#"+sender.model_list_id).append(fieldset);
	        }
    	});
    },
    
    populateMakeList: function()
    {    
    	//Make sure list is visible
    	jQuery("#"+this.make_list_id).show();
    
    	//Hide other lists
    	jQuery("#"+this.trim_data_list_id).hide();
    	jQuery("#"+this.trim_list_id).hide();
    	jQuery("#"+this.model_list_id).hide();
    
	//Set a loading message while we retrieve the data
        jQuery("#"+this.make_list_id).html("<fieldset><p>Makes:</p><div class='scrollable'><p>Loading Makes...</p></div></fieldset>");
            
        var sender = this; 
            
   	//Retrieve All Makes
      	jQuery.getJSON(this.base_url+"?callback=?", {cmd:"getMakes", sold_in_us:this.sold_in_us}, function(data) {
      	
      		if(!sender.responseError(data))
      		{
      			var makes = data.Makes;
      			var ul = document.createElement('ul');
      			
			for (var key in makes)
			{
			   if (makes.hasOwnProperty(key))
			   {
				var li = document.createElement('li');
				var a = document.createElement('a');
				
				var make_id = makes[key].make_id;
				
				jQuery(a).bind('click', {make: make_id}, function(event) {
					sender.populateModelList( event.data.make );
					jQuery(this).addClass('active');
				});
						
				jQuery(a).html(makes[key].make_display).attr("href", "javascript:void(0)");
				
				jQuery(li).append(a);
				jQuery(ul).append(li);
			   }
			}
			
			var fieldset = document.createElement('fieldset');
			var p = document.createElement('p');
			var div = document.createElement('div');
			
			jQuery(p).html("Makes:");
			jQuery(div).addClass("scrollable");
			
			jQuery(fieldset).append(p);
			jQuery(p).append(div);
			jQuery(div).append(ul);
			
			jQuery("#"+sender.make_list_id).html("");
			jQuery("#"+sender.make_list_id).append(fieldset);
        	}
        });
    },
    
    populateYearSelect: function()
    {    
    	//Set a loading message while we retrieve the data
    	jQuery("select#"+this.year_select_id).html("<option value=''>Loading Years...</option>");
        
        var sender = this;
           
        jQuery.getJSON(this.base_url+"?callback=?", {cmd:"getYears"}, function(data) {
    
    	if(!sender.responseError(data))
    	{
        	var options = sender.empty_option_html;
        	
        	//Set min and max year range
        	var minYear = data.Years.min_year;
        	var maxYear = data.Years.max_year;
        	
        	if(sender.year_select_min != null && minYear < sender.year_select_min )
        		minYear = sender.year_select_min;
        	if(sender.year_select_max != null && maxYear > sender.year_select_max )
        		maxYear = sender.year_select_max;
        	
        	for (var i = maxYear; i >= minYear; i--)
        	{
          		options += '<option value="' + i + '">' + i + '</option>';
        	}
    	
    		jQuery("select#"+sender.year_select_id).html(options);
    		
    		jQuery("select#"+sender.make_select_id).html(sender.empty_option_html);
		jQuery("select#"+sender.model_select_id).html(sender.empty_option_html);
		
		
		if(sender.settings.year != null)
		{
    			jQuery('select#'+sender.year_select_id).val(sender.settings.year);
    			sender.yearSelectChange();
    		}
    	}
    	
    	});
    },
    
    populateAttributeSelect: function(elemId, fieldName)
    {    
    	//Set a loading message while we retrieve the data
    	jQuery('#'+elemId).html("<option value='-1'>Loading...</option>");
    	
    	var sender = this;
        
        jQuery.getJSON(this.base_url+"?callback=?", {cmd:"GetFieldValues", field_name:fieldName}, function(data) {

    	if(!sender.responseError(data))
    	{
        	var options = '<option value="">Any</option>';
        	
        	for (var i = 0; i < data.Values.length; i++)
    		{
    		     if(data.Values[i].value != null)
          	    	options += '<option>' + data.Values[i].value + '</option>';
        	}
    	
    		jQuery('#'+elemId).html(options);
    	}
    	
    	});
    },
    
    populateYearFilter: function(elemId)
    {    
    	//Set a loading message while we retrieve the data
    	jQuery('#'+elemId).html("<option value='-1'>Loading Years...</option>");
        
        var sender = this;
        
        jQuery.getJSON(this.base_url+"?callback=?", {cmd:"getYears"}, function(data) {
    
    	if(!sender.responseError(data))
    	{
        	var options = '<option value="-1">Any</option>';
        	
        	for (var i = data.Years.max_year; i >= data.Years.min_year; i--)
        	{
          	    options += '<option value="' + i + '">' + i + '</option>';
        	}
    	
    		jQuery('#'+elemId).html(options);
    	}
    	});
    		
    },
    
    populateMakeSelect: function(data)
    {
	if(!this.responseError(data))
	{
    	   	var options = '<option value="">Please choose a make</option>';
		var makes = data.Makes;
		for (var key in makes)
		{
	   	   if (makes.hasOwnProperty(key))
	   	   {
	   	   	var s = '';
	   	   	if(this.settings.make != null && this.settings.make == makes[key].make_id) s = 'selected="selected"';
	   	   
			options += '<option value="' + makes[key].make_id + '" '+s+'>' + makes[key].make_display + '</option>';
		   }
		}
	
		jQuery("select#"+this.make_select_id).html(options);
	}
    },
    
    populateModelSelect: function(data)
    {    
    	var models = data.Models;
    
        var options = '';
        for (var i = 0; i < models.length; i++)
        {
           var s = '';
	   if(this.settings.model != null && this.settings.model == models[i].model_name) s = 'selected="selected"';
        
           options += '<option value="' + models[i].model_name + '" '+s+'>' + models[i].model_name + '</option>';
        }
    
      	jQuery("select#"+this.model_select_id).html(options);
    },
    
    populateTrimSelect: function(data)
    {    
        var trims = data.Trims;
        var display;
        
        var options = '';
        for (var i = 0; i < trims.length; i++)
        {
        	var s = '';
	   	if(this.settings.trim != null && this.settings.trim == trims[i].model_id) s = 'selected="selected"';
        
        	trim_display = trims[i].model_trim;
        	if(trim_display == "") trim_display = this.default_trim_name;
        		
         	options += '<option value="' + trims[i].model_id + '" '+s+'>' +  trim_display + '</option>';
        }
        
      	jQuery("select#"+this.trim_select_id).html(options);
      	
      	this.cur_trim = jQuery("select#"+this.trim_select_id).val();
      	
	//If we have set color option dropdowns, populate them
	if(this.color_int_select_id != null || this.color_ext_select_id != null)
	this.populateColorSelects(this.cur_trim);
    },
    
    carColorHTML : function(colorData)
    {
    	var out = '';
        
        if(colorData.length == 0) return 'Not Available';
        
        for (var i = 0; i < colorData.length; i++)
        {
             out += colorData[i].color_name + '<br/>';
        }
    	
    	return out;
    },
    
    carDataHTML : function(data)
    {
    	var sold_in_us = "No";
    	if(data.model_sold_in_us == "1") sold_in_us = "Yes";
    
	var out = '<table class="model-data">';
    		
    	out += '<tr><th colspan="2">'+data.model_year+' '+data.make_display+' '+data.model_name+' '+data.model_trim+'</th></tr>';
    		
    	out += '<tr><td colspan="2"><hr/></td></tr>';	
    	out += '<tr><td>Country of Origin:</td><td>'+data.make_country+'</td></tr>';
    	out += '<tr><td>Sold in US:</td><td>'+sold_in_us+'</td></tr>';
    	out += '<tr><td>Body Style:</td><td>'+data.model_body+'</td></tr>';
    	
    	//Output Color Data
    	out += '<tr><td colspan="2"><hr/></td></tr>';
    	out += '<tr><td valign="top">Exterior Colors:</td><td>';
    	out += this.carColorHTML(data.ExtColors) + '</td></tr>';
    	out += '<tr><td valign="top">Interior Colors:</td><td>';
    	out += this.carColorHTML(data.IntColors) + '</td></tr>';
    		
    	out += '<tr><td colspan="2"><hr/></td></tr>';
    	out += '<tr><td>Engine Location:</td><td>'+data.model_engine_position+'</td></tr>';
    	out += '<tr><td>Engine Type:</td><td>'+data.model_engine_type+'</td></tr>';
    	out += '<tr><td>Engine Cylinders:</td><td>'+data.model_engine_cyl+'</td></tr>';
    	out += '<tr><td>Engine Displacement (cc):</td><td>'+data.model_engine_cc+'</td></tr>';
    	out += '<tr><td>Engine Displacement (l):</td><td>'+data.model_engine_l+'</td></tr>';
    	out += '<tr><td>Engine Displacement (cubic inches):</td><td>'+data.model_engine_ci+'</td></tr>';
    	out += '<tr><td>Engine Bore (mm):</td><td>'+data.model_engine_bore_mm+'</td></tr>';
    	out += '<tr><td>Engine Bore (in):</td><td>'+data.model_engine_bore_in+'</td></tr>';
    	out += '<tr><td>Engine Stroke (mm):</td><td>'+data.model_engine_stroke_mm+'</td></tr>';
    	out += '<tr><td>Engine Stroke (in):</td><td>'+data.model_engine_stroke_in+'</td></tr>';
    	out += '<tr><td>Engine Valves Per Cylinder:</td><td>'+data.model_engine_valves_per_cyl+'</td></tr>';
    	out += '<tr><td>Engine Valves:</td><td>'+data.model_engine_valves+'</td></tr>';
    	out += '<tr><td>Engine Max Power (HP):</td><td>'+data.model_engine_power_hp+'</td></tr>';
    	out += '<tr><td>Engine Max Power (PS):</td><td>'+data.model_engine_power_ps+'</td></tr>';
    	out += '<tr><td>Engine Max Power (kW):</td><td>'+data.model_engine_power_kw+'</td></tr>';
    	out += '<tr><td>Engine Max Power RPM:</td><td>'+data.model_engine_power_rpm+'</td></tr>';
    	out += '<tr><td>Engine Max Torque (Nm):</td><td>'+data.model_engine_torque_nm+'</td></tr>';
    	out += '<tr><td>Engine Max Torque (Lb-Ft):</td><td>'+data.model_engine_torque_lbft+'</td></tr>';
    	out += '<tr><td>Engine Max Torque (kgf-m):</td><td>'+data.model_engine_torque_kgm+'</td></tr>';
    	out += '<tr><td>Engine Max Torque RPM:</td><td>'+data.model_engine_torque_rpm+'</td></tr>';
    	out += '<tr><td>Engine Compression Ratio:</td><td>'+data.model_engine_compression+'</td></tr>';
    	out += '<tr><td>Engine Fuel Type:</td><td>'+data.model_engine_fuel+'</td></tr>';
    		
    	out += '<tr><td colspan="2"><hr/></td></tr>';
    	out += '<tr><td>Drive:</td><td>'+data.model_drive+'</td></tr>';
    	out += '<tr><td>Transmission Type:</td><td>'+data.model_transmission_type+'</td></tr>';
    	out += '<tr><td>Top Speed (KPH):</td><td>'+data.model_top_speed_kph+'</td></tr>';
    	out += '<tr><td>Top Speed (MPH):</td><td>'+data.model_top_speed_mph+'</td></tr>';
    	out += '<tr><td>0-100 kph (0-62mph):</td><td>'+data.model_0_to_100_kph+'</td></tr>';
    		
    	out += '<tr><td colspan="2"><hr/></td></tr>';
    	out += '<tr><td>Doors:</td><td>'+data.model_doors+'</td></tr>';
    	out += '<tr><td>Seats:</td><td>'+data.model_seats+'</td></tr>';
    	out += '<tr><td>Weight (kg):</td><td>'+data.model_weight_kg+'</td></tr>';
    	out += '<tr><td>Weight (lbs):</td><td>'+data.model_weight_lbs+'</td></tr>';
    	out += '<tr><td>Length (mm):</td><td>'+data.model_length_mm+'</td></tr>';
    	out += '<tr><td>Length (in):</td><td>'+data.model_length_in+'</td></tr>';
    	out += '<tr><td>Width (mm):</td><td>'+data.model_width_mm+'</td></tr>';
    	out += '<tr><td>Width (in):</td><td>'+data.model_width_in+'</td></tr>';
    	out += '<tr><td>Height (mm):</td><td>'+data.model_height_mm+'</td></tr>';
    	out += '<tr><td>Height (in):</td><td>'+data.model_height_in+'</td></tr>';
    	out += '<tr><td>Wheelbase (mm):</td><td>'+data.model_wheelbase_mm+'</td></tr>';
    	out += '<tr><td>Wheelbase (in):</td><td>'+data.model_wheelbase_in+'</td></tr>';
    	out += '<tr><td>Fuel Economy City(l/100km):</td><td>'+data.model_lkm_city+'</td></tr>';
    	out += '<tr><td>Fuel Economy City(mpg):</td><td>'+data.model_mpg_city+'</td></tr>';
    	out += '<tr><td>Fuel Economy HWY(l/100km):</td><td>'+data.model_lkm_hwy+'</td></tr>';
    	out += '<tr><td>Fuel Economy HWY(mpg):</td><td>'+data.model_mpg_hwy+'</td></tr>';
    	out += '<tr><td>Fuel Economy Mixed(l/100km):</td><td>'+data.model_lkm_mixed+'</td></tr>';
    	out += '<tr><td>Fuel Economy Mixed(mpg):</td><td>'+data.model_mpg_mixed+'</td></tr>';
    	out += '<tr><td>Fuel Capacity(l):</td><td>'+data.model_fuel_cap_l+'</td></tr>';
    	out += '<tr><td>Fuel Capacity(g):</td><td>'+data.model_fuel_cap_g+'</td></tr>';
    		
    	out += '</table>';
    		
    	out = out.replace(/>null</g, ">Not Available<");
    		
    	return out;
    },
   
    populateCarDataList : function(model_id)
    {
    	//Show this list
    	jQuery("#"+this.trim_data_list_id).show();
    
    	//Hide the lists
    	jQuery("#"+this.trim_list_id).hide();
    	jQuery("#"+this.model_list_id).hide();
    	jQuery("#"+this.make_list_id).hide();
    
    	//Set loading message
    	jQuery("#"+this.trim_data_list_id).html('Loading Model Data...');
    	
    	var sender = this;
    	 
    	//Get Car Model JSON for the selected make
	jQuery.getJSON(this.base_url+"?callback=?", {cmd:"getModel", model:model_id}, function(data) {
	
	    if(!sender.responseError(data))
	    {
	        var out = '<div class="car_data_breadcrumbs"><a href="javascript:void()" onclick="jQuery(\'#'+sender.trim_data_list_id+'\').hide();jQuery(\'#'+sender.make_list_id+'\').show();jQuery(\'#'+sender.model_list_id+'\').show();">'+data[0].make_display+'</a> > ';
	        out +=	  '<a href="javascript:void()"  onclick="jQuery(\'#'+sender.trim_data_list_id+'\').hide();jQuery(\'#'+sender.make_list_id+'\').show();jQuery(\'#'+sender.model_list_id+'\').show();jQuery(\'#'+sender.trim_list_id+'\').show();">'+data[0].model_name+'</a></div><fieldset>';
	    
	   	out += sender.carDataHTML(data[0]) + '</fieldset>';
	   
	       	jQuery("#"+sender.trim_data_list_id).html(out);
	    }
        });
    },
    
    populateCarData : function(model_data_id)
    {
    	this.model_data_id = model_data_id;
	this.cur_trim = jQuery("select#"+this.trim_select_id).val();
	
	//Make sure there is a trim selected
	if(this.cur_trim == null || this.cur_trim == "")
	{
		jQuery("#"+this.model_data_id).html("");
		alert('Please select a year, make, and model.');
		return;
	}
    	
 	//Set a loading message while we retrieve the data
        jQuery("#"+this.model_data_id).html("Loading Model Data...");

        var sender = this;
        
        //Get Car Model JSON for the selected make
    	jQuery.getJSON(this.base_url+"?callback=?", {cmd:"getModel", model:this.cur_trim}, function(data) {
    	
    	if(!sender.responseError(data))
    	{
    		var out = sender.carDataHTML(data[0]);
        	
        	jQuery("#"+sender.model_data_id).html(out);
        }
        });
    },
    
    populateSearchResult : function(model_id)
    {
    	this.cur_trim = model_id;
    
     	//Set a loading message while we retrieve the data
     	jQuery("#"+this.search_controls_id).hide();
     	jQuery("#"+this.search_result_id).show();
        jQuery("#"+this.search_result_id).html("Loading Model Data...");
        
        var sender = this;
            
        //Get Car Model JSON for the selected make
       	jQuery.getJSON(this.base_url+"?callback=?", {cmd:"getModel", model:this.cur_trim}, function(data) {
     	
       	  if(!sender.responseError(data))
       	  {
       		var out = '<b><a href="javascript:void()" onclick="jQuery(\'#'+sender.search_result_id+'\').hide();jQuery(\'#'+sender.search_controls_id+'\').show();">Back to Search Results</a></b>';       		
       		out += '<fieldset>' + sender.carDataHTML(data[0]) + '</fieldset>'; 
            	jQuery("#"+sender.search_result_id).html(out);
          }
        });
    },
    
    loadSettings : function (c_name)
    {
	var i,x,y,ARRcookies=document.cookie.split(";");
	var cookie = '';
	
	for (i=0;i<ARRcookies.length;i++)
	{
		x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
		y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
		x=x.replace(/^\s+|\s+jQuery/g,"");
		if (x==c_name) {
			cookie = unescape(y);
			break;
		}
 	}
 	this.settings = new Object();
 	if(cookie != '') this.settings = jQuery.parseJSON(cookie); 
 		
    },

    saveSetting : function(setting, value)
    {   
    	//JSON library is required to manage settings
    	if(typeof JSON == 'undefined') return;
    
    	this.settings[setting] = value;
	document.cookie = this.cookie_name + "=" + JSON.stringify(this.settings);
    },
    
    yearSelectChange: function ()
    {        
        this.cur_year = jQuery("select#"+this.year_select_id).val();
        
        //Set Cookie to save year selection
        this.saveSetting('year', this.cur_year);
        
         //if no year supplied, clear makes, models, return;
	if(this.cur_year == "")
	{
		jQuery("select#"+this.make_select_id).html(this.empty_option_html);
		jQuery("select#"+this.model_select_id).html(this.empty_option_html);
		jQuery("select#"+this.trim_select_id).html(this.empty_option_html);
	    	return;
    	}
    	
    	 //Set a loading message while we retrieve the data
        jQuery("select#"+this.make_select_id).html("<option value=''>Loading Makes...</option>");
        
        var sender = this;
        
        //Get Car Model JSON for the selected make
    	jQuery.getJSON(this.base_url+"?callback=?", {cmd:"getMakes", year:this.cur_year, sold_in_us:this.sold_in_us}, function(data) {
    	
    	if(!sender.responseError(data))
    	{
        	sender.populateMakeSelect(data);
        	sender.makeSelectChange();
        }
        });
    },
    
    makeSelectChange: function ()
    {
    	this.cur_make = jQuery("select#"+this.make_select_id).val();
    	
    	//If value has been selected, save make selection
    	if(this.cur_make != "" && this.cur_make != null)
        	this.saveSetting('make', this.cur_make);
    	
    	//if no make supplied, clear models, return;
    	if(this.cur_make == "")
    	{
    		jQuery("select#"+this.model_select_id).html(this.empty_option_html);
			jQuery("select#"+this.trim_select_id).html(this.empty_option_html);
    		return;
    	}
    
    	//Set a loading message while we retrieve the data
    	jQuery("select#"+this.model_select_id).html("<option value=''>Loading Models...</option>");
    
    	var sender = this;
    
    	//Get Car Model JSON for the selected make
	jQuery.getJSON(this.base_url+"?callback=?", {cmd:"getModels", make:this.cur_make, year:this.cur_year, sold_in_us:this.sold_in_us}, function(data) {
	
		if(!sender.responseError(data))
		{
    			sender.populateModelSelect(data);
			
        		sender.cur_model = jQuery('select#'+sender.model_select_id).val();
        		
        		//Re-populate the trim select
        		sender.modelSelectChange();
        	}
    	});
    },
    
    modelSelectChange: function ()
    {
        this.cur_model = jQuery("select#"+this.model_select_id).val();
        
        //If value has been selected, save model selection
        if(this.cur_model != "" && this.cur_model != null)
        	this.saveSetting('model', this.cur_model);

        //If there is no trim select, we don't need to do anything else here
        if(this.trim_select_id == '' || this.trim_select_id == null) return;
        	
        //if no model supplied, clear trim, return;
        if(this.cur_model == "")
        {
        	jQuery("select#"+this.trim_select_id).html(this.empty_option_html);
        	return;
        }
        
        //Set a loading message while we retrieve the data
        jQuery("select#"+this.trim_select_id).html("<option value=''>Loading Trims...</option>");
        
        var sender = this;
        
        //Get Car Model JSON for the selected make
    	jQuery.getJSON(this.base_url+"?callback=?", {cmd:"getTrims", make:this.cur_make, year:this.cur_year, model:this.cur_model, sold_in_us:this.sold_in_us, full_results:0 }, function(data) {
    	
    		if(!sender.responseError(data))
        		sender.populateTrimSelect(data);
    		
            	sender.cur_trim = jQuery('select#'+sender.trim_select_id).val();
        });
    },
    
    trimSelectChange: function ()
    {
    	this.cur_trim = jQuery("select#"+this.trim_select_id).val();

	//If value has been selected, save trim selection
	if(this.cur_trim != "" && this.cur_trim != null)
		this.saveSetting('trim', this.cur_trim);
	    
	//If we have set color option dropdowns, populate them
    	if(this.color_int_select_id != null || this.color_ext_select_id != null)
    		this.populateColorSelects(this.cur_trim);
    },
    
    populateColorSelects: function(model_id)
    {
    	var sender = this;
    
    	jQuery.getJSON(this.base_url+"?callback=?", {cmd:"getModel", model:model_id}, function(data) {
		
	    if(!sender.responseError(data))
	    {
	    	var intColors = data[0].IntColors;
	    	var extColors = data[0].ExtColors;
		var outInt = sender.empty_option_html;
		var outExt = sender.empty_option_html;

		for (var i = 0; i < intColors.length; i++)
        	{
		    outInt += "<option value=\""+intColors[i].color_id+"\">"+intColors[i].color_name+"</option>";
		}
		
		for (var i = 0; i < extColors.length; i++)
		{
		    outExt += "<option value=\""+extColors[i].color_id+"\">"+extColors[i].color_name+"</option>";
		}

		if(sender.color_int_select_id != null) jQuery('#'+sender.color_int_select_id).html(outInt);
		if(sender.color_ext_select_id != null) jQuery('#'+sender.color_ext_select_id).html(outExt); 
	    }	    
        });
        
        
    },
    
    responseError: function (data)
    {
    	if(typeof data.error != 'undefined' && data.error != '')
	{
	 	alert(data.error);
		return true;
	}
	else
		return false;
    }
}

if (typeof jQuerytmp != 'undefined') var jQuery = jQuerytmp;