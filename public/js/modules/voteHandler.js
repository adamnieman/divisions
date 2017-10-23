function voteHandler (sb) {
	
	var receiveCount = 0;


	function INIT () {
		sb.listen({
			listenFor: ["get-votes"],
			moduleID: this.moduleID,
			moduleFunction: "requestVoteData",
		})

		sb.listen({
			listenFor: ["vote-data-return"],
			moduleID: this.moduleID,
			moduleFunction: "receiveVoteData",
		})
	}

	function RECEIVEVOTEDATA (d) {
		receiveCount++

		var data = d.data.result.primaryTopic;
		var result = getVoteResult(data.type)

		var vote = new index.Vote(data.memberPrinted._value, data.memberParty, result);
		//debug.log("New vote: "+vote.getResult()+" - "+vote.getName()+" | "+vote.getParty());
		sb.bill.setVote(vote);

		if (receiveCount == (sb.bill.getVotesTotal()-sb.bill.getVotes("abstain").count)) {
			receiveCount = 0;

			sb.notify({
				type: "get-crowds",
				//type : "got-votes",
				data: null,
			})
		}
	}

	function REQUESTVOTEDATA (d) {
		if(debug.sentinel(Array.isArray(d), "Data type '"+typeof d+"' - data passed here must be of type 'array'.")) {
			return;
		}
		if (debug.check(d.length == (sb.bill.getVotesTotal()-sb.bill.getVotes("abstain").count), "Available vote details does not match number of votes")) {
			return;
		}

		var i;
		var l = d.length;

		for (i=0; i<l; i++) {
			var url = d[i];
			url = url.replace("http://", "http://lda.")
			url += ".json";

			sb.notify({
				type : "httpGet",
				data: {
					url: url,
					responseType: "vote-data-return",//"get-crowds",
					id: i,
				}
			})
		}
	}

	function getVoteResult (str) {
		var i = str.lastIndexOf("#");
		var res = str.substr(++i, str.length-1);

		switch (res) {
			case "AyeVote":
				res = "aye";
				break;
			case "NoVote":
				res = "no";
				break;
			default:
				debug.sentinel(false, "Failed to translate vote result '"+res+"' into a valid object property.")
		}

		return res;
	}

	function DESTROY () {
		sb.unlisten(this.moduleID)
	}

	return {
        init : INIT,
        receiveVoteData: RECEIVEVOTEDATA,
        requestVoteData: REQUESTVOTEDATA,
        destroy : DESTROY
    };
}