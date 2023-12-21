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
		codigoobra: {
			type: String,
			default: ''
		},
		revision: {
			type: String,
			default: ''
		},
		imagencontreras: {
			type: String,
			default: 'no-img.png'
		},
		imagencliente: {
			type: String,
			default: 'no-img.png'
		},
		prefijoformulario: {
			type: String,
			default: ''
		},
		sufijoformulario: {
			type: String,
			default: ''
		}
	},
	template: `
				<div>
				    <v-row no-gutters>
					      <v-col class="d-none d-md-flex align-center justify-center">
					        <v-sheet class="pa-2 ma-2 d-flex" width="8rem">
					          <v-img :src="imagencontreras" alt="Logo Contreras" height="125" contain></v-img>
					        </v-sheet>
				          </v-col>
					      <v-col class="d-flex justify-center align-center">
						    <v-sheet class="pa-2 ma-2 text-center">
						      <p class="mb-1 text-uppercase text-h4"> {{title1}} </p>		
						      <hr class="my-5">
						      <div class="d-flex justify-space-around">
							  	<p border=true class="mb-1 text-uppercase text-subtitle-1">{{prefijoformulario}}{{codigoobra}}{{sufijoformulario}}</p>
							  </div>
						    </v-sheet>
					      </v-col>
					      <v-col class="d-none d-sm-flex align-center justify-center">
					        <v-sheet class="pa-2 ma-2 d-flex" width="8rem">
					          <v-img :src="imagencliente" alt="Logo cliente" height="125" contain></v-img>
					        </v-sheet>
					      </v-col>
				    </v-row>
				</div>
	  `
})