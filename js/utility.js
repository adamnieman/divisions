//this required debug to work

var utility = {};

utility.avg = function (array) {

	var total = 0;

	var i=0;
	var l = array.length

	for (i=0; i<l; i++) {
		total += +array[i];
	}

	return total/l;
}

utility.round = function (value, dp) {
	if (debug.check(!(isNaN(value) || isNaN(dp)), "Cannot round if invalid number")) return null;
	var multiplier = Math.pow(10, dp);
	return Math.round(value*multiplier)/multiplier
}

utility.pad = function (n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

utility.addClass = function (elem, cls) {
	//adds cls to elem
	if (elem.classList) {
		elem.classList.add(cls);
	}
	else {
		if (elem.className.indexOf(cls) < 0) {
			elem.className += " "+cls;
		}
	}
}

utility.removeCurrentClassInstance = function (elems, cls) {
	//loops through array of elems, removes any instances of cls
	var i;
	var l = elems.length;
	for (i = 0; i < l; i++) {
		this.removeClass(elems[i], cls)
	}
}

utility.containsClass = function (elem, cls) {
	//checks if elem contains cls, returns true if it does
	
	//console.log(elem)
	var contains = false;
	
	if (elem.classList) {
		contains = elem.classList.contains(cls);
	}
	else {
		if (elem.className && elem.className.indexOf(cls) >= 0) {
			contains = true;
		}
	}
	
	return contains;
}

utility.removeClass = function (elem, cls) {
	//removes cls from elem
	if (elem.classList) {
		elem.classList.remove(cls);
	}
	else {
		if (elem.className.indexOf(cls) >= 0) {
			elem.className = elem.className.replace(cls, "")
		}
	}
}

utility.arrayMax = function (arr, key){
    var m = -Infinity,
        cur,
        i;
    for(i=0; i<arr.length; i++){
        cur = arr[i][key]
        if(cur > m){
            m = cur;
        }
    }
    return m;
}

utility.arrayMin = function (arr, key){
    var m = Infinity,
        cur,
        i;
    for(i=0; i<arr.length; i++){
        cur = arr[i][key]
        if(cur < m){
            m = cur;
        }
    }
    return m;
}


//hex is a hexadecimal string, flag is H, S, or L, func is a comparison function returning true or false
utility.adjustColour = function (hex, flag, min, max) {
	
	var col;

	//checks that hex is a valid hexadecimal colour string
	if (debug.sentinel("Invalid colour: "+hex+" - must be a hexadecimal string. Returning #ffffff.", /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(hex))) {
		return "#ffffff";
	}
	
	//checks for a valid flag, or assigns if undefined
	flag = flag || "l"
	if (debug.sentinel("Invalid flag: "+flag+" - must be a string or undefined. Returning "+hex+".", typeof(flag) === "string" ) || 
		debug.sentinel("Invalid flag: "+flag+" - must be H, S, L or undefined. Returning "+hex+".", /(^[hsl]$)/i.test(flag))) {
		return hex;
	}
	flag = flag.toLowerCase();

	//checks for a valid function, or assigns if undefined

	min = min || 0;
	max = max || 1;
	if (debug.sentinel("Invalid min value: "+min+" - must be a number greater than or equal to 0 and less than 1.", typeof(min) === "number" && min >= 0 && min < 1) ||
		debug.sentinel("Invalid max value: "+max+" - must be a number greater than 0 and less than or equal to 1.", typeof(max) === "number" && max > 0 && max <= 1) ||
		debug.sentinel("Invalid min and max values: "+min+", "+max+" - min must not exceed max.", min < max)) {
		return hex;
	}

	col = d3.hsl(hex);

	if (col[flag] < min) { col[flag] = min }
	else if (col[flag] > max) { col[flag] = max }

	return col;
}

if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(obj, start) {
	     for (var i = (start || 0), j = this.length; i < j; i++) {
	         if (this[i] === obj) { return i; }
	     }
	     return -1;
	}
}

if (!Math.cbrt) {
  Math.cbrt = function(x) {
    var y = Math.pow(Math.abs(x), 1/3);
    return x < 0 ? -y : y;
  };
}