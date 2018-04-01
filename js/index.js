$(document).ready(function(){

    /**
    * Event handler for mouse move event
    * @param {Number} e event object
    * @return {None}
    */
    function mousemoveEventHandler(e){
        $("#temp").html("("+e.pageX+","+e.pageY+")<br />");
        $("#row1 > div,#row2 > div, #row3 > div").each(function(){
            $this = $(this);
            //console.log($this.html());
            var offset = $this.offset();
            var width = $this.width();
            var height = $this.height();

            var centerX = offset.left + width / 2;
            var centerY = offset.top + height / 2;

            var scalingFactor = 30
            var hShadow = (centerX - e.pageX)/scalingFactor;
            var vShadow = (centerY - e.pageY)/scalingFactor;
            var blur,spread;
            blur = spread = Math.sqrt(Math.abs(hShadow)*Math.abs(hShadow) + Math.abs(vShadow)*Math.abs(vShadow));

            var boxShadow = hShadow+"px "+vShadow+"px "+blur*3+"px "+spread+"px rgba(0,0,0,1)";
            //$("#temp").append(shadow);
            $this.css("box-shadow",boxShadow);
        });
    }

    //Event Listener for image click events
    $(document).on("click",".imageWrapper .smallImageOverlay",function(){

        //Set up the Slideshow. The image clicked is passed as argument
        setUpSlideshow($(this).prev());

        //Hide footer
        hideFooter();
    });

    /**
    * Sets up the slide show
    * @param {dom_element} $this The image that is to be as the center
    * @return {none}
    */
    function setUpSlideshow($this){
        //remove old classes
        $("#slideshowWrapper").removeClass("scaleDownAndDisappear");
        $("#pagesContainer").removeClass("scaleDownAndAppear");

        //add classes
        $("#pagesContainer").addClass("scaleUpAndDisappear");
        $("#slideshowWrapper").addClass("scaleUpAndAppear");

        $("#slideshowWrapper").css("display","block");

        var src = $this.attr("src"); //Source of image that was clicked

        createSlideshow();

        $("#slideshow div").attr("class",""); //remove all classes initially so that no image has class active
        var active = $("#slideshow div img[src='"+src+"']").parent().addClass("active");
        if((prev = active.prev()).length){
            prev.addClass("prev");
        }
        if((prevToPrev = active.prev().prev()).length){
            prevToPrev.addClass("prevToPrev");
        }
        if((next = active.next()).length){
            next.addClass("next");
        }
        if((nextToNext = active.next().next()).length){
            nextToNext.addClass("nextToNext");
        }
    }

    /**
    * Creates elements for slide show dynamically from the current active page
    * @param {None}
    * @return {None}
    */
    function createSlideshow(){
        var $slideshow = $("#slideshow");
        $slideshow.empty(); // Remove and previous slide show data


        var $imgArray = $(".activePage > .actualPage .imageWrapper img");// Remember that inside .activePage there is also the reflection section which is added dynamically
        $imgArray.each(function(){
            var htmlData = "<div><img src = '"+$(this).attr("src")+"' /></div>";
            $slideshow.append(htmlData);
            console.log(htmlData);
        });
    }

    //Bind element to open multi-show-display
    $(document).on("click","#multi-show-display",function(e){
        window.location.hash = "home";
    });

    //Bind element to close multi-show-display
    $(document).on("click",".page-multi-show-display-state .actualPage .actualPageOverlay",function(e){
        $this = $(this).parent().parent();
        if($this.hasClass('page1')){
            window.location.hash = "page1";
        }
        else if ($this.hasClass('page2')) {
            window.location.hash = "page2";
        }
        else if ($this.hasClass('page3')) {
            window.location.hash = "page3";
        }
        else if ($this.hasClass('page4')) {
            window.location.hash = "page4";
        }
    });

    /**
    * Open various pages
    * @param {None}
    * @return {None}
    */
    function openMultiShowDisplay(){
        $(".page").addClass("page-multi-show-display-state");
        $(".page").removeClass("activePage");
    }

    /**
    * Close various pages
    * @param {Dom_element} $element the actualPageOverlay of the clicked page
    * @return {None}
    */
    function closeMultiShowDisplay($element){
        //Remove the hover animation event listeners and classes
        $(document).off("mouseenter",".page-multi-show-display-state > .actualPage",function(){
            $(this).parent().addClass("page-multi-show-display-state-hover");
        });
        $(document).off("mouseleave",".page-multi-show-display-state > .actualPage",function(){
            $(this).parent().removeClass("page-multi-show-display-state-hover");
        });
        $(".page").removeClass("page-multi-show-display-state-hover");

        var activePage = $element.parent().parent();
        activePage.addClass("activePage");
        $(".page").removeClass("page-multi-show-display-state");
    }

    /**
    * Hide the footer
    * @param {None}
    * @return {None}
    */
    function hideFooter(){
        var $element = $("footer");
        var height = $element.outerHeight();
        $element.css("bottom","-"+height+"px");
    }

    /**
    * Show the footer
    * @param {None}
    * @return {None}
    */
    function showFooter(){
        var $element = $("footer");
        $element.css("bottom",0);
    }

    //fullscreen
    $(document).on("click","#fullscreenSvg",toggleFullScreen);
    function toggleFullScreen() {
        if (!document.fullscreenElement &&    // alternative standard method
            !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
                if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen();
                } else if (document.documentElement.msRequestFullscreen) {
                    document.documentElement.msRequestFullscreen();
                } else if (document.documentElement.mozRequestFullScreen) {
                    document.documentElement.mozRequestFullScreen();
                } else if (document.documentElement.webkitRequestFullscreen) {
                    document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
            }
        }

        //Reflection effect
        $(".page").each(function(e){
            $this = $(this);
            var actualPage = $this.children().first();
            $this.append("<div class='reflection'><div class='reflectionOverlay'></div></div>");
            actualPage.clone().prependTo($this.children().last());
        });

        //For Reflection to be perfect when one element scrolls its shadow should also scroll
        $('.page > .actualPage').scroll(function(e){
            $(this).next().children().first().scrollTop($(this).scrollTop());
        });



        //Event listeners for hover animation
        $(document).on("mouseenter",".page-multi-show-display-state > .actualPage",function(){
            $(this).parent().addClass("page-multi-show-display-state-hover");
        });
        $(document).on("mouseleave",".page-multi-show-display-state > .actualPage",function(){
            $(this).parent().removeClass("page-multi-show-display-state-hover");
        });

        //Hashchange event handler
        $(window).on("hashchange",function(){
            closeSlideshow();

            var page = window.location.hash.split('#')[1];
            if(page=="page1" || page=="page2" || page=="page3" || page=="page4"){
                $("#welcomeScreen").css("display","none");
                $(".page").removeClass("activePage");

                var $element = $("."+page+" > .actualPage > .actualPageOverlay");
                $("body").on("mousemove",mousemoveEventHandler); // Add the shadow movement effect
                closeMultiShowDisplay($element);
                showFooter();
            }
            else if (page == "home") {
                $("#welcomeScreen").css("display","none");
                $(".page").removeClass("activePage");

                $("body").off("mousemove",mousemoveEventHandler); // Remove shadow effect for the time being
                //Remove the Shadow  created because of the pointer
                $("#row1 > div,#row2 > div, #row3 > div").each(function(){
                    $(this).css("box-shadow","");
                });
                openMultiShowDisplay();
                hideFooter();
            }
            else{
                //Welcome Screen Animations
                $("#welcomeSvg path").css({"stroke-dashoffset":"0","fill":"black"});
                setTimeout(function(){
                    $("#welcomeScreen").addClass("fadeOutAndDisappear");
                },4000);
            }
        });
        $(window).trigger("hashchange");

    });
