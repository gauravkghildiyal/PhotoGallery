$(document).ready(function() {

    var c = $("#background")[0],
    ctx = c.getContext('2d'),
    W = window.innerWidth,
    H = window.innerHeight,
    puffs = [],
    colorRange = 0,
    //Max Radius that any puff can take
    R_MAX = 65*4,

    //Time in which Radius changes from 0 to R_MAX
    //Remember that this time does not have any unit like seconds or milliseconds
    lifeTime = 300,

    //decay constant
    k = Math.log(100)/lifeTime;

    //Set the size of the canvas equal to the size of the view
    c.width = W;
    c.height = H;

    /**
    * Generates a hsla color value
    * @param {Number} h hue
    * @param {Number} s saturation
    * @param {Number} l lightness
    * @param {Number} a alpha
    * @return {String} hsla color value
    */
    function hslaColor(h,s,l,a){
        return 'hsla(' + h + ',' + s + '%,' + l + '%,' + a + ')';
    }

    /**
    * Generates a random number betwen the specified digits
    * @param {Number} min The minimum number
    * @param {Number} max The maximum number
    * @return {Number} random number between min and max
    */
    function random(min, max) {
        return Math.floor((Math.random() * (max - min + 1)) + min);
    }

    /**
    * Updates all the puffs
    * @param {None}
    * @return {None}
    */
    function update() {
        var i = puffs.length;
        while (i--) {
            //console.log(i);

            puffs[i].r = R_MAX * (1-Math.exp(-k*puffs[i].t)); //set the new radius

            puffs[i].alpha = 1*(Math.exp(-k*puffs[i].t));  //set the new alpha value

            //Increase pseudo time
            puffs[i].t++;

            //If puff has reached a time greater than its life cycle than destroy it
            if(puffs[i].t > lifeTime){
                //console.log(i);
                //remove the i'th puff from the array
                puffs.splice(i,1);
            }
            //console.log(puffs[i].length);
        }
    }

    /**
    * Renders all the puffs
    * @param {None}
    * @return {None}
    */
    function render(i){
        var i = puffs.length;
        while (i--) {
            ctx.beginPath();
            ctx.arc(puffs[i].x, puffs[i].y, puffs[i].r, 0, 2*Math.PI, false);

            var hue = random(colorRange - 65, colorRange + 65);//For Colors to change smoothly they should not be far apart in the 360deg cycle
            var saturation = 50;
            var lightness = 1;
            var alpha = puffs[i].alpha;
            var color = hslaColor(hue,saturation,lightness,alpha);
            ctx.fillStyle = color;

            ctx.fill();
        }
    }

    /**
    * Clears the screen and sets the globalCompositeOperation for further drawing
    * @param {None}
    * @return {None}
    */
    function clear(){
        ctx.globalCompositeOperation = 'destination-out';

        //We set the alpha channel less than one to get color blur effect
        ctx.fillStyle = 'hsla(0, 0%, 0%, .05)';
        ctx.fillRect(0, 0, W, H);

        //Global composite operation is set to "lighter" so that the hsla channels are added
        ctx.globalCompositeOperation = 'lighter';
    }

    /**
    * The main animation loop which is called by the browser
    * @param {None}
    * @return {None}
    */
    (function animloop(){
        clear();
        update();
        render();

        //Create a new puff with random x and y coordinates
        puffs.push({
            x : Math.random()*W,
            y : Math.random()*H,
            r : 0,
            t : 0,
            alpha : 1
        });

        colorRange++;// Increase color range for forward progression of colors

        //Request the browser for new frame to proceed the animation
        window.requestAnimationFrame(animloop,c);
    })();

    //Resize the canvas element when the window is resized
    $(window).on('resize', function() {
        W = c.width = window.innerWidth ;
        H = c.height = window.innerHeight;
    });

});
