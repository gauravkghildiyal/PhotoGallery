
/**
* Opens the previous slide
* @param {None}
* @return {None}
*/
function goToPrevSlide(){
    //Check whether previous element exists
    if(!$(".prev").length){
        return ;
    }

    //previous element exists so continue animation

    //First remove any pending animation
    $("#slideshow div").css("animation-name","");

    var prevToPrev = $(".prevToPrev")
    prev = $(".prev"),
    active = $(".active"),
    next = $(".next"),
    nextToNext = $(".nextToNext"),
    newPrevToPrev = prevToPrev.prev();

    if (newPrevToPrev.length) {
        newPrevToPrev.addClass("prevToPrev");
    }

    if(nextToNext.length){
        nextToNext.removeClass("nextToNext");
    }

    if (prevToPrev.length) {
        slideElement(prevToPrev,"right",-230,"animatePrevToPrev");
        prevToPrev.attr("class","prev");
        prevToPrev.one("animationend", function(){
            prevToPrev.css("animation-name","");
        });
    }

    if(prev.length){
        slideElement(prev,"right",-115,"animatePrev");
        prev.attr("class","active");
        prev.one("animationend", function(){
            prev.css("animation-name","");
        });
    }

    if (active.length) {
        slideElement(active,"right",0,"animateActive");
        active.attr("class","next");
        active.one("animationend", function(){
            active.css("animation-name","");
        });
    }

    if (next.length) {
        slideElement(next,"right",115,"animateNext");
        next.attr("class","nextToNext");
        next.one("animationend", function(){
            next.css("animation-name","");
            $(".tempAnimation").remove();
        });
    }
}

/**
* Opens the next slide
* @param {None}
* @return {None}
*/
function goToNextSlide(){
    //Check whether next element exists
    if(!$(".next").length){
        return ;
    }

    //next element exists so continue animation

    //First remove any pending animation
    $("#slideshow div").css("animation-name","");


    var prevToPrev = $(".prevToPrev")
    prev = $(".prev"),
    active = $(".active"),
    next = $(".next"),
    nextToNext = $(".nextToNext"),
    newNextToNext = nextToNext.next();

    if(prevToPrev.length){
        prevToPrev.removeClass("prevToPrev");
    }
    if(newNextToNext.length){
        newNextToNext.addClass("nextToNext");
    }

    if (prev.length) {
        slideElement(prev,"left",-115,"animatePrev");
        prev.attr("class","prevToPrev");
        prev.one("animationend", function(){
            prev.css("animation-name","");
        });
    }

    if (active.length) {
        slideElement(active,"left",0,"animateActive");
        active.attr("class","prev");
        active.one("animationend", function(){
            active.css("animation-name","");
        });
    }

    if (next.length) {
        slideElement(next,"left",115,"animateNext");
        next.attr("class","active");
        next.one("animationend", function(){
            next.css("animation-name","");
        });
    }

    if (nextToNext.length) {
        slideElement(nextToNext,"left",230,"animateNextToNext");
        nextToNext.attr("class","next");
        nextToNext.one("animationend", function(){
            nextToNext.css("animation-name","");
            $(".tempAnimation").remove();
        });
    }
}

/**
* Opens the previous slide
* @param {dom_element} $element the element to be animated
* @param {String} direction the direction in which to animate
* @param {Number} initialPosition the initial x coordinates of the $element
* @param {String} animationName the name that has to be used for the keyframes
* @return {None}
*/
function slideElement($element,direction,initialPosition,animationName){
    var finalPosition, firstAngle, secondAngle;
    if(direction=="left"){
        finalPosition = initialPosition-115;
        firstAngle = -10;
        secondAngle = 10;
    }
    else if (direction=="right") {
        finalPosition = initialPosition+115;
        firstAngle = 10;
        secondAngle = -10;
    }
    //var keyframes = "@keyframes "+animationName+"{0%{transform:translateX("+initialPosition+"%) skewX(0);opacity:0.3;}68%{transform:translateX("+finalPosition+"%) skewX("+firstAngle+"deg);}80%{transform:translateX("+finalPosition+"%) skewX("+secondAngle+"deg);}88%{transform:translateX("+finalPosition+"%) skewX("+secondAngle+"deg);}100%{transform:translateX("+finalPosition+"%) skewX(0deg);opacity:1;}}";
    var keyframes = "@keyframes "+animationName+"{0%{transform:translateX("+initialPosition+"%) skewX(0);opacity:0.3;}68%{transform:translateX("+finalPosition+"%) skewX("+firstAngle+"deg);}80%{transform:translateX("+finalPosition+"%) skewX("+secondAngle+"deg);}88%{transform:translateX("+finalPosition+"%) skewX("+secondAngle+"deg);}}";
    //console.log(keyframes)
    $("head").append("<style class ='tempAnimation'>"+keyframes+"</style>");
    $element.css("animation-name",animationName);
}

$(document).on("click",".next",function(e){
    goToNextSlide();
});

$(document).on("click",".prev",function(e){
    goToPrevSlide();
});

//Mouse Wheel Event
$(document).on("mousewheel","#slideshow", function(e){
    if(e.originalEvent.wheelDelta > 0) {
        //Scrolling Up
        goToPrevSlide();
    }
    else{
        //Scrolling Down
        goToNextSlide();
    }
});

/**
* Closes the slide show
* @param {None}
* @return {None}
*/
function closeSlideshow(){
    //First check whether slide show is open
    if($("#slideshowWrapper").hasClass("scaleUpAndAppear")){
        //remove old classes
        $("#pagesContainer").removeClass("scaleUpAndDisappear");
        $("#slideshowWrapper").removeClass("scaleUpAndAppear");

        //add new classes
        $("#slideshowWrapper").addClass("scaleDownAndDisappear");
        $("#pagesContainer").addClass("scaleDownAndAppear");

        //Show footer
        var $element = $("footer");
        $element.css("bottom",0);
    }
}

//Add event listener for closeSlideshowButton
$(document).on("click","#closeSlideshowButtonSvg",closeSlideshow);


$(document).keyup(function(e) {
    switch(e.which) {
        case 27: // Escape Key
        closeSlideshow();
        break;
        case 37: // left
        goToPrevSlide();
        break;

        case 38: // up
        goToPrevSlide();
        break;

        case 39: // right
        goToNextSlide();
        break;

        case 40: // down
        goToNextSlide();
        break;

        default: return; // exit this handler for other keys

        //Prevent Defalu
        e.preventDefault();
    }
});
