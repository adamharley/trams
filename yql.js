var plannerUrl = "http://planner.supertram.net/default.aspx";
var yqlEndpointUrl = "https://query.yahooapis.com/v1/public/yql";
var fields = ["lblStart","lblStartTime","lblEnd","lblEndTime","lblChange","lblReturnStart","lblReturnStartTime","lblReturnEnd","lblReturnChange","lblFare"];
var params = {
	/*
		digits must be padded
		hours must be valid (05-01)
		minutes must be in 5 minute intervals
		IsEndTime: -1 = not required, 0 = departing at, 1 = arriving at
	*/
	"lnkGetResults.x": "0",
	"lnkGetResults.y": "0"
};

function getResults(newParams) {
	$.getJSON(
		yqlEndpointUrl,
		{
			q: "select * from html where url=\"" + plannerUrl +"\" and xpath=\"//input[@type='hidden']\"",
			format: "json"
		},
		function(result) {
			if (result.query.results && result.query.results.input) {
				newParams.forEach(function(input) {
					params[input.name] = input.value;
				});
				
				result.query.results.input.forEach(function(input) {
					params[input.name] = input.value;
				});
				
				$.getJSON(
					yqlEndpointUrl,
					{
						q: "select * from htmlpost where url=\"" + plannerUrl +"\" and postdata=\"" + $.param(params) + "\" and xpath=\"//pre|//span[@id='" + fields.join("']|//span[@id='") + "']\"",
						env: "store://datatables.org/alltableswithkeys",
						format: "json"
					},
					function(result) {
						if (result.query.results) {
							if (!result.query.results.postresult) { // invalid
								console.log("Invalid query");
							} else if (result.query.results.postresult.pre) { // error
								console.log(result.query.results.postresult.pre);
							} else {
								var fields = {};
								
								result.query.results.postresult.span.forEach(function(span) {
									fields[span.id] = span.content;
								});
								
								displayResults(fields);
							}
						}
					}
				);
			}
		}
	);
}