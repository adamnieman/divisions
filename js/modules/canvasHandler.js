function canvasHandler (sb) {

	function INIT () {
		setup.call(this);

		sb.listen({
			listenFor: ["newCrowd"],
			moduleID: this.moduleID,
			moduleFunction: "receive",
		})

		sb.listen({
			listenFor: ["constitSelected"],
			moduleID: this.moduleID,
			moduleFunction: "erase",
		})

		sb.listen({
			listenFor: ["resizeTrigger"],
			moduleID: this.moduleID,
			moduleFunction: "resize",
		})
	}

	function setup () {
		var container = document.getElementById("vis");

		var base = d3.select(container);

		var chart = base.append("canvas")
  			.attr("width", sb.w)
  			.attr("height", sb.h);

		var ctx = chart.node().getContext("2d");

		function RECEIVE () {
			drawController()
		}

		function ERASE () {
			ctx.clearRect(0,0,sb.w,sb.h);
			//ctx.fillStyle = "rgba(0, 0, 0, 0)"//"#ffffff";
            //ctx.fillRect(0,0,w,h);
            ctx.fillStyle = "#000000";
		}


		function drawController () {
			if (sb.crowds.toDraw.nonVoters) {
				var i;
				var l = sb.crowds.toDraw.parties.length;
				for (i=0; i<l; i++) {
					draw(sb.crowds.toDraw.parties[i].offset, sb.crowds.toDraw.parties[i].data);
				}
				draw(sb.crowds.toDraw.nonVoters.offset, sb.crowds.toDraw.nonVoters.data);
			}
		}

		function draw (offset, data) {

			var i;
			var l = data.length;
			for (i=0; i<l; i++) {
				ctx.beginPath();
					//context.arc(x-center, y-center, radius, startAngle, endAngle, counterclockwise)
					//A circle would thus look like:
				ctx.arc(
						((data[i].x+offset.x)*sb.crowds.multiplier)+sb.crowds.centerOffset.x, //x-pos
						((data[i].y+offset.y)*sb.crowds.multiplier)+sb.crowds.centerOffset.y, //y-pos
						(sb.min/5)*sb.crowds.multiplier, //radius
						0,
						2 * Math.PI,
						true
					);				
					ctx.fill();
					ctx.closePath();
				}
		}

		function RESIZE () {

    		chart
  			.attr("width", sb.w || container.offsetWidth)
  			.attr("height", sb.h || container.offsetHeight);

    		ERASE();
    		drawController();
		}

		function _DESTROY () {
			container, base, chart, ctx = null;
			drawController, draw = null;
		}

		this.erase = ERASE;
		this.receive = RECEIVE;
		this.resize = RESIZE;
		this._destroy = _DESTROY;
		//this.draw = DRAW;
	}
	
	function DESTROY () {
		sb.unlisten(this.moduleID)
		setup = null;
		this._destroy()
	}

	return {
        init : INIT,
        destroy : DESTROY
    };
}