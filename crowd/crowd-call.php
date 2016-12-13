<?php

	$num = $_GET["value"];

	//this for local
	$output = system('./crowd-generator '.$num, $return);


	//this for on server
	/*$output = exec("sudo -u martha ../../crowds/crowd-generator ".$num." 2>&1", $output, $return);

	echo $output;*/
?>