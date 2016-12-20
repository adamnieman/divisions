function svgHandler (sb) {

	function INIT () {
		setup.call(this);

		sb.listen({
			listenFor: ["newCrowd"],
			moduleID: this.moduleID,
			moduleFunction: "receive",
		})

		sb.listen({
			listenFor: ["constitSelected"],
			moduleID: this.moduleID,
			moduleFunction: "erase",
		})

		sb.listen({
			listenFor: ["resizeTrigger"],
			moduleID: this.moduleID,
			moduleFunction: "resize",
		})
	}

	function setup () {

		var container = document.getElementById("vis");

		var svg = d3.select(container).append("svg")
		.attr("width", sb.w)
		.attr("height", sb.h)
		.on("click", function () {
			if (d3.event.originalTarget == this) {
				sb.notify({
					type : "unzoom",
					data: null,
				});
			}
		});

		//making 2 groups so the key will always sit on top of the circles regardless of when they are added
		var g1 = svg.append("g");
		var g2 = svg.append("g");

		var groups;
		var circles;

		var keyPad = sb.fontSize*0.5

		var key = g2.selectAll(".key-group")
		.data(Object.keys(sb.colour))
		.enter()
		.append("g")
		.attr("transform", function (d, i) {
			return "translate("+(sb.w-keyPad)+", "+(i*(sb.fontSize+keyPad))+")"
		});

		key
		.append("rect")
		.attr("x", -sb.fontSize)
		.attr("y", keyPad)
		.attr("width", sb.fontSize)
		.attr("height", sb.fontSize)
		.attr("fill", function (d, i) {
			if (d == "nonVoters") {
				return sb.getColour(d)
			}
			return utility.adjustColour(sb.getColour(d), "l", 0.6, 0.7);
		})

		key
		.append("text")
		.attr("opacity", 0.75)
		.text(function (d) {
			return d;
		})
		.attr("x", - (sb.fontSize+keyPad))
		.attr("y", keyPad+sb.fontSize)
		.attr("text-anchor", "end");

		function RECEIVE () {
			groups = g1.selectAll(".crowd-group")
			.data(sb.currentConstituency.parties)
			.enter()
			.append("g")
			.attr("class", "crowd-group")
			.attr("transform", function (d, i) {
				//var x = d.x+sb.w/2; //x-pos
				//var y = d.y+sb.h/2;
				var x = ((d.x + sb.crowds.offset.x) * sb.crowds.multiplier) + sb.w/2//sb.crowds.offset.x
				var y = ((d.y + sb.crowds.offset.y) * sb.crowds.multiplier) + sb.h/2//sb.crowds.offset.x
				return "translate("+x+","+y+")"
			})

			circles = groups
			.append("circle")
			.attr("cx", 0)
			.attr("cy", 0)
			.attr("r", function (d, i) {
				return d.r * sb.crowds.multiplier;
			})
			.attr("fill", "rgba(0,0,0,0)")
			.attr("stroke-width", sb.fontSize/4)
			.attr("stroke", function (d, i) {
				if (d.name == "non voters") {
					return sb.getColour(d.name);
				}
				return utility.adjustColour(sb.getColour(d.name), "l", 0.6, 0.7);
			})
			//.attr("opacity", 0.75)
			.on("click", function (d, i) {
				sb.notify({
					type : "zoom",
					data: d
				});
			})
			.on("mouseover", function (d, i) {
				d3.select(this)
				.attr("stroke-width", sb.fontSize/2);

				var content = "";

				if (d.name == "non voters") {
					content += "<p>non voters:\t"+d.votes+"</p>";
				}
				else {
					content += "<h3>"+d.name+"</h3>"
					content += "<p>candidate:\t"+d.candidate+"</p>"
					content += "<p>votes:\t"+d.votes+"</p>"
					content += "<p>place:\t"+d.place+"</p>"
				}

				sb.notify({
					type : "update-tooltip",
					data: {
						x: ((d.x + sb.crowds.offset.x + d.r) * sb.crowds.multiplier) + sb.w/2+10,
						y: ((d.y + sb.crowds.offset.y) * sb.crowds.multiplier) + sb.h/2,
						content: content,
					}
				});

			})
			.on("mouseout", function (d, i) {

				d3.select(this)
				.attr("stroke-width", sb.fontSize/4);

				sb.notify({
					type : "hide-tooltip",
					data: null,
				});
			})
		}

		function ERASE () {
			groups = svg.selectAll(".crowd-group")
			.data([])
			.exit()
			.remove()
			
		}

		function RESIZE () {
			svg
			.attr("width", sb.w)
			.attr("height", sb.h);

			key
			.attr("transform", function (d, i) {
				return "translate("+(sb.w-keyPad)+", "+(i*(sb.fontSize+keyPad))+")"
			});

			if (groups && circles) {
				groups
				.attr("transform", function (d, i) {
					var x = ((d.x + sb.crowds.offset.x) * sb.crowds.multiplier) + sb.w/2
					var y = ((d.y + sb.crowds.offset.y) * sb.crowds.multiplier) + sb.h/2
					return "translate("+x+","+y+")"
				})

				circles
				.attr("r", function (d, i) {
					return d.r * sb.crowds.multiplier;
				})
			}

		}

		function _DESTROY () {
			container, svg, g1, g2, groups, circles, keyPad, key = null;
		}

		this.erase = ERASE;
		this.receive = RECEIVE;
		this.resize = RESIZE;
		this._destroy = _DESTROY;
		//this.draw = DRAW;
	}
	
	function DESTROY () {
		sb.unlisten(this.moduleID)
		notify = null;
		this._destroy()
	}

	return {
        init : INIT,
        destroy : DESTROY
    };
}