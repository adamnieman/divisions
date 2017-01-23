function loadingHandler (sb) {

	var loading = document.getElementById("loading");

	function INIT () {
		sb.listen({
			listenFor: ["start-load"],
			moduleID: this.moduleID,
			moduleFunction: "start",
		})
		sb.listen({
			listenFor: ["stop-load"],
			moduleID: this.moduleID,
			moduleFunction: "stop",
		})
	}

	function START () {
		utility.addClass(loading, "active")
	}

	function STOP () {
		utility.removeClass(loading, "active")
	}
	

	function DESTROY () {
		sb.unlisten(this.moduleID)
	}

	return {
        init : INIT,
        start: START,
        stop: STOP,
        destroy : DESTROY
    };
}