const Utils = {
		
  getDataset(datasetName, constraints = {}) {
	  return new Promise((resolve, reject) => {
		$.ajax({
			type: "POST",
			url: window.location.protocol + "//" + window.location.host + "/ecm/api/rest/ecm/dataset/datasets/",
			contentType: "application/json; charset=utf-8",
			dataType: "json",				
			data: JSON.stringify({
			  name : datasetName,
			  constraints: Object.keys(constraints)
			  					 .filter( (key) => constraints[key] !== null)
			                     .map((key, index) =>
				  			    ({
				  				  _field: key,
				  				  _initialValue: constraints[key],
				  				  _finalValue: constraints[key],
				  				  _type: 1
				  				})
				  			  )
			})
		})
		.done(function(dataset) {
		  if (dataset.values) {
		    dataset.values.forEach(e => {
		      for (attr in e) {
		        const value = e[attr];
		        if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}') ) {
		          try {
		            const obj = JSON.parse(value); 
		            e[attr] = obj;
		          } catch (ex){}
		        }
		      }
		    });
		  }
		  resolve(dataset)
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			reject(errorThrown)
		});		    
	  })   
  },
  
  debounce(func, timeout = 500){
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
  }
		
};