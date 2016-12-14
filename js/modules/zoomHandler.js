function zoomHandler (sb) {

	var zoomed = false;
	var offset = {
		x: null,
		y: null,
	}
	var padding;


	function INIT () {
		sb.listen({
			listenFor: ["zoom"],
			moduleID: this.moduleID,
			moduleFunction: "zoom",
		})

		sb.listen({
			listenFor: ["unzoom"],
			moduleID: this.moduleID,
			moduleFunction: "unzoom",
		})

		sb.listen({
			listenFor: ["newCrowd"],
			moduleID: this.moduleID,
			moduleFunction: "setBaseValues",
		})

		padding = sb.fontSize;
	}	//this.draw = DRAW;

	function UNZOOM () {
		if (zoomed) {
			sb.crowds.offset.x = offset.x;
			sb.crowds.offset.y = offset.y;

			sb.crowds.multiplier = (sb.h-(padding*2))/sb.crowds.ch > (sb.w-(padding*2))/sb.crowds.cw ? (sb.w-(padding*2))/sb.crowds.cw : (sb.h-(padding*2))/sb.crowds.ch;
			sb.crowds.multiplier = utility.round(sb.crowds.multiplier, 2);
			debug.dbg("The multiplier is: "+sb.crowds.multiplier)

			sb.notify({
				type : "resizeTrigger",
				data: null,
			})
		}
	}

	function ZOOM (d) {
		//the diameter of the minimum vsible region around the centerpoint of the selected group
		var diameter = (d.r+sb.fontSize)*2;

		//set new multiplier
		sb.crowds.multiplier = sb.h/diameter > sb.w/diameter ? sb.w/diameter: sb.h/diameter;
		sb.crowds.multiplier = utility.round(sb.crowds.multiplier, 2);
		debug.dbg("The multiplier is: "+sb.crowds.multiplier)

		sb.crowds.offset.x = -d.x//+sb.fontSize/2;
		sb.crowds.offset.y = -d.y//+sb.fontSize/2;

		sb.notify({
			type : "resizeTrigger",
			data: null,
		})

		zoomed=true;
	}

	function SETBASEVALUES () {
		offset.x = sb.crowds.offset.x 
		offset.y = sb.crowds.offset.y
	}
	
	function DESTROY () {
		sb.unlisten(this.moduleID);
	}

	return {
        init : INIT,
        zoom: ZOOM,
        unzoom: UNZOOM,
        setBaseValues: SETBASEVALUES,
        destroy : DESTROY
    };
}