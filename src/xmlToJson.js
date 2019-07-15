// Changes XML to JSON
const xml2json = function xmlToJson(xml) {

	// Create the return object
	let obj = {};

	if (xml.nodeType === 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
			for (let j = 0; j < xml.attributes.length; j++) {
				let attribute = xml.attributes.item(j);

				// Remove namespace attributes
				if(!attribute.nodeName.startsWith("xmlns")){
				    obj["@"+attribute.nodeName] = attribute.nodeValue;
                }
			}
		}
	}
	else if (xml.nodeType === 3) {
	    // text
		obj = xml.nodeValue.trim();
	}

	// do children
	if (xml.hasChildNodes()) {
		for(let i = 0; i < xml.childNodes.length; i++) {
			let item = xml.childNodes.item(i);
			let nodeName = item.nodeName;

			// Remove namespace
			if (nodeName.split(":").length > 1){
			    let ns = nodeName.split(":")
                nodeName = nodeName.replace(ns[0]+":", "")
            }

			if (typeof(obj[nodeName]) === "undefined") {
				obj[nodeName] = xmlToJson(item);
			} else {
				if (typeof(obj[nodeName].push) === "undefined") {
					let old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
	}
	return obj;
};

export default xml2json