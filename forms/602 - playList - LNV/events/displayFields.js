function displayFields(form, customHTML) {
	var tot = totMarvinLoad("v1", {
		form: "com.totvs.marvin.server.js.Form-v1",
	})

	customHTML.append("<script type='text/javascript'>");
	customHTML.append("vm.viewMode = " + (form.getFormMode() == 'VIEW') + ";");
	customHTML.append("vm.WKNumProces = " + getValue("WKNumProces") + ";");
	customHTML.append("vm.WKNumState = " + getValue("WKNumState") + ";");
	customHTML.append("vm.init();");
	customHTML.append("$('#totForm').submit = () => alert('save');");
	customHTML.append("</script>");
	form.setHidePrintLink(true);

}

/*! totMarvinLoad - v1 - All rights reserverd */
function totMarvinLoad(a, h) { var b = {}; if (h == null) { return b } var d = new javax.naming.InitialContext().lookup("java:global/tot-marvin-" + a + "/MarvinLibLoaderEJB"); for (var c in h) { try { var g = new Function("lib", "return " + d.getLib(h[c])); b[c] = g(b) } catch (i) { log.error("*** Error compilando libreria " + lib + ":" + i) } } return b };
