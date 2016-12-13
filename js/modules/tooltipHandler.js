function tooltipHandler (sb) {
	
	var tooltip = document.getElementById("tooltip");
	
	function INIT () {
		sb.listen({
			listenFor: ["update-tooltip"],
			moduleID: this.moduleID,
			moduleFunction: "update"
		})
		
		sb.listen({
			listenFor: ["hide-tooltip"],
			moduleID: this.moduleID,
			moduleFunction: "hide"
		})
		
		sb.listen({
			listenFor: ["show-tooltip"],
			moduleID: this.moduleID,
			moduleFunction: "show"
		})
		
		sb.listen({
			listenFor: ["update-tooltip-position"],
			moduleID: this.moduleID,
			moduleFunction: "updatePosition"
		})
		
		sb.listen({
			listenFor: ["update-tooltip-content"],
			moduleID: this.moduleID,
			moduleFunction: "updateContent"
		})
	}
	
	function UPDATECONTENT (data) {
		tooltip.innerHTML = data;
	}
	
	function UPDATEPOSITION (data) {
		var doc = document.documentElement;
		var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
		data.y += top;
		
		
		tooltip.style.left = data.x+"px";
		//console.log(tooltip.style.left)
		tooltip.style.top = data.y+"px";
		tooltip.style.right = "auto";

		
		var bounds = tooltip.getBoundingClientRect()
		if (bounds.right >= window.innerWidth) {
			tooltip.style.left = "auto";
			tooltip.style.right = (window.innerWidth - data.x)+"px";
		}
		
		//console.log(tooltip.style.left, tooltip.style.top, tooltip.style.right, "egg")
	}
	
	function UPDATE (data) {
		UPDATEPOSITION (data)
		UPDATECONTENT (data.content)
		SHOW ()
	}
	
	function HIDE () {
		tooltip.style.visibility = "hidden";
	}
	
	function SHOW () {
		tooltip.style.visibility = "visible";
	}
	
	function DESTROY () {
		sb.unlisten(this.moduleID)
		tooltip = null;
	}
	
	return { 
        init : INIT,
        updateContent: UPDATECONTENT,
        updatePosition: UPDATEPOSITION,
        update: UPDATE,
        hide: HIDE,
        show: SHOW,
        destroy : DESTROY
    }; 
}