function svgInteractHandler (sb) {

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
		.attr("class", "front")
		.attr("width", sb.w)
		.attr("height", sb.h);

		//making 2 groups so the key will always sit on top of the circles regardless of when they are added

		var groups;
		var circles;


		function RECEIVE () {
			groups = svg.selectAll(".crowd-group")
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
			.attr("fill", "black")
			.attr("opacity", 0)
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
			container, svg, groups, circles = null;
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