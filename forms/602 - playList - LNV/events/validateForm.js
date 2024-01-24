function validateForm(form) {
	// var tot = totMarvinLoad("v1", {
	// 	form: "com.totvs.marvin.server.js.Form-v1"
	// });

	// tot.form.validateForm(form);
}

/*! totMarvinLoad - v1 - All rights reserverd */
function totMarvinLoad(a, h) { var b = {}; if (h == null) { return b } var d = new javax.naming.InitialContext().lookup("java:global/tot-marvin-" + a + "/MarvinLibLoaderEJB"); for (var c in h) { try { var g = new Function("lib", "return " + d.getLib(h[c])); b[c] = g(b) } catch (i) { log.error("*** Error compilando libreria " + lib + ":" + i) } } return b };
