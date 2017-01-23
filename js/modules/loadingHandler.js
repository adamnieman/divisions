function loadingHandler (sb) {

	var loading = document.getElementById("loading");
	var loadCount = 0;

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
		loadCount++
		debug.dbg("LoadCount is: "+loadCount)
	}

	function STOP () {
		utility.removeClass(loading, "active")
		loadCount--;
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