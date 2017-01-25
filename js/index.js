var index = {

}



index.MpDatabase = function (_path) {

	//var path = "assets/current-mps-gender.csv"
	var path = "assets/current-mps-database-trimmed.csv"
	var db;

	this.lookup = function (_name) {
		if (debug.sentinel(db, "Mp database failed to load.") ||
			debug.sentinel(typeof _name == "string", "Invalid name of type '"+typeof _name+"' passed.")) {
			return;
		}

		var result = db.filter(function (d, i) {
			return d.fullName.toLowerCase() === _name.toLowerCase();//(d.firstName+" "+d.lastName).toLowerCase() === _name.toLowerCase();
		})

		if (debug.sentinel(result.length == 1, "No match for MP '"+_name+"' in database.")) {
			return;
		}

		return result[0];
	}

	var construct = function (_coordinates) {
		d3.csv(path, function (error, data) {
			if (debug.sentinel(!error, "Failed to load additional MP data.")){
				return;
			}
			db = data;
		})
	}

	construct();
}

index.Crowd = function (_coordinates) {

	var coordinates;
	var scale = {
		x: 1,
		y: 1,
	};

	var offset = {
		x: null,
		y: null,
	}
	var size = {
		width: null,
		height: null,
	}
	var limits = {
		maxX: null,
		minX: null,
		maxY: null,
		minY: null,
	}

	this.setOffset = function (x, y) {
		if (debug.sentinel(typeof x == 'number' && typeof y == 'number', "Invalid input - non-numerical. Failed to assign offset values.")) {
			return;
		}

		offset.x = x;
		offset.y = y;
	}

	this.getSize = function () {
		if (size.width == null) {
			setLimits();
		}

		return size;
	}

	this.setScale = function (x, y) {
		x = x || 1;
		y = y || 1;

		if (debug.sentinel(typeof x == 'number' && typeof y == 'number', "Invalid input - non-numerical. Failed to assign scale values.")) {
			return;
		}

		scale.x = x;
		scale.y = y

		var i;
		var l = coordinates.length;
		for (i=0; i<l; i++) {

			coordinates[i].x *= scale.x;
			coordinates[i].y *= scale.y;
		}

		setLimits();
	}

	this.getLimits = function () {
		if (limits.maxX == null) {
			setLimits();
		}

		return limits;
	}

	this.getCoordinates = function () {
		return coordinates;
	}

	this.getOffset = function () {
		return offset;
	}

	var setLimits = function () {
		limits.maxX = utility.arrayMax(coordinates, 'x');
		limits.minX = utility.arrayMin(coordinates, 'x');
		limits.maxY = utility.arrayMax(coordinates, 'y');
		limits.minY = utility.arrayMin(coordinates, 'y');
		setSize();
	}

	var setSize = function () {
		if (limits.maxX == null) {
			setLimits();
		}

		size.width = limits.maxX - limits.minX;
		size.height = limits.maxY - limits.minY;

	}

	this.sort = function () {
		coordinates.sort(function (a, b) {
			return a.y - b.y;
		})
	}

	this.getCoordinates = function () {return coordinates;}
	this.getIsometric = function () {return isometric;}

	var construct = function (_coordinates) {
		if(debug.sentinel(Array.isArray(_coordinates), "Coordinates passed as '"+typeof d+"' - coordimates passed here must be of type 'array'.")) {
			return;
		}

		coordinates = _coordinates;
		setLimits();
	}

	construct(_coordinates);
}

index.Vote = function (_name, _party, _result) {
	var name;
	var party;
	var gender;
	var constituency;
	var result;
	var set = false;

	this.isSet = function () {return set;}
	this.getName = function () {return name;}
	this.getParty = function () {return party;}
	this.getResult = function () {return result;}
	this.getConstituency = function () {return constituency;}
	this.getGender = function () {return gender;}

	var construct = function (_name, _party, _result) {
		if (debug.sentinel(typeof _name == "string", "Cannot construct Vote object by passing name input of type '"+typeof _name+"'.") ||
			debug.sentinel(typeof _party == "string", "Cannot construct Vote object by passing party input of type '"+typeof _party+"'.") ||
			debug.sentinel(typeof _result == "string", "Cannot construct Vote object by passing result input of type '"+typeof _result+"'.")){
			return;
		}

		name = _name;
		party = _party;

		switch (_result) {
			case "aye":
			case "no":
			case "abstain":
			case "nonVoter":
			case "error":
			case "nonEligible":
			case "suspendedExpelled":
				result = _result;
				set = true;
				break;
			default:
				debug.sentinel(false, "Invalid value passed as the result of "+name+"'s vote: '"+_result+"'.");
		}

		var lookup = index.db.lookup(name);
		if (lookup) {
			gender = lookup.gender;
			constituency = lookup.constituency;
		}
	}

	construct(_name, _party, _result);
}

index.Bill = function (_title, _date) {
	var title;
	var date;

	var set = false;
	var votes = {
		aye: null,
		no: null,
		abstain: null,
		nonVoter: null,
		error: null,
		nonEligible: null,
		suspendedExpelled: null,
	};
	var votesTotal = null;

	//setters

	this.setVotesCount = function (_input) {
		if (debug.sentinel(typeof _input == "object", "Cannot assign votes count by passing input of type '"+typeof _input+"'.")){
			return;
		}

		for (propt in _input) {
			if (debug.sentinel(votes.hasOwnProperty(propt), "Invalid property of input: '"+propt+"'.") ||
				debug.sentinel(typeof _input[propt] == 'number', "Invalid (non-numerical) value '"+_input[propt]+"' for property '"+propt+"'.") ||
				debug.sentinel(_input[propt] >= 0, "Invalid (negative) value '"+_input[propt]+"' for property '"+propt+"'.")) {
				continue;
			}
			/*if (votesCount[propt] != null) {
				debug.log("Reassigning value of '"+propt+"' from: '"+votesCount[propt]+"' to: '"+_input[propt]+"'.")
			}*/	
			votes[propt] = {
				count: _input[propt],
				array: [],
				crowd: null,//new Array(_input[propt]).fill(null),
			}
		}

		setVotesTotal();

		if (title && date) {
			set = true;
		}

	}

	this.setVote = function (_vote) {
		if (debug.sentinel(_vote instanceof index.Vote, "Invalid vote object passed - vote must be an instance of index.Vote.")) {
			return;
		}

		votes[_vote.getResult()].array.push(_vote);
	}

	this.setCrowd = function (_result, _crowd) {
		if (debug.sentinel(votes.hasOwnProperty(_result), "Could not assign crowd to nonexistant property '"+_result+"'.") ||
			debug.sentinel(_crowd instanceof index.Crowd, "Invalid crowd object passed - crowd must be an instance of index.Crowd.") ||
			debug.sentinel(_crowd.getIsometric, "Crowd is not isometric")) {
			return;
		}

		votes[_result].crowd = _crowd;
	}

	var setVotesTotal = function () {
		for (propt in votes) {
			if (votes[propt] != null) {
				votesTotal = votesTotal || 0;
				votesTotal += votes[propt].count;
			}
		}
	}


	//getters

	this.isSet = function () {return set;}
	this.getVotesTotal = function () {return votesTotal;}
	this.getVotes = function (_result, _i) {
	
		if (_result===undefined ||
			debug.sentinel(votes.hasOwnProperty(_result), "Could not get votes belonging to nonexistant property '"+_result+"'.")) {
			return votes;
		}
		if (_i===undefined ||
			debug.sentinel(typeof _i == "number" && i >= 0 && i < votes[_result].count, "Could not get vote belonging to property '"+_result+"' of invalid index '"+_i+"'.")) {
			return votes[_result];
		}

		return votes[_result].array[_i];
	}


	

	var construct = function (_title, _date) {
		if (debug.sentinel(typeof _title == "string", "Cannot construct Bill object by passing title input of type '"+typeof _title+"'.") ||
			debug.sentinel(typeof _date == "string", "Cannot construct Bill object by passing date input of type '"+typeof _date+"'.")){
			return;
		}

		title = _title;
		date = new Date(_date);
		if (debug.sentinel(!isNaN(date.getTime()), "Could not create valid date from the string '"+_date+"'.")) {
			date = null;
		}
	}

	construct(_title, _date);
}


index.sqrt2 = Math.sqrt(2);
index.db = new index.MpDatabase ()

