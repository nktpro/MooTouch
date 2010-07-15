(function(){
Element.implement({
    getOffsets: function(){
        var element = this, position = {x: 0, y: 0};
        if (isBody(this)) return position;

        while (element && !isBody(element)){
            position.x += element.offsetLeft;
            position.y += element.offsetTop;

            if (element != this && Browser.webkit){
                position.x += leftBorder(element);
                position.y += topBorder(element);
            }

            element = element.offsetParent;
        }

        return position;
    }
});
    
var styleString = Element.getComputedStyle;

function styleNumber(element, style){
	return styleString(element, style).toInt() || 0;
};

function borderBox(element){
	return styleString(element, '-moz-box-sizing') == 'border-box';
};

function topBorder(element){
	return styleNumber(element, 'border-top-width');
};

function leftBorder(element){
	return styleNumber(element, 'border-left-width');
};

function isBody(element){
	return (/^(?:body|html)$/i).test(element.tagName);
};

function getCompatElement(element){
	var doc = element.getDocument();
	return (!doc.compatMode || doc.compatMode == 'CSS1Compat') ? doc.html : doc.body;
};
})();