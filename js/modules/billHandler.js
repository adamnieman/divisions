function billHandler (sb) {

	var bills = document.getElementsByClassName("bill");

	function INIT () {

		var i;
		var l = bills.length;
		for (i=0; i<l; i++) {
			sb.addEvent(bills[i], "click", makeRequest);
		}

		sb.listen({
			listenFor: ["bill-data-return"],
			moduleID: this.moduleID,
			moduleFunction: "receiveBillData",
		})
	}

	function makeRequest () {
		var url = this.getAttribute("value");
		
		if(debug.check(url, "No url assoiated with this bill - unable to make data request")){
			return;
		}

		sb.notify({
			type : "start-load",
			data: null,
		})

		sb.notify({
			type : "httpGet",
			data: {
				url: url,
				responseType: "bill-data-return",
			}
		})
	}
	
	function DESTROY () {
		sb.unlisten(this.moduleID)
	}

	function RECIEVEBILLDATA (d) {
		var data = d.data.result.primaryTopic
		//debug.dbg("\nAyes: "+data.AyesCount[0]._value+"\nNoes: "+data.Noesvotecount[0]._value+"\nDid not vote: "+data.Didnotvotecount[0]._value);
		
		bill = new index.Bill(data.title, data.date._value);
		bill.setVotesCount({
			aye: +data.AyesCount[0]._value,
			no: +data.Noesvotecount[0]._value,
			abstain: +data.AbstainCount[0]._value ? 0 : sb.totalMPs-(+data.Noesvotecount[0]._value)-(+data.AyesCount[0]._value),
			nonVoter: +data.Didnotvotecount[0]._value,
			error: +data.Errorvotecount[0]._value,
			nonEligible: +data.Noneligiblecount[0]._value,
			suspendedExpelled: +data.Suspendedorexpelledvotescount[0]._value
		})

		if (bill.isSet()) {
			sb.bill = bill;
			sb.notify({
				type : "get-votes",
				//type: "get-crowds",
				data: data.vote,
			})

		}
		else {
			sb.bill = null;
		}
	}

	return {
        init : INIT,
        receiveBillData: RECIEVEBILLDATA,
        destroy : DESTROY
    };
}