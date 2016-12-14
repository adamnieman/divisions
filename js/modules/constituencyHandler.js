function constituencyHandler (sb) {
	
	function INIT () {
		sb.listen({
			listenFor: ["ready"],
			moduleID: this.moduleID,
			moduleFunction: "request",
		})

		sb.listen({
			listenFor: ["receiveConstits"],
			moduleID: this.moduleID,
			moduleFunction: "receive",
		})

		sb.constits = [];
	}
	
	function REQUEST (d) {
		d = d || sb.dataUrlRoot+"electionresults.json?";
		//d = d+"&&_pageSize=500";
		d = d+"&&_pageSize=10"

		sb.notify({
			type : "httpGet",
			data: {
				url: d,
				responseType: "receiveConstits"
			}
		})
	}

	function RECEIVE (d) {
		debug.sentinel("No return from DDP", d.data.result);

		d = d.data.result;
		sb.constits = sb.constits.concat(d.items);
		if ((d.startIndex + d.itemsPerPage) <= 30/*d.totalResults*/) {
			REQUEST(d.next)
		}
		else {
			append();
		}
		
	}

	function append () {

		d3.select("#constituency-dropdown").selectAll("li")
		.data(sb.constits)
		.enter()
		.append("li")
		.attr("class", "constituency-selector")
		.text(function (d, i) {
			return d.constituency.label._value;
		})
		.on("click", function (d, i) {
			sb.notify({
				type : "constitSelected",
				data: d
			})
		})

	}



	function DESTROY () {
		sb.unlisten(this.moduleID)
		append = null;
	}

	return {
		request: REQUEST,
		receive: RECEIVE,
        init : INIT,
        destroy : DESTROY
    };
}