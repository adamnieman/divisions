 function crowdHandler (sb) {

	var crowdUrlRoot = "crowd/crowd-call.php?";

	function INIT () {
		sb.listen({
			listenFor: ["constitSelected"],
			moduleID: this.moduleID,
			moduleFunction: "request",
		})

		sb.listen({
			listenFor: ["receiveConstit"],
			moduleID: this.moduleID,
			moduleFunction: "receive",
		})
	}

	function REQUEST (d) {
		if (d.hasOwnProperty("_about")) {
			var index = d._about.search(/[0-9]{6}/);
			if (index > -1) {
				sb.notify({
					type : "httpGet",
					data: {
						url: sb.dataUrlRoot+"electionresults/"+d._about.substr(index, 6)+".json",
						responseType: "receiveConstit"
					}
				})

			} 
			else {
				debug.sentinel("Can't get constituency ID for "+d.constituency.label._value);
			}
		}
		else {
			debug.sentinel("Selected constituency does not appear to have valid data associated");
		}
	}

	function RECEIVE (d) {
		d=d.data.result.primaryTopic;
		sb.currentConstituency = d;

		var crowdsToGet = {
			nonVoters: d.electorate-d.turnout,
			spoiled: d.turnout, 
		}

		var i;
		var l = d.candidate.length;
		for (i=0; i<l; i++) {
			crowdsToGet.spoiled -= d.candidate[i].numberOfVotes;
			crowdsToGet[d.candidate[i].party._value] = d.candidate[i].numberOfVotes;
		}

		for (var propt in crowdsToGet) {
			notify(crowdUrlRoot+"value="+sb.min+" "+sb.max+" "+
				crowdsToGet[propt], propt);
		}
	}

	function notify (url, id) {
		sb.notify({
			type : "httpGet",
			data: {
				id: id,
				url: url,
				responseType: "receiveCrowd"
			}
		})
	}
	
	function DESTROY () {
		sb.unlisten(this.moduleID)
		crowdUrlRoot = null;
		notify = null;
	}

	return {
        init : INIT,
        request: REQUEST,
        receive: RECEIVE,
        destroy : DESTROY
    };
}