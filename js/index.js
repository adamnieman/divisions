var index = {

}

index.id_count = 0;

index.Constituency = function (name, electorate, parties_count) {
	if (debug.sentinel("Invalid input to Constituency constructor: Must be in the form (string, number, number)", typeof(name) == "string" && typeof(electorate) == "number" && typeof(parties_count) == "number")
		|| debug.sentinel("Invalid input to Constituency constructor: electorate and parties_count must be positive integers", electorate >= 0 && parties_count >= 0)) {
		this.init = false;
		return;
	}
	this.name = name;
	this.electorate = Math.floor(electorate);
	this.parties_count = Math.floor(parties_count);
	this.parties = [];
	this.init = true;

	//public functions
	this.add_party = function (name, candidate, votes) {
		this.parties.push(new index.Party(name, candidate, votes));
		if (this.parties.length == this.parties_count) {
			add_non_voters.call(this);
			sort_parties.call(this);
			add_place.call(this);
		}
	}

	//private functions
	function add_non_voters () {
		
		var i;
		var l=this.parties_count;
		var nv = this.electorate;

		for (i=0; i<l; i++) {
			nv -= this.parties[i].votes;
		}

		if (!debug.sentinel("Number of voters greater than the total electorate", nv >= 0)) {
			this.parties.push(new index.Party("non voters", undefined, nv));
		}
	}

	function sort_parties () {
		this.parties.sort(function(a, b) {
			return b.votes - a.votes;
		})
	}

	function add_place () {
		var i;
		var l = this.parties.length;
		var pl = 1;
		for (i=0; i<l; i++) {
			if (this.parties[i].name == "non voters") {
				this.parties[i].place = "N/A";
			}
			else {
				this.parties[i].place = pl;
				pl++;
			}
		}
	}
}

index.Party = function (name, candidate, votes) {
	if (debug.sentinel("Invalid input to Party constructor: Must be in the form (string, string, number)", typeof(name) == "string" && typeof(votes) == "number")
		|| debug.sentinel("Invalid input to Party constructor: votes must be a positive integer", votes >= 0)) {
		this.init = false;
		return;
	}
	this.place;
	this.name = name
	this.candidate = typeof(candidate) == "string" ? candidate : undefined;
	this.votes = Math.floor(votes);
	this.id = index.id_count++;
	this.crowd;
	this.r;
	this.x;
	this.y;
	this.init = true;
	
	this.add_crowd = function (data) { 
		if (!debug.sentinel("Number of "+this.name+" voters not equal to length of data", this.votes == data.length)) {
			this.crowd = data
			add_radius.call(this);
		}
	}

	function add_radius () {
		var width = utility.arrayMax(this.crowd, "x")-utility.arrayMin(this.crowd, "x")
		var height = utility.arrayMax(this.crowd, "y")-utility.arrayMin(this.crowd, "y")

		this.r = utility.avg([width, height])/2;
	}
}

/*var C = new index.Constituency ("sussex", 13, 2);

//how to check and object is of specific type: 
//C.constructor == index.Constituency;

console.log(C);

C.add_party("conservative", "david", 2);
C.add_party("labour", "johnny", 3);


console.log(C.parties[0]);
console.log(C.parties[1]);
console.log(typeof(undefined), typeof("hello"));*/






