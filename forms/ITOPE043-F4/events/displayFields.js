function displayFields(form, customHTML) {
	log.info('*********displayField')
	//customHTML.append("<script type='text/javascript'> console.log('texto que me guste') </script>");
	var currentUser = fluigAPI.getUserService().getCurrent();
//	tot.form.displayFields(form, customHTML);
	customHTML.append("<script type='text/javascript'>");
	customHTML.append("vm.viewMode = " + (form.getFormMode() == 'VIEW') + ";");
	customHTML.append("vm.WKNumProces = " + getValue("WKNumProces") + ";");
	customHTML.append("vm.WKNumState = " + getValue("WKNumState") + ";");
	customHTML.append("vm.WKDef = '" + getValue("WKDef") + "';");
	customHTML.append("vm.nombreUsuario = '" + currentUser.getFullName() + "';");
	customHTML.append("vm.init();");
	//	customHTML.append("$('#totForm')[0].onSerializeArray = () => vm.save();");
	//customHTML.append("$('#totForm')[0].onSerializeArray = () => console.log('vm.save()');");
	customHTML.append("</script>");
}