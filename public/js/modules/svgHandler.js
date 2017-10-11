function svgHandler (sb) {
	function INIT () {
		sb.listen({
			listenFor: ["ready"],
			moduleID: this.moduleID,
			moduleFunction: "setup",
		})

		sb.listen({
			listenFor: ["got-crowds"],
			moduleID: this.moduleID,
			moduleFunction: "update",
		})

		sb.listen({
			listenFor: ["start-load"],
			moduleID: this.moduleID,
			moduleFunction: "reset",
		})
	}

	function SETUP () {

		var F = "M63.4,67.1c-4.2-10.8-7.9-21.8-12-32.7c-3.2-8.4-5.8-10.5-13.8-10.7v-2.7c3.2-2,5.4-5.6,5.4-9.6c0-6-5.4-11.2-11.7-11.3C25.1-0.1,19.9,5.2,20,11.5c0,4.2,2.1,7.6,5.4,9.5v2.6c-7.6,0.3-10.4,2.6-13.4,10.5C8,45,4.2,55.9,0,66.8C-1.4,70.3-0.5,72,2.9,73c3.1,1,5.2,1,6.3-2.9c2.6-8.7,5.7-17.3,8.8-25.9c0.5-1.3,1.8-2.3,2.7-3.5c0.1,1.6,0.7,3.2,0.3,4.7c-1,3.9-2.3,7.6-3.6,11.4C14,67.9,10.4,79.1,6.5,91c3.1,0,5.4,0.3,7.6-0.1c4.5-0.6,5.6,1.3,5.5,5.6c-0.3,12.3,0,24.7-0.1,37c-0.1,3.8,0.8,6.1,5.1,6.1c4.1,0,5.3-2.2,5.2-6.1c-0.2-11.7-0.1-23.3,0-35c0-2,0.5-4,0.7-6.1c0.6-0.1,1.3-0.2,1.9-0.2c0.5,1.9,1.3,3.9,1.3,5.8c0.1,12.2,0.2,24.3,0,36.5c-0.1,3.8,1.6,5.2,5,5c3-0.2,5.5-0.8,5.3-4.9c-0.2-6.5-0.1-13-0.1-19.5c0-8,0-15.9,0-24.2c4.3,0,8.1,0,12.6,0c-0.6-2.1-0.9-3.4-1.3-4.6c-4.4-13.6-8.8-27.1-13.1-40.7c-0.5-1.5,0-3.2,0-4.8c1.1,1.3,2.8,2.4,3.3,4c3,8.4,5.8,16.9,8.5,25.5c1.2,3.8,3.4,3.8,6.5,2.7C63.6,71.9,64.7,70.5,63.4,67.1z"
		var M = "M55.7,37.9c-0.1-8.4-5.1-13.1-13.6-13.3c-2.8-0.1-5.6-0.1-8.5-0.1v-3.4c3.3-1.9,5.5-5.4,5.5-9.7C39.1,5,34-0.1,27.8,0c-6.3,0-11.5,5.1-11.5,11.3c0,4,2,7.5,5.1,9.5v3.7c-2.4,0-4.9,0.1-7.3,0.1C5,24.8,0.2,29.5,0,38.5c-0.2,11.7,0.1,23.3-0.1,35c0,3.7,2.1,4.8,4.9,4.8c2.9,0,5.5-0.8,5.3-4.9c-0.3-6.5-0.1-13-0.1-19.5c0-3.3-0.1-6.7,0.1-10c0.1-0.8,1.3-1.5,2-2.3c0.6,0.8,1.6,1.5,1.8,2.4c0.3,1.3,0.1,2.7,0.1,4c0,28.3,0,56.7,0,85c0,6.4,1.1,7.6,6.2,7.6c5.7,0,5.5-3.7,5.5-7.8c-0.2-15.3-0.1-30.7-0.1-46c0-1.5-0.1-3.1,0.3-4.5c0.3-0.8,1.4-1.7,2.3-1.9c0.4-0.2,1.6,1,1.8,1.8c0.4,1.5,0.3,3,0.3,4.5c0.1,16,0.2,32,0,48c0,4.1,1.6,5.8,5.5,5.8c4,0,6.4-1.1,6.3-6C41.8,120,42,105.5,42,91c0-15-0.1-30-0.1-45.1c0-1.5,1.2-2.9,1.8-4.4c0.7,1.5,2,2.9,2,4.3c0.1,9.3,0.2,18.7,0,28c0,4,2.7,4.4,5.3,4.4c2.4,0,4.8-0.7,4.8-4.3C55.7,61.9,56,49.9,55.7,37.9z"

		var container = document.getElementById("vis");
		var padding = sb.fontSize*4;

		var data;

		var svg = d3.select(container).append("svg")
		.attr("width", sb.w)
		.attr("height", sb.h)

		//this group is for the lobbies
		var g1 = svg.append("g")

		//this group is for crowds
		var g2 = svg.append("g")
		var crowds;
		var votes;

		sb.notify({
			type : "request-lobbies",
			data: g1,
		})

		function RESET () {
			if (crowds) {
				if (votes) {
					votes = crowds.selectAll("circle")
					.data([])
					.exit()
					.remove()
				}

				crowds = g2.selectAll("g")
				.data([])
				.exit()
				.remove()
			}
		}

		function UPDATE () {
			data = sb.bill.getVotes();

			crowds = g2.selectAll("g")
			.data(Object.keys(data))
			.enter()
			.append("g")
			.attr("id", function (d, i) {
				return d+"-crowd";
			});

			votes_P = crowds.selectAll("g")
			.data(function(d) {
				if (data[d].crowd) {
					//map thi with the votes!!
					var crowd = data[d].crowd.getCoordinates()
					var votes = data[d].array;

					var rtn = crowd.map (function(x, i) {
						x.vote = (votes[i] && votes[i] instanceof index.Vote) ? votes[i] : null;
						return x;
					})

					return rtn;
				}
				else {
					return [];
				}
				//return data[d].crowd ? data[d].crowd.getCoordinates() : [];
			})
			.enter()
            .append("g")
            .attr("transform", function (d, i) {
            	//console.log(d);
            	return "translate("+d.x+","+d.y+")";
            })

			votes = votes_P
            .append("path")
            .attr("d", function (d, i) {
            	if (!d.vote) return F;

            	switch (d.vote.getGender()) {
            		case "Male":
            			return M;
            			break;
            		case "Female":
            			return F;
            			break;
            		default:
            			return F;
            			debug.sentinel(false, "Unknown gender: '"+d.vote.getGender()+"'");
            	}
            })
            .attr("transform", function (d, i) {
            	var bbox = this.getBBox();
            	var intendedHeight = 2.5*sb.fontSize;
            	var ratio = intendedHeight/bbox.height;

            	//translate x and translate y
            	var tX = -(ratio*bbox.width)/2
            	var tY = -(ratio*bbox.height)

            	return "scale("+ratio+") translate("+(-bbox.width/2)+","+(-bbox.height)+")";
            })
            .attr("fill", function (d, i) {
            	//return "red";
				if (!d.vote) return "black";
				return sb.getColour(d.vote.getParty());
			})
			.attr("stroke", function (d, i) {
				if (d.vote && d.vote.getParty() == "Scottish National Party") {
					return "#d39a00"
				}
				else return "white"
			})
			.attr("stroke-width", function (d, i) {
				if (d.vote && d.vote.getParty() == "Scottish National Party") {
					return 5
				}
				else return 2
			})
			.on("mouseover", function (d, i) {
				d3.select(this)
				.attr("stroke", "black")
				.attr("stroke-width", 5);

				if (d.vote) {
					var content = "";
					content += "<p>Name: "+d.vote.getName()+"</p>"
					content += "<p>Party: "+d.vote.getParty()+"</p>"
					content += "<p>Vote: "+d.vote.getResult()+"</p>"
					content += "<p>Constituency: "+(d.vote.getConstituency() || "data not available")+"</p>"
					content += "<p>Gender: "+(d.vote.getGender() || "data not available")+"</p>"
					
					

					sb.notify({
						type : "update-tooltip",
						data: {
							x: d3.event.clientX+sb.fontSize,
							y: d3.event.clientY+sb.fontSize,
							content: content,
						}
					});
				}
			})
			.on("mouseout", function (d, i) {
				d3.select(this)
				.attr("stroke", function (d, i) {
					if (d.vote && d.vote.getParty() == "Scottish National Party") {
						return "#d39a00"
					}
					else return "white"
				})
				.attr("stroke-width", function (d, i) {
					if (d.vote && d.vote.getParty() == "Scottish National Party") {
						return 5
					}
					else return 2
				})

				sb.notify({
					type : "hide-tooltip",
					data: null,
				});
			});

			/*votes = crowds.selectAll("circle")
			.data(function(d) {
				if (data[d].crowd) {
					//map thi with the votes!!
					var crowd = data[d].crowd.getCoordinates()
					var votes = data[d].array;

					var rtn = crowd.map (function(x, i) {
						x.vote = (votes[i] && votes[i] instanceof index.Vote) ? votes[i] : null;
						return x;
					})

					return rtn;
				}
				else {
					return [];
				}
				//return data[d].crowd ? data[d].crowd.getCoordinates() : [];
			})
			.enter()
			.append("circle")
			.attr("cx", function(d, i) {
				return d.x
			})
			.attr("cy", function(d, i) {
				return d.y
			})
			.attr("r", 2)
			.attr("fill", function (d, i) {
				if (!d.vote) return "black";
				return sb.getColour(d.vote.getParty());
			})
			.on("mouseover", function (d, i) {
				d3.select(this)
				.attr("r", 4);

				if (d.vote) {
					var content = "";
					content += "<p>Name: "+d.vote.getName()+"</p>"
					content += "<p>Party: "+d.vote.getParty()+"</p>"
					content += "<p>Vote: "+d.vote.getResult()+"</p>"
					content += "<p>Constituency: "+(d.vote.getConstituency() || "data not available")+"</p>"
					content += "<p>Gender: "+(d.vote.getGender() || "data not available")+"</p>"
					
					

					sb.notify({
						type : "update-tooltip",
						data: {
							x: d3.event.clientX+sb.fontSize,
							y: d3.event.clientY+sb.fontSize,
							content: content,
						}
					});
				}
			})
			.on("mouseout", function (d, i) {
				d3.select(this)
				.attr("r", 2);

				sb.notify({
					type : "hide-tooltip",
					data: null,
				});
			})*/

		}

		function RESIZE () {
			svg
			.attr("width", sb.w)
			.attr("height", sb.h);

			RESET ();

			sb.notify({
				type : "start-load",
				data: null,
			})

			sb.notify({
				type : "get-crowds",
				data: null,
			})
		}

		function _DESTROY () {
			container, svg, g1 = null;
		}

		sb.resize.push(RESIZE);
		this.reset = RESET;
		this.update = UPDATE;
		this._destroy = _DESTROY;

	}



	function DESTROY () {
		sb.unlisten(this.moduleID)
		this._destroy();
	}

	return {
        init : INIT,
        setup: SETUP,
        destroy : DESTROY
    };
}