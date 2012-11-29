var LTHRadar = {

    /**
     *
     * This function initializes the radar component	
     */
    init : function()
    {
	AR.radar.background = new AR.ImageResource("../www/img/Radar-Background.png");

	AR.radar.positionX = 0.05;
	AR.radar.positionY = 0.05;
	AR.radar.width = 0.3;

	AR.radar.centerX = 0.5;
	AR.radar.centerY = 0.5;
	AR.radar.radius = 0.4;

	AR.radar.northIndicator.image = new AR.ImageResource("../www/img/north-indic.png");
	AR.radar.northIndicator.radius = 0.4;

	AR.radar.onClick = function(){alert("click radar");};
	AR.radar.enabled = true; 

	/* Create a drawable to display the stores on the radar */
	var RadarMarker = new AR.Circle(0.05, {style: {fillColor: '#FF0000'}});

	return RadarMarker;
    }
};