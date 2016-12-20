function crowdFormatHandler (sb) {

	//var container = document.getElementById("vis");
	var padding = sb.fontSize;
	var returnCount = 0;

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

		sb.crowds.pack = d3.pack()
		.radius(function (d) {
			return d.data.r
		})
		.padding(sb.fontSize)
	}

	function RESET () {

	}

	function RECEIVE (d) {

		var party = sb.currentConstituency.parties.filter(function (a) {
			return a.id == d.id;
		})
		party = party[0];
		party.add_crowd(d.data);
		returnCount++;

		if (returnCount == sb.currentConstituency.parties_count+1) {
			
			returnCount = 0;

			var packed = sb.crowds.pack(d3.hierarchy({children: sb.currentConstituency.parties})).children;
			
			var x = [Infinity, -Infinity];
			var y = [Infinity, -Infinity];

			var i;
			var c;
			var l = packed.length;

			for (i=0; i<l; i++) {

				sb.currentConstituency.parties[i].x = packed[i].x;
				sb.currentConstituency.parties[i].y = packed[i].y;
				c = sb.currentConstituency.parties[i];

				if (c.x-c.r < x[0]) {x[0] = c.x-c.r}
				if (c.x+c.r > x[1]) {x[1] = c.x+c.r}
				if (c.y-c.r < y[0]) {y[0] = c.y-c.r}
				if (c.y+c.r > y[1]) {y[1] = c.y+c.r}
			}

			sb.crowds.cw = Math.abs(x[1] - x[0])// + sb.fontSize*2;
			sb.crowds.ch = Math.abs(y[1] - y[0])// + sb.fontSize*2;

			sb.crowds.offset.x = ((sb.crowds.cw/2) - x[1]) //+ sb.fontSize
			sb.crowds.offset.y = ((sb.crowds.ch/2) - y[1]) //+ sb.fontSize

			getMultiplier();

			sb.notify({
				type : "newCrowd",
				data: null
			});
		}
		

		/*
		d.radius = getRadius(d);
		sb.crowds.toDraw.children.push(d);

		if (sb.crowds.toDraw.children.length == sb.currentConstituency.candidate.length + 1) {
			console.log(sb.crowds);
			console.log(sb.currentConstituency);
			sb.crowds.toDraw.children.sort(function(a, b) {
				//console.log(a)
				return b.data.length - a.data.length
				//b-a
			})

			sb.crowds.toDraw = sb.crowds.pack(d3.hierarchy(sb.crowds.toDraw))
			sb.crowds.toDraw = sb.crowds.toDraw.children;



			//calculate sb.crowds.ch(height of circles)
			var x = [Infinity, -Infinity];
			var y = [Infinity, -Infinity];

			var i;
			var l = sb.crowds.toDraw.length;
			var c;
			for (i=0; i<l; i++) {
				c = sb.crowds.toDraw[i];
				if (c.x-c.r < x[0]) {x[0] = c.x-c.r}
				if (c.x+c.r > x[1]) {x[1] = c.x+c.r}
				if (c.y-c.r < y[0]) {y[0] = c.y-c.r}
				if (c.y+c.r > y[1]) {y[1] = c.y+c.r}
			}

			sb.crowds.cw = Math.abs(x[1] - x[0])// + sb.fontSize*2;
			sb.crowds.ch = Math.abs(y[1] - y[0])// + sb.fontSize*2;

			sb.crowds.offset.x = ((sb.crowds.cw/2) - x[1]) //+ sb.fontSize
			sb.crowds.offset.y = ((sb.crowds.ch/2) - y[1]) //+ sb.fontSize

			getMultiplier();

			sb.notify({
				type : "newCrowd",
				data: null
			});

	        /*var svg = d3.select(container).append("svg")
			.attr("class", "back")
			.attr("width", sb.w)
			.attr("height", sb.h);

			/*var circles = svg.selectAll(".test-circle")
			.data(sb.crowds.toDraw)
			.enter()
			.append("circle")
			.attr("class", "test-circle")
			.attr("cx", function (d) {
				return ((d.x) * sb.crowds.multiplier) + sb.w/2//sb.crowds.offset.x
			})
			.attr("cy", function (d) {
				return ((d.y) * sb.crowds.multiplier) + sb.h/2//sb.crowds.offset.y
			})
			.attr("r", function (d) {
				return d.r * sb.crowds.multiplier;
			})

			var circles2 = svg.selectAll(".test-circle-2")
			.data(sb.crowds.toDraw)
			.enter()
			.append("circle")
			.attr("class", "test-circle-2")
			.attr("cx", function (d) {
				return ((d.x + sb.crowds.offset.x) * sb.crowds.multiplier) + sb.w/2//sb.crowds.offset.x
			})
			.attr("cy", function (d) {

				//console.log(((d.y + sb.crowds.offset.y)));
				return ((d.y + sb.crowds.offset.y) * sb.crowds.multiplier) + sb.h/2//sb.crowds.offset.y
			})
			.attr("r", function (d) {
				return d.r * sb.crowds.multiplier
			})
			.attr("fill", "none")
			.attr("stroke", "grey")
			.attr("stroke-width", 3);
			
		}*/
	}

	function getMultiplier () {
		sb.crowds.multiplier = (sb.h-(padding*2))/sb.crowds.ch > (sb.w-(padding*2))/sb.crowds.cw ? (sb.w-(padding*2))/sb.crowds.cw : (sb.h-(padding*2))/sb.crowds.ch;
		sb.crowds.multiplier = utility.round(sb.crowds.multiplier, 2);
		debug.dbg("The multiplier is: "+sb.crowds.multiplier)
	}


	function RESIZE () {
		if (sb.currentConstituency && sb.crowds.multiplier) {
			
			getMultiplier();
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