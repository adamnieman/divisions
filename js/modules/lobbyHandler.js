function lobbyHandler (sb) {
	function INIT () {
		sb.listen({
			listenFor: ["request-lobbies"],
			moduleID: this.moduleID,
			moduleFunction: "setup",
		})
	}

	function SETUP (d) {

		var padding = sb.fontSize*2;
		var lobbyWidth, lobbyGroupHeight, lobbyHeight;

		calcLobbyDimens()

		var results = ["aye", "no"];

		var lobbyGroups = d.selectAll(".lobby-group")
		.data(results)
		.enter()
		.append("g")
		.attr("class", "lobby-group")
		.attr("transform", function (d, i) {
			var x = (padding*(i+1)) + (lobbyWidth*i);
			var y = padding;

			return "translate("+x+", "+y+")";
		})

		var lobbyLabels = lobbyGroups
		.append("text")
		.text(function (d) {
			return d;
		})
		.attr("x", lobbyWidth/2)
		.attr("y", sb.fontSize)
		.attr("text-anchor", "middle");

		var lobby = lobbyGroups
		.append("g")
		.attr("transform", "translate(0,"+(sb.fontSize+padding)+")")

		/*var lobbyBody = lobby
		.append("rect")
		.attr("id", function (d) {
			return d+"-zone"
		})
		.attr("x", sb.fontSize)
		.attr("y", sb.fontSize)
		.attr("width", lobbyWidth-(sb.fontSize*2))
		.attr("height", lobbyHeight-(sb.fontSize*2))
		.attr("fill", "none");*/

		var lobbyOutline = lobby
		.append("rect")
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", lobbyWidth)
		.attr("height", lobbyHeight)
		.attr("fill", "none")
		.attr("stroke", "black")
		.attr("stroke-width", padding/4);

		var lobbyDoor = lobby
		.append("line")
		.attr("x1", (lobbyWidth/2)-(padding*2))
		.attr("y1", lobbyHeight)
		.attr("x2", (lobbyWidth/2)+(padding*2))
		.attr("y2", lobbyHeight)
		.attr("stroke", "#ffffff")
		.attr("stroke-width", padding/3);

		/*var abstain = d.append("rect")
		.attr("id", "abstain-zone")
		.attr("x", sb.lobbies.abstain.x)
		.attr("y", sb.lobbies.abstain.y)
		.attr("width", sb.lobbies.abstain.w)
		.attr("height", sb.lobbies.abstain.h)
		.attr("fill", "pink");*/

		function calcLobbyDimens () {
			lobbyWidth = (sb.w-padding*3)/2;
			lobbyGroupHeight = (sb.h-padding*3)*0.7;
			lobbyHeight = lobbyGroupHeight - sb.fontSize - padding;

			sb.lobbies.aye = {
				x: padding+sb.fontSize,
				y: (padding+sb.fontSize)*2,
				w: lobbyWidth-(sb.fontSize*2),
				h: lobbyHeight-(sb.fontSize*2)
			}
			sb.lobbies.no = {
				x: (padding*2)+lobbyWidth+sb.fontSize,
				y: (padding+sb.fontSize)*2,
				w: lobbyWidth-(sb.fontSize*2),
				h: lobbyHeight-(sb.fontSize*2)
			}
			sb.lobbies.abstain = {
				x: padding,
				y: (padding*2)+lobbyGroupHeight,
				w: sb.w - (padding*2),
				h: sb.h - (padding*3) - lobbyGroupHeight
			}
		}

		function RESIZE () {

			calcLobbyDimens();

			lobbyGroups
			.attr("transform", function (d, i) {
				var x = (padding*(i+1)) + (lobbyWidth*i);
				var y = padding;

				return "translate("+x+", "+y+")";
			})

			lobbyLabels
			.attr("x", lobbyWidth/2)

			/*lobbyBody
			.attr("width", lobbyWidth-(sb.fontSize*2))
			.attr("height", lobbyHeight-(sb.fontSize*2))
			*/

			lobbyOutline
			.attr("width", lobbyWidth)
			.attr("height", lobbyHeight)

			lobbyDoor
			.attr("x1", (lobbyWidth/2)-(padding*2))
			.attr("y1", lobbyHeight)
			.attr("x2", (lobbyWidth/2)+(padding*2))
			.attr("y2", lobbyHeight)

			/*
			abstain
			.attr("x", sb.lobbies.abstain.x)
			.attr("y", sb.lobbies.abstain.y)
			.attr("width", sb.lobbies.abstain.w)
			.attr("height", sb.lobbies.abstain.h)
			*/
		}

		function _DESTROY () {
			padding, lobbyWidth, lobbyGroupHeight, lobbyHeight, results = null;
			lobbyGroups, lobbyLabels, lobby, lobbyBody, lobbyOutline, lobbyDoor, abstain = null;
		}

		sb.resize.push(RESIZE);
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