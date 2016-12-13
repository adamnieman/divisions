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
		.attr("class", "back")
		.attr("width", sb.w)
		.attr("height", sb.h);

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
			if (d === "nonVoters") {
				return "non voters";
			}
			return d;
		})
		.attr("x", - (sb.fontSize+keyPad))
		.attr("y", keyPad+sb.fontSize)
		.attr("text-anchor", "end");

		function RECEIVE () {
			groups = g1.selectAll(".crowd-group")
			.data(sb.crowds.toDraw.parties.concat(sb.crowds.toDraw.nonVoters))
			.enter()
			.append("g")
			.attr("class", "crowd-group")
			.attr("transform", function (d, i) {
				var x = ((d.offset.x*sb.crowds.multiplier)+sb.crowds.centerOffset.x)
				var y = ((d.offset.y*sb.crowds.multiplier)+sb.crowds.centerOffset.y)
				return "translate("+x+","+y+")"
			})

			circles = groups
			.append("circle")
			.attr("cx", 0)
			.attr("cy", 0)
			.attr("r", function (d, i) {
				return d.radius * sb.crowds.multiplier;
			})
			.attr("fill", function (d, i) {
				if (d.id == "nonVoters") {
					return sb.getColour(d.id);
				}
				return utility.adjustColour(sb.getColour(d.id), "l", 0.6, 0.7);
			})
			.attr("opacity", 0.75)
			.on("mouseover", function (d, i) {
				var partyInfo = sb.currentConstituency.candidate.filter(function (a) {
					if (a.party._value == d.id) {
						return a;
					}
				});

				var content = "";

				if (partyInfo.length > 0) {
					partyInfo = partyInfo[0];
					content += "<h3>"+d.id+"</h3>"
					content += "<p>candidate:\t"+partyInfo.fullName._value+"</p>"
					content += "<p>votes:\t"+partyInfo.numberOfVotes+"</p>"
					content += "<p>place:\t"+partyInfo.order+"</p>"
				} 
				else if (d.id == "nonVoters") {
					content += "<p>non voters:\t"+d.data.length+"</p>";
				}

				sb.notify({
					type : "update-tooltip",
					data: {
						x: ((d.offset.x*sb.crowds.multiplier)+sb.crowds.centerOffset.x) +(d.radius* sb.crowds.multiplier)+10,
						y: ((d.offset.y*sb.crowds.multiplier)+sb.crowds.centerOffset.y),
						content: content,
					}
				});

			})
			.on("mouseout", function (d, i) {
				sb.notify({
					type : "hide-tooltip",
					data: null,
				});
			})

			/*groups
			.append("text")
			.text(function (d, i) {
				return d.id;
			})
			.attr("fill", "white");*/
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
					var x = ((d.offset.x*sb.crowds.multiplier)+sb.crowds.centerOffset.x)
					var y = ((d.offset.y*sb.crowds.multiplier)+sb.crowds.centerOffset.y)
					return "translate("+x+","+y+")"
				})

				circles
				.attr("r", function (d, i) {
					return d.radius * sb.crowds.multiplier;
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