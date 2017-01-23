<html>
<head>
	<link rel="stylesheet" type="text/css" href="css/reset.css">
	<link rel="stylesheet" type="text/css" href="css/desktop.css">
	<script src = "js/libs/d3.js"></script>
	<script src = "js/debug.js"></script>
	<script src = "js/index.js"></script>
	<script src = "js/utility.js"></script>
	<script src = "js/core.js"></script>
</head>
<body>
<div id = "mother">
	<div id = "bills" class="left">
	<h2>Select a bill</h2> 
	<?php
		include "php/stdlib.php";

		$api = new comm_div_api("GET", "http://lda.data.parliament.uk/commonsdivisions.json");
		$comm_divs = $api->getResult();

		$i;
		$l = count($comm_divs);


		for ($i=0; $i<$l; $i++) {
			$url = str_replace("http://", "http://lda.", $comm_divs[$i]->_about);
			$url .= ".json";


			echo "<p class='bill' value='{$url}'>{$comm_divs[$i]->title}</p>";
		}
	?>
	</div>
	<div id = "vis" class = "right">
		<div id = "loading" class = "vertically-centered-wrapper">
			<div class = "vertically-centered">
				<h1>loading</h1>
			</div>
		</div>
	</div>
</div>
<p id = "test"></p>
<div id = "tooltip"> 
</div>
</body>
</html>