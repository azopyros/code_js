function _id(id){
	return document.getElementById(id);
}

function _tn(n){
	return document.getElementsByTagName(n);
}

function _n(n){
	return document.getElementsByName(n);
}

function _(css){
	return document.querySelectorAll(css);
}

function _cf(){
	return document.createDocumentFragment();
}

function _ce(el,nodeIns){
	_log(nodeIns);
	var elt = document.createElement(el);
	if(nodeIns)
		nodeIns.appendChild(elt);
	return elt;
}

function _ct(tx,nodeIns){
	var elt = document.createTextNode(tx);
	if(nodeIns)
		nodeIns.appendChild(elt);
	return elt;
}

function _cn(node, attribut, style, nodeIns){
	var elt = document.createElement(node);
	if(attribut){
		_each(attribut,function(a,b){
			if(a == "class") elt.className += b;
			else elt[a] = b;
		})
	}
	if(style){
		_each(style,function(a,b){
			elt.style[a] = b;
		})
	}
	if(nodeIns)
		nodeIns.appendChild(elt);
	return elt;
}

function _dn(node){
	node.parentNode.removeChild(node);
}

Node.prototype.deleteNode = function(){
	this.parentNode.removeChild(this);
}

function _each(o,f){
	for(var i in o){
		f(i,o[i]);
	}
}

function _log(n){
	console.log(n);
}

