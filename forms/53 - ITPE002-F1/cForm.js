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
		type: Number,
    	default: 4
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
<div>
  <h3 v-if="titleform != ''" class="text-center"> {{titleform}} </h3>
  <v-form class="d-flex flex-row flex-wrap">
    <v-col
      v-for="i in inputs"
      :key="i"
      :cols="mdsize"
    >
      <v-text-field
        :label="labelsname[i - 1]"
        outlined
      ></v-text-field>
    </v-col>
  </v-form>
</div>
  `,
})