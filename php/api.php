<?php

class api {

	protected $url;
	protected $method;
	protected $result;

	function __construct ($method, $url) {
		$this->method = $method;
		$this->url = $url;

		$this->handle_call();
	}

	public function getResult () {
		return $this->result;
	}

	protected function handle_call () {
		$this->result = json_decode($this->call ($this->method, $this->url));
	}

	protected function call ($method, $url, $data = false) {
		$curl = curl_init();

	    switch ($method) {
		    case "POST":
		        curl_setopt($curl, CURLOPT_POST, 1);

	            if ($data)
	                curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
	            break;
		    case "PUT":
		        curl_setopt($curl, CURLOPT_PUT, 1);
		        break;
		    default:
		        if ($data)
		            $url = sprintf("%s?%s", $url, http_build_query($data));
		}

		// Optional Authentication:
		curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
		curl_setopt($curl, CURLOPT_USERPWD, "username:password");

		curl_setopt($curl, CURLOPT_URL, $url);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

		$result = curl_exec($curl);

		curl_close($curl);

		return $result;
	}
}

?>