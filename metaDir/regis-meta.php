<?php
#register the post and page thing

$cars = register_cuztom_post_type('wp car');

$cars->add_meta_box( 
   'car_pic',
   'Car Pictures', 
    array(
		array(
            'name'          => 'carPic1',
            'label'         => 'Car Picture One',
            'description'   => 'Upload a picture for the main car picture',
			'type'          => 'image',
         ),
		 array(
            'name'          => 'carPic2',
            'label'         => 'Car Picture Two',
            'description'   => 'Upload a picture for the gallery',
			'type'          => 'image',
         ),
		 array(
            'name'          => 'carPic3',
            'label'         => 'Car Picture Three',
            'description'   => 'Upload a picture for the gallery',
			'type'          => 'image',
         ),
		 array(
            'name'          => 'carPic4',
            'label'         => 'Car Picture Four',
            'description'   => 'Upload a picture for the gallery',
			'type'          => 'image',
         ),
		 array(
            'name'          => 'carPic5',
            'label'         => 'Car Picture Five',
            'description'   => 'Upload a picture for the gallery',
			'type'          => 'image',
         ),
	)
);

$cars->add_meta_box( 
   'car_info',
   'General Info', 
    array(
         array(
            'name'          => 'carYype',
            'label'         => 'Car Type',
            'description'   => 'How would you like this car to be identified',
			'type'          => 'select',
            'options'       => array ('choose a feature','Featured','On Sale','New Arrival')
         ),
         array(
            'name'          => 'price',
            'label'         => 'Price',
            'description'   => 'Price of the Car',
            'type'          => 'text'
         ),
		 array(
            'name'          => 'year',
            'label'         => 'Year',
            'description'   => 'What year is the car',
            'type'          => 'caryear',
         ),
		 array(
            'name'          => 'make',
            'label'         => 'Make',
            'description'   => 'What is the make of the car',
            'type'          => 'caryear',
         ),
		 array(
            'name'          => 'model',
            'label'         => 'Model',
            'description'   => 'What is the model of the car',
            'type'          => 'caryear',
         ),
		 array(
            'name'          => 'trans',
            'label'         => 'Transmission',
            'description'   => 'Type of transmission',
            'type'          => 'select',
			'options'       => array ('Manual','Automatic')
         ),
		 array(
            'name'          => 'exColor',
            'label'         => 'Exterior Colour',
            'description'   => 'Exterior Colour of the Car',
            'type'          => 'text'
         ),
		 array(
            'name'          => 'inColor',
            'label'         => 'Interior Colour',
            'description'   => 'Interior Colour of the Car',
            'type'          => 'text'
         ),
		 array(
            'name'          => 'passen',
            'label'         => 'Passengers',
            'description'   => 'Passengers that the car can fit',
            'type'          => 'text'
         ),
		 array(
            'name'          => 'doors',
            'label'         => 'Doors',
            'description'   => 'Amount of doors on the Car',
            'type'          => 'text'
         ),
		 array(
            'name'          => 'fuelType',
            'label'         => 'Fuel Type',
            'description'   => 'Fuel Type of the Car',
            'type'          => 'select',
			'options'       => array ('Diesel','Gasoline','Hybrid','Other','Electric')
         ),
		 array(
            'name'          => 'bodyType',
            'label'         => 'Body Type',
            'description'   => 'Body Type of the Car',
			'type'          => 'select',
            'options'       => array ('Convertible','Coupe','Hatchback','Other','Truck','Sedan','SUV','Wagon')
         ),
		 array(
            'name'          => 'kilo',
            'label'         => 'Kilometres/Miles',
            'description'   => 'Kilometres/Miles on the Car',
            'type'          => 'text'
         ),
		 array(
            'name'          => 'engType',
            'label'         => 'Engine',
            'description'   => 'Engine of the Car (ex: V8 5.2L hemi)',
            'type'          => 'text'
         ),
		 array(
            'name'          => 'CFEco',
            'label'         => 'City Fuel Economy',
            'description'   => 'City Fuel Economy of the Car (just the numeber do not include MPG or /100km)',
            'type'          => 'text'
         ),
		 array(
            'name'          => 'HFeco',
            'label'         => 'Hwy Fuel Economy',
            'description'   => 'Hwy Fuel Economy of the Car (just the numeber do not include MPG or /100km)',
            'type'          => 'text'
         ),
		 array(
            'name'          => 'driveTr',
            'label'         => 'Drivetrain',
            'description'   => 'Drivetrain of the Car',
            'type'          => 'select',
			'options'       => array ('FWD','RWD','AWD')
         ),
		 
      )
);