Vue.component('c-header', {
	props: {
		title1: {
			type: String,
			default: ''
		},
		title2: {
			type: String,
			default: ''
		},
		title3: {
			type: String,
			default: ''
		},
		title4: {
			type: String,
			default: ''
		},
		logoContreras: {
			type: String,
			default: ''
		},
		logoCliente: {
			type: String,
			default: ''
		},
	},
	template: `
    <v-row no-gutters>
      <v-col align="center" justify="center">
        <v-sheet class="pa-2 ma-2">
          <v-img src="logoContreras" alt="Logo Contreras"></v-img>
        </v-sheet>
      </v-col>
      <v-col align="center" justify="center">
    	<v-sheet class="pa-2 ma-2 text-center">
      		<p v-if="title1 != ''" class="mb-1"> {{title1}} </p>		
      		<p v-if="title2 != ''" class="mb-1"> {{title2}} </p>	
      		<p v-if="title3 != ''" class="mb-1"> {{title3}} </p>
      		<p v-if="title4 != ''" class="mb-1"> {{title4}} </p>
    	</v-sheet>
      </v-col>
      <v-col align="center" justify="center">
        <v-sheet class="pa-2 ma-2">
          <v-img src="logoCliente" alt="Logo Contreras"></v-img>
        </v-sheet>
      </v-col>
    </v-row>
  `,
})