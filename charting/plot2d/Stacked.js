define(["dojo/_base/declare", "./Default", "./commonStacked"], 
	function(declare, Default, commonStacked){

	return declare("dojox.charting.plot2d.Stacked", Default, {
		// summary:
		//		Like the default plot, Stacked sets up lines, areas and markers
		//		in a stacked fashion (values on the y axis added to each other)
		//		as opposed to a direct one.
		getSeriesStats: function(){
			// summary:
			//		Calculate the min/max on all attached series in both directions.
			// returns: Object
			//		{hmin, hmax, vmin, vmax} min/max in both directions.
			var stats = commonStacked.collectStats(this.series);
			this._maxRunLength = stats.hmax;
			return stats;
		},
		
		buildSegments: function(i, indexed){
			var run = this.series[i],
				max = indexed?Math.min(run.data.length-1, Math.ceil(this._hScaler.bounds.to-this._hScaler.bounds.from)):Math.ceil(this._hScaler.bounds.to),
				rseg = null, segments = [];
			// split the run data into dense segments (each containing no nulls)
			// except if interpolates is false in which case ignore null between valid data
			for(var j = 0; j <= max; j++){
				var value = indexed ? commonStacked.getIndexValue(this.series, i, j) : commonStacked.getValue(this.series, i, j);
				if(value != null && (indexed || value.y != null)){
					if(!rseg){
						rseg = [];
						segments.push({index: j, rseg: rseg});
					}
					rseg.push(value);
				}else{
					if(!this.opt.interpolate || indexed){
						// we break the line only if not interpolating or if we have indexed data
						rseg = null;
					}
				}
			}
			return segments;
		}
		
	});
});
