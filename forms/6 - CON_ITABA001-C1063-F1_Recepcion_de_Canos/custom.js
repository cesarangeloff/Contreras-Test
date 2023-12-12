var	totFormOpts = {
  jsonModelFields: 30,	
  WKUser: null,
  WKNumProces: null,
  WKNumState: null,
  WKDef: null
};

Vue.config.devtools = true;
Vue.directive('mask', VueMask.VueMaskDirective);
Vue.use('vue-moment');

const vm = new Vue({
  el: '#app',
  vuetify: new Vuetify(),
//  store: store,
  
  data(){ 
    return {
	  viewMode: true,
	  tab: null,
	  
	  
	  model: {       
	  },
	  
	  
    required: [
      v => !!v || "Campo requerido"
    ],
    
      
    }
  },
  
  computed: {
	
  },
  
  methods: {
	
	
  init() {
		
				
		this.loadModel();
		
	},
	
    
    loadModel(){
      let data = '';
      for (let i = 1; i <= totFormOpts.jsonModelFields; i++) {
        data += document.getElementById('jsonModel_'+i).getAttribute('value') || '';
      }	
      try {
        data = JSON.parse(data)
        this.model = {
          ...this.model,
          ...data
        }
        data = null;      
      }catch (e) {
      }
      
    },
    
    save(){
    	
      if (!this.validate()) {
    	  return
      }
      
      console.log('Saving form data ...');
      
      console.log(JSON.stringify(this.model));
      const arr = this.chunkSubstr(JSON.stringify(this.model), 65000);
      
      if (arr.length > arqFormOpts.jsonModelFields) {
    	  throw "Muchos datos"
      }
      
      for (let i = 0; i < arqFormOpts.jsonModelFields; i++) {
        this.$refs['jsonModel_' + (i+1)].value = i<arr.length? arr[i] : ''
      }

      
      console.log('Form data saved.')
      
	},
	
  	
  	validate(){
  	  // TODO: implementar las validaciones aca
  	  document.getElementById('__error').value = 'SUCCESS'
  	  return true;
  	},
  	
    
  }
})