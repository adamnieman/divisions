function crowdFormatHandler (sb) {

	var container = document.getElementById("vis");

	function INIT () {
		sb.listen({
			listenFor: ["receiveCrowd"],
			moduleID: this.moduleID,
			moduleFunction: "receive",
		})

		sb.listen({
			listenFor: ["constitSelected"],
			moduleID: this.moduleID,
			moduleFunction: "reset",
		})

		sb.resize.push(RESIZE);
	}

	function RESET () {
		sb.crowds.toDraw.nonVoters = null;
		sb.crowds.toDraw.spoiled = null;
		sb.crowds.toDraw.parties = [];
	}

	function RECEIVE (d) {
		//console.log(d);
		//console.log(sb);

		switch (d.id) {
			case "nonVoters":
				sb.crowds.toDraw.nonVoters = {
					id: d.id,
					offset: {},
					data: d.data,
					radius: 0
				}
				break;
			case "spoiled":
				sb.crowds.toDraw.spoiled = {
					id: d.id,
					offset: {},
					data: d.data,
					radius: 0
				}
				break;
			default:
				sb.crowds.toDraw.parties.push({
					id: d.id,
					offset: {},
					data: d.data,
					radius: 0
				})
		}


		if ((sb.crowds.toDraw.parties.length == sb.currentConstituency.candidate.length)&&
			sb.crowds.toDraw.spoiled != null && sb.crowds.toDraw.nonVoters != null) {
			
			calculateOffset();
			getMultiplier();
			getCenterOffset();

			sb.notify({
				type : "newCrowd",
				data: null,
			})

			//drawController();
		}
	}

	function calculateOffset () {
		//the angle apart the crowds will be from each other around the edge of the circle
		var angleEach = (2*Math.PI)/sb.crowds.toDraw.parties.length; //in radians

		//the radius of the largest crowd
		var largest = 0;
			
		//calculates the approx radius of each crowd, and assigns the largest one to longest
		var i;
		var l = sb.crowds.toDraw.parties.length;
		for (i=0; i<l; i++) {
			sb.crowds.toDraw.parties[i].radius = Math.abs(utility.arrayMax(sb.crowds.toDraw.parties[i].data, "x")-utility.arrayMin(sb.crowds.toDraw.parties[i].data, "x"))/2;
			if (sb.crowds.toDraw.parties[i].radius > largest) {
				largest = sb.crowds.toDraw.parties[i].radius;
			}
		}

		//gets the distance that the circles will have to be away from the center of the "mother" circle so as to not overlap
		motherRadius = (largest*2.4)/(2*Math.tan(angleEach/2))
		//gets the outer radius of the entire 'parties' group. this is the radius of the mother circle plus the radius of the biggest crowd.
		outerRadius = largest+motherRadius;
		padding = outerRadius/10;
		
		//gives each crowd an x, y center co-ordinate based on bearing (angle from the top) and radius of mother circle.
		for (i=0; i<l; i++) {
			var angle = i*angleEach;
			sb.crowds.toDraw.parties[i].offset = {
				x: (motherRadius*Math.cos(angle))+(outerRadius)+padding,
				y: motherRadius*Math.sin(angle)+(outerRadius)+padding,
			}
		}

		sb.crowds.toDraw.nonVoters.radius = Math.abs(utility.arrayMax(sb.crowds.toDraw.nonVoters.data, "x")-utility.arrayMin(sb.crowds.toDraw.nonVoters.data, "x"))/2;
		sb.crowds.toDraw.nonVoters.offset = {
			x: (outerRadius*2)+(padding*2)+(sb.crowds.toDraw.nonVoters.radius),
			y: (outerRadius) > (sb.crowds.toDraw.nonVoters.radius) ? (outerRadius)+padding : (sb.crowds.toDraw.nonVoters.radius)+padding, 
		}

		sb.crowds.cw = (outerRadius*2)+(sb.crowds.toDraw.nonVoters.radius*2)+(padding*3)
		sb.crowds.ch = sb.crowds.toDraw.nonVoters.offset.y * 2;

	}

	function getMultiplier () {
		sb.crowds.multiplier = sb.h/sb.crowds.ch > sb.w/sb.crowds.cw ? sb.w/sb.crowds.cw : sb.h/sb.crowds.ch;
		sb.crowds.multiplier = utility.round(sb.crowds.multiplier, 2);
		debug.dbg("The multiplier is: "+sb.crowds.multiplier)

	}

	function getCenterOffset () {
		sb.crowds.centerOffset = {};

		if (sb.h/sb.crowds.ch > sb.w/sb.crowds.cw) {
			sb.crowds.centerOffset.x = 0;
			sb.crowds.centerOffset.y = (sb.h-(sb.crowds.ch*sb.crowds.multiplier))/2;
		}
		else {
			sb.crowds.centerOffset.x = (sb.w-(sb.crowds.cw*sb.crowds.multiplier))/2;
			sb.crowds.centerOffset.y = 0;
		}
	}


	function RESIZE () {
		if (sb.currentConstituency &&
			(sb.crowds.toDraw.parties.length == sb.currentConstituency.candidate.length)&&
			sb.crowds.toDraw.spoiled != null && sb.crowds.toDraw.nonVoters != null) {
			
			getMultiplier();
			getCenterOffset();

			
		}

		sb.notify({
			type : "resizeTrigger",
			data: null,
		})
	}

	function DESTROY () {
		sb.unlisten(this.moduleID)
		container = null;
		calculateOffset, getCenterOffset, getMultiplier = null;
	}

	return {
        init : INIT,
        reset: RESET, 
        receive: RECEIVE,
        destroy : DESTROY
    };
}