var LTHGeoObg = {

    SEOUL : 4,

    /**
     *
     * This function computes the distance between player and shop locations	
     */
    getDistances : function(storeLocations)
    {
	var distances = new Array();

	for(i = 0; i < storeLocations.length ; i++){

	    var dist = storeLocations[i].distanceToUser(); 

	    console.log("DISTANCES1 "+dist+" i "+i);
	    distances.push(dist);
	}
	return distances;
    },
    /**
     *
     * This function determines which shop should be displayed
     */
    checkDistances : function(distances)
    {
	var status = new Array();
	var state = "";

	for(i = 0; i < distances.length ; i++){

	    if(distances[i] <= 20000){

		state = true; 
		status.push(state);
	    }
	    else{

		state = false; 
		status.push(state);
	    }
	}
	return status;
    },

    /**
     *
     * Callback trigged 	
     */
    display : function()
    {
	// alert( arObject.locations.length + "and" + arObject.locations[0].latitude );

	$(document).ready(function(){

	    $.ajax ({
		url: 'http://lth.asiance-dev.com:3102/shops',
		// data: "city=4",
		dataType: 'jsonp',
		jsonp: 'jsoncallback',
		timeout: 5000,

		success: function(data, status){
		    alert("here");
		    alert(data);
		},
		error: function(){

		    alert("error");


		}
	    });
	});
    },

    /**
     *
     * This function defines the store location draws viewable on cam	
     */
    createStoreLocationDraws : function(cities, distances)
    {
	var storeLocationDraws = new Array();
	var k = 0;

	/* each city */
	for(i = 0; i < cities.length ; i++){

	    /* each store */
	    for(j = 0; j < cities[i].shops.length ; j++){

		cityName = cities[i].name;
		adress = cities[i].shops[j].address;
		name = cities[i].shops[j].name;
		phone = cities[i].shops[j].phone;
		schedule = cities[i].shops[j].schedule;
	
		var html = '<style type="text/css">p {font-size: 20px;}p {color:blue;font-weight:bold;}</style>';

		html += '<p>Distance '+Math.round(distances[k])+' m</p>';

		console.log("DRAWS "+Math.round(distances[k])+" i "+i);
		console.log("DRAWS "+distances[k]+" i "+i);

		// html += '<p>Distance '+distances[k]+' m</p>';
		k++;
		// html += '<p>City '+cities[i].name+'</p>';
		html += '<p>Phone '+phone+'</p>';
		html += '<p>Shop '+cities[i].shops[j].name+'</p>';

		var storeLocationDraw =  new AR.HtmlDrawable(
		    {html: html}, 
		    10, 
		    
		    {viewportWidth: 512, scale: 1, 
		     opacity : 0.9,
		     onDocumentLocationChanged: function() {
		     	 alert("changed");
		     },
		     onClick: function( arObject ) {

			 //save the current html info to be displayed in the footer
			 var info = this.html;

 		     	 this.onClick = null;
		     	 this.scale = 2;
			 this.html = "YOU'VE GOT IT!";
			 
			 var longitude = arObject.locations[0].longitude;

			 var source = arObject.locations[0].longitude+"_"+arObject.locations[0].latitude;

			 var code = $().crypt({method:"md5",source: source});

			 url = "http://lth.lacoste.asiance-dev.com?code="+code+"&gId="+2;

			 //may be to display infos on the clicked shop...
			 $('#myiframe').attr('src', url);

//			 AR.context.openInBrowser (url, false);
		     },
		     updateRate: AR.HtmlDrawable.UPDATE_RATE.STATIC});

						
		storeLocationDraw.html += '<div><img src="http://lth.lacoste.asiance-dev.com/images/croco-red.png" alt="L!ve"></div>';
		storeLocationDraw.html += '<p>'+name+'</p>';

		// var str = "document.getElementById('distance').innerHTML = 'HELLO' ;";
		// storeLocationDraw.evalJavaScript("document.getElementById('distance').innerHTML = 'HELLO' ;");

	     	storeLocationDraw.clickThroughEnabled = true;
		storeLocationDraw.allowDocumentLocationChanges = true;
		

		storeLocationDraws.push(storeLocationDraw);
	    }
	}
	return storeLocationDraws;
    },


    /**
     *
     * This function initializes the geo objects	
     */
    init : function(RadarMarker)
    {
    	var geoObjects = new Array();


    	$(document).ready(function(){

    	    $.ajax({
    		url: 'http://lth.lacoste.asiance-dev.com/shops',
    		// data: "city=4",
    		dataType: 'jsonp',
    		jsonp: 'jsoncallback',
    		timeout: 5000,
    		async:   false, /* because of AR.context callback... its more safe */
		
    		success: function(cities, status){

    		    var storeLocations = new Array();

    		    var latitude;
    		    var longitude;

    		    /* each city */
    		    for(i = 0; i < cities.length ; i++){
			
    		    	/* each shop */
    		    	for(j = 0; j < cities[i].shops.length ; j++){

    		    	    latitude = cities[i].shops[j].latitude;
    		    	    longitude = cities[i].shops[j].longitude;

    		    	    var location = new AR.GeoLocation(latitude, longitude);

			    var actionRange = new AR.ActionRange(location, 6000, {
				onEnter : function() {

				    alert("Enter the Zone");
				    actionRange.enabled = false; //an ActionArea which can only be entered once
				}
			    });

    		    	    storeLocations.push(location);
			    /*For Debug*/
			    console.log(">INFO: ;cityID;"+i+";shopID;"+j+";latitude;"+cities[i].shops[j].latitude+";longitude;"+cities[i].shops[j].longitude+";");
		    	}
    		    }

    		    /* when user position is available */
		    /* enable or not the location change callback */
		    //	AR.context.onLocationChanged = null;
  		    AR.context.onLocationChanged = function(lat, lon, alt, acc) {

			var distances = LTHGeoObg.getDistances(storeLocations);

    		    	var storeLocationDraws = LTHGeoObg.createStoreLocationDraws(cities,distances);

			var status = LTHGeoObg.checkDistances(distances);

    		    	for(j = 0; j < storeLocations.length ; j++){

    	    	    	    var geoObject = new AR.GeoObject(storeLocations[j], 
							     {enabled: status[j] , 
							      drawables: {cam: storeLocationDraws[j],
    	    	    							  radar: RadarMarker}});

    	    	    	    geoObjects.push(geoObject);
    		    	}
    		    };
    		},
    		error: function(){
    		    alert("Store locations not available");
    		}
    	    });
    	});
    }
};