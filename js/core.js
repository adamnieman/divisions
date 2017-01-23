var input = {
	scripts: [
	"billHandler",
	"voteHandler",
	"crowdHandler",
	"svgHandler",
	"lobbyHandler",
	"loadingHandler",
	"requestHandler",
	"resizeHandler",
	"tooltipHandler",
	"ready",
	]
} 

window.onload = function () {
	init()
}

var core = function (sandBox) {
	var modules = {}

	return {
		register: function (moduleID, creator) {
			modules[moduleID] = {
				creator: creator,
				instance: null
			};
		},
		start: function (moduleID) {
			modules[moduleID].instance = modules[moduleID].creator(sandBox);
			modules[moduleID].instance.moduleID = moduleID

			modules[moduleID].instance.init()
		},
		end: function (moduleID) {
			var module = modules[moduleID];
			if (module.instance){
				module.instance.destroy()
				module.instance = null;
			}
		},
		startAll: function () {
			for (var i = 0; i < Object.keys(modules).length; i++) {
				var moduleID = "mod"+i
				if (modules.hasOwnProperty(moduleID)){
					this.start(moduleID)
				}
			}
		},
		endAll: function () {
			//console.log(modules)
			var keys = Object.keys(modules);
			var length = keys.length;
			var i;
			for (i=0; i<length; i++) {
				var moduleID = keys[i];
				if (modules.hasOwnProperty(moduleID)){
					this.end(moduleID)
				}
			}


			/*for (var moduleID in modules){
				console.log(moduleID)
				//FUNDAMENTAL PROBLEM HERE. AS MODULES LENGTH DECREASES
				//THE LOOP DECREASES IN SIZE. THEREFORE ONLY THE FIRST HALF OF MODULES ARE ENDED.
				

				if (modules.hasOwnProperty(moduleID)){
					console.log(moduleID)
					this.end(moduleID)
				}
			}*/
		},

		modules: modules
	}
}

function init () {
	sandBox = {
		w: document.getElementById("vis").offsetWidth,
		h: document.getElementById("vis").offsetHeight,
		lobbies: {
			aye: {},
			no: {},
			abstain: {},
		},
		input: input,
		resize: [],
		multiplier: null,
		totalMPs: 650,
		min: 1,
		max: 5,
		fontSize: function () {
			var text = document.getElementById("test")
			var fontSize = window.getComputedStyle(test, null).getPropertyValue('font-size');
			fontSize = fontSize.replace("px", "");
			return parseFloat(fontSize);
		}(),
		colour: {
			nonVoters: "#dddddd",
			//spoiled: "#dddddd",
			"UK Independence Party": "#70147A",
			"Scottish National Party": "#FFFF00",
			"Green Party": "#6AB023",
			"Conservative": "#0087DC",
			"Liberal Democrat": "#FDBB30",
			"Labour": "#DC241f",
			"Labour (Co-op)": "#CC0000",
			"Social Democratic & Labour Party": "#99FF66",
			"Democratic Unionist Party": "#D46A4C",
			"Ulster Unionist Party": "#9999FF",
			"Plaid Cymru": "#008142",
			other: "#000000",
		},
		getColour: function (id) {
			if (this.colour.hasOwnProperty(id)) {
				return this.colour[id];
			}
			else { 
				debug.log("'"+id+"' has no assigned colour");
				return this.colour.other 
			}
		},
		addEvent: function (target, event, func) {
			target.addEventListener(event, func)
		},
		removeEvent: function (target, event, func) {
			target.removeEventListener(event, func)
		},
		notify : function (evt) {
			//console.log(evt)

			for (var i = 0; i < this.listening.length; i++){
				if (evt.type === this.listening[i].type){

					var targetModuleID = this.listening[i].moduleID
					var targetModuleFunction = this.listening[i].moduleFunction


					if (CORE.modules[targetModuleID]){
						if (CORE.modules[targetModuleID].instance[targetModuleFunction]){
							CORE.modules[targetModuleID].instance[targetModuleFunction](evt.data)
						}
					}
				}
			}
		},
		listen: function (evts) {
			//console.log(evts.listenFor)

			for (var i = 0; i <evts.listenFor.length; i++){
				this.listening.push({
					type: evts.listenFor[i],
					moduleID: evts.moduleID,
					moduleFunction: evts.moduleFunction
				})

			}
		},
		unlisten: function (moduleID){
			for (var i = 0; i < this.listening.length; i++){
				if (this.listening[i].moduleID === moduleID){
					this.listening.splice(i, 1)
				}
			}
		},
		listening: []

	}
	var CORE = core(sandBox)

	for (var i = 0; i < sandBox.input.scripts.length; i++) {
		var script = document.createElement("script")
		document.head.appendChild(script)
		script.onload = function () {
			var fn = eval(sandBox.input.scripts[this.i])
			CORE.register("mod"+this.i, fn)
			if (Object.keys(CORE.modules).length === sandBox.input.scripts.length) {

				CORE.startAll()
			}
		}
		script.i = i
		script.type = "text/javascript";
		script.src =  "js/modules/"+sandBox.input.scripts[i]+".js";

	}

	sandBox.addEvent(window, 'beforeunload', unload)

	function unload () {
		CORE.endAll()
		sandBox.removeEvent(window, 'beforeunload', unload)
	}

}

