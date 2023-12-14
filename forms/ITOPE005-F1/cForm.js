Vue.component('c-form', {
	props: {
	    inputs: {
	        type: Number,
	        default: 1
	    },
	    titleform: {
	        type: String,
	        default: ''
	    },
		mdsize: {
	        type: Array,
	        default: function() {
	            return [];
	        }
		},
		labelsname: {
	        type: Array,
	        default: function() {
	            return [];
	        }
	    },
	},
	data(){
	    return {
	  	  loading: false,
		}
	},
	template: `
		<div class="pa-3">
		  <h3 v-if="titleform != ''" class="text-center"> {{titleform}} </h3>		
		  <v-form class="d-flex flex-row flex-wrap">
		  <v-col v-for="i in inputs" :key="i" :md="mdsize[i - 1]" cols="12">
			<v-text-field :label="labelsname[i - 1]" hide-details="auto" outlined></v-text-field>
		  </v-col>
		  </v-form>
		</div>
	  `,
})