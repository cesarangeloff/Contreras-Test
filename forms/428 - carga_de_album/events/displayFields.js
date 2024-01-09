function displayFields(form, customHTML) {
	customHTML.append("<script type='text/javascript'>");
	customHTML.append("vm.viewMode = " + (form.getFormMode() == 'VIEW') + ";");
	customHTML.append("vm.WKNumProces = " + getValue("WKNumProces") + ";");
	customHTML.append("vm.WKNumState = " + getValue("WKNumState") + ";");
	customHTML.append("vm.init();");
	customHTML.append("</script>");
}