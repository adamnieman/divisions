function crowdHandler (sb) {

	var requested = [];
	var crowdUrlRoot = "crowd/crowd-call.php?";

	function INIT () {
		sb.listen({
			listenFor: ["get-crowds"],
			moduleID: this.moduleID,
			moduleFunction: "requestCrowdData",
		})
	}

	function REQUESTCROWDDATA () {
		if (!sb.bill) {
			sb.notify({
				type : "stop-load",
				data: null,
			})
			return;
		}

		var votes = sb.bill.getVotes();

		for (var propt in votes) {
			if (votes[propt].count > 0) {
				
				//first attempt with random crowds:
				/*var c = crowdsBetween(
					votes[propt].count,
					sb.lobbies[propt].x,
					sb.lobbies[propt].x+sb.lobbies[propt].w,
					sb.lobbies[propt].y,
					propt == "abstain" ? sb.lobbies[propt].y+sb.lobbies[propt].h : sb.lobbies[propt].y+((sb.lobbies[propt].h/sb.totalMPs)*votes[propt].count)
				)*/

				//second attempt with calculate crowds
				/*var c = generateCoords().square({
					x: sb.lobbies[propt].x,
					w: sb.lobbies[propt].w,
					y: sb.lobbies[propt].y,
					h: propt == "abstain" ? sb.lobbies[propt].h : ((sb.lobbies[propt].h/sb.totalMPs)*votes[propt].count)
				
				}, votes[propt].count)*/

				var height = sb.lobbies[propt].h;


				var compare = null;
				if (propt == "aye") {
					compare = "no";
				}
				else if (propt == "no") {
					compare = "aye";
				}

				if (compare) {
					if (votes[propt].count < votes[compare].count) {
						height = (sb.lobbies[propt].h/votes[compare].count)*votes[propt].count;
					}
				}


				var c = SQUARE({
					x: sb.lobbies[propt].x,
					w: sb.lobbies[propt].w,
					y: sb.lobbies[propt].y,
					h: height,
				}, votes[propt].count)


				var crowd = new index.Crowd(c);
				crowd.sort();

				sb.bill.setCrowd(propt, crowd);
			}
		}

		sb.notify({
			type : "got-crowds",
			data: null,
		})

		sb.notify({
			type : "stop-load",
			data: null,
		})
	}

	function crowdsBetween (num, x1, x2, y1, y2) {

		x1 = x1 || 0;
		y1 = y1 || 0;
		x2 = x2 || 1;
		y2 = y2 || 1;

		var points = [];

		if (debug.sentinel(x1 < x2, "Second x co-ordinate must exceed the first") ||
			debug.sentinel(y1 < y2, "Second y co-ordinate must exceed the first")) {
			return 0;
		}

		var w = x2-x1;
		var h = y2-y1;

		var i;

		for (i=0; i<num; i++) {
			var point = {
				x: x1+(Math.random()*w),
				y: y1+(Math.random()*h),
			}

			points.push(point);
		}

		return points;
	}	

	/*function generateCoords () {

		debug,dbg("Hello testing 1 2 3")
		
		var recursions = 30;
		
		Math.dist=function(x1,y1,x2,y2){ 
		  if(!x2) x2=0; 
		  if(!y2) y2=0;
		  return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1)); 
		}
		//for square, dimensions = {w: , h: , x: , y: }
		//density = {points: , sqUnits: }
		
		function SQUARE (dimensions, numPoints) {

			debug.dbg("Number of points: "+numPoints);
			
			dimensions.x = dimensions.x ? dimensions.x : 0
			dimensions.y = dimensions.y ? dimensions.y : 0
			
			//density = density.points/density.sqUnits //gives the number of units per person
			
			var area = dimensions.w * dimensions.h
			numPoints = Math.round(numPoints);
			var pointArray = []
			
			var numRowsAndCols = Math.round(Math.cbrt(numPoints))
			
			
			
			var grid = {}
			
			for (var i = 0; i < numRowsAndCols; i++){
				grid[i] = {
					lowerBound: dimensions.y + (dimensions.h/numRowsAndCols)*i,
					upperBound: dimensions.y + (dimensions.h/numRowsAndCols)*(i+1)
				}
				for (var m = 0; m < numRowsAndCols; m++) {
					grid[i][m] = {
						lowerBound: dimensions.x + (dimensions.w/numRowsAndCols)*m,
						upperBound: dimensions.x + (dimensions.w/numRowsAndCols)*(m+1),
						points: []
					}
				}
			}
			
			for (var i = 0; i < numPoints; i++){
				
				var point;
				
				var ref = {
					row: 0,
					col: 0
				}
				
				var maxDistance = -Infinity; 
				
				
				for (var m = 0; m < recursions; m++){
					var p = {
						x: dimensions.x + Math.random()*dimensions.w,
						y: dimensions.y + Math.random()*dimensions.h
					}
					
					var minDistance = Infinity;
					
					var k = 0;
					while (p.y > grid[k].upperBound) {
						k++
					}
					
					var l = 0;
					while (p.x > grid[k][l].upperBound){
						l++
					}
					
					checkDistanceAgainst = []
					
					for (var n = -1; n < 2; n++){
						for (var q = -1; q < 2; q++){
							if (grid[k+n]){
								if (grid[k+n][l+q]){
									checkDistanceAgainst = checkDistanceAgainst.concat(grid[k+n][l+q].points)
								}
							}
						}
					}
					
					for (var n = 0; n < checkDistanceAgainst.length; n++){
						var distance = Math.dist(p.x, p.y, checkDistanceAgainst[n].x, checkDistanceAgainst[n].y)
						minDistance = distance < minDistance ? distance : minDistance
					}
					
					if (minDistance > maxDistance){
						point = p;
						ref.row = k,
						ref.col = l,
						maxDistance = minDistance;
					}
					
				}
				
				grid[ref.row][ref.col].points.push(point)
				
			}
			
			var k = 0
			while (grid[k]){
				var l = 0
				while (grid[k][l]) {
					pointArray = pointArray.concat(grid[k][l].points)
					l++
				}
				k++
			}
			
			return pointArray
		}
		
		function CIRCLE () {
			
		}
		
		return {
			square: SQUARE,
			circle: CIRCLE
		}
	};*/

	Math.dist=function(x1,y1,x2,y2){ 
		  if(!x2) x2=0; 
		  if(!y2) y2=0;
		  return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1)); 
		}

	function SQUARE (dimensions, numPoints) {

			var recursions = 30;

			dimensions.x = dimensions.x ? dimensions.x : 0
			dimensions.y = dimensions.y ? dimensions.y : 0
			
			//density = density.points/density.sqUnits //gives the number of units per person
			
			var area = dimensions.w * dimensions.h
			numPoints = Math.round(numPoints);
			var pointArray = []
			var numRowsAndCols = Math.round(Math.cbrt(numPoints))
			
			/*grid = {
				row1 = {
					upperBound
					lowerBound
					col1: {
						upperBound
						lowerBound
					}
				}
			}
			*/
			
			var grid = {}
			
			for (var i = 0; i < numRowsAndCols; i++){
				grid[i] = {
					lowerBound: dimensions.y + (dimensions.h/numRowsAndCols)*i,
					upperBound: dimensions.y + (dimensions.h/numRowsAndCols)*(i+1)
				}
				for (var m = 0; m < numRowsAndCols; m++) {
					grid[i][m] = {
						lowerBound: dimensions.x + (dimensions.w/numRowsAndCols)*m,
						upperBound: dimensions.x + (dimensions.w/numRowsAndCols)*(m+1),
						points: []
					}
				}
			}
			
			for (var i = 0; i < numPoints; i++){
				
				var point;
				
				var ref = {
					row: 0,
					col: 0
				}
				
				var maxDistance = -Infinity; 
				
				
				for (var m = 0; m < recursions; m++){
					var p = {
						x: dimensions.x + Math.random()*dimensions.w,
						y: dimensions.y + Math.random()*dimensions.h
					}
					
					var minDistance = Infinity;
					
					var k = 0;
					while (p.y > grid[k].upperBound) {
						k++
					}
					
					var l = 0;
					while (p.x > grid[k][l].upperBound){
						l++
					}
					
					checkDistanceAgainst = []
					
					for (var n = -1; n < 2; n++){
						for (var q = -1; q < 2; q++){
							if (grid[k+n]){
								if (grid[k+n][l+q]){
									checkDistanceAgainst = checkDistanceAgainst.concat(grid[k+n][l+q].points)
								}
							}
						}
					}
					
					for (var n = 0; n < checkDistanceAgainst.length; n++){
						var distance = Math.dist(p.x, p.y, checkDistanceAgainst[n].x, checkDistanceAgainst[n].y)
						minDistance = distance < minDistance ? distance : minDistance
					}
					
					if (minDistance > maxDistance){
						point = p;
						ref.row = k,
						ref.col = l,
						maxDistance = minDistance;
					}
					
				}
				
				grid[ref.row][ref.col].points.push(point)
				
			}
			
			var k = 0
			while (grid[k]){
				var l = 0
				while (grid[k][l]) {
					pointArray = pointArray.concat(grid[k][l].points)
					l++
				}
				k++
			}
			
			return pointArray
		}

	function DESTROY () {
		sb.unlisten(this.moduleID)
	}

	return {
        init : INIT,
        requestCrowdData: REQUESTCROWDDATA,
        destroy : DESTROY
    };
}