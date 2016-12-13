function dropdownHandler (sb) {

	var dropdowns = document.getElementsByClassName("dropdown-wrapper")
	var title = document.getElementById("dropdown-title");

	function INIT () {
		var i;
		var l = dropdowns.length;
		for (i = 0; i < l; i++){
			sb.addEvent(dropdowns[i], "click", handleDropdown)
		}
		
		document.addEventListener("click", closeAllDropdowns)

		sb.listen({
			listenFor: ["constitSelected"],
			moduleID: this.moduleID,
			moduleFunction: "handleTitle",
		})
	}

	function closeAllDropdowns () {
		for (var i = 0; i < dropdowns.length; i++){
			utility.removeClass(dropdowns[i], "active")
		}
		//return false
	}

	function handleDropdown (event) {
		
		event.stopPropagation ? event.stopPropagation() : (event.cancelBubble=true)
		
		var cls = "active"
		if (utility.containsClass(this, cls)){
			utility.removeClass(this, cls)
		}
		else {
			utility.addClass(this, cls)
		}
	}

	function HANDLETITLE (d) {
		title.innerHTML = d.constituency.label._value;
	}

	function DESTROY () {
		sb.unlisten(this.moduleID)

		handleDropdown, closeAllDropdowns, dropdowns, title = null;
	}

	return {
        init : INIT,
        handleTitle : HANDLETITLE,
        destroy : DESTROY
    };
}

