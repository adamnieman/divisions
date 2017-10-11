<?php
class comm_div_api extends api {

	protected $result = array();

	protected function handle_call () {

		$page_count = 0;
		$page_size = 5;
		$result;

		do {
			$url = $this->url."?_pageSize={$page_size}&_page={$page_count}";
			$result = json_decode($this->call ($this->method, $url));

			if(!is_array($result->result->items)) {
				break;
			}

			$this->result = array_merge($this->result, $result->result->items);

			$page_count++;

		} while (count($this->result) < 11 /*$result->result->totalResults*/);
	}
}
?>