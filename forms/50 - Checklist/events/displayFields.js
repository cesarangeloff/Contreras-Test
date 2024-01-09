function displayFields(form, customHTML) {
	var tot = totMarvinLoad("v1", {
		form: "com.totvs.marvin.server.js.Form-v1",
	});
	tot.form.displayFields(form, customHTML);
	customHTML.append("<script type='text/javascript'>");
	customHTML.append("vm.WKNumProces = " + getValue("WKNumProces") + ";");
	customHTML.append("vm.viewMode = " + (form.getFormMode() == 'VIEW') + ";");
	customHTML.append("vm.init();");
	customHTML.append("$('#totForm')[0].onSerializeArray = () => vm.save();");
	//customHTML.append("$('#totForm')[0].onSerializeArray = () => console.log('vm.save()');");
	customHTML.append("</script>");
}

/*! totMarvinLoad - v1 - All rights reserverd */
function totMarvinLoad(a, h) { var b = {}; if (h == null) { return b } var d = new javax.naming.InitialContext().lookup("java:global/tot-marvin-" + a + "/MarvinLibLoaderEJB"); for (var c in h) { try { var g = new Function("lib", "return " + d.getLib(h[c])); b[c] = g(b) } catch (i) { log.error("*** Error compilando libreria " + lib + ":" + i) } } return b };