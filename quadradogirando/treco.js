/**
 * @file
 *
 * Summary.
 *
 * Vertices are scaled by an amount that varies by
 * frame, and this value is passed to the draw function.
 *
 * @author Paulo Roma
 * @since 17/08/2022
 * @see https://orion.lcg.ufrj.br/cs336/examples/example123/content/GL_example3a.html
 */

"use strict";

/**
 * Raw data for some point positions -
 * this will be a square, consisting of two triangles.
 * <p>We provide two values per vertex for the x and y coordinates
 * (z will be zero by default).</p>
 * @type {Float32Array}
 */
var vertices = new Float32Array([
    -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5,
]);

/**
 * Number of points (vertices).
 * @type {Number}
 */
var numPoints = vertices.length / 2;

// A few global variables...

/**
 * Canvas width.
 * @type {Number}
 */
var w;

/**
 * Canvas height.
 * @type {Number}
 */
var h;

/**
 * Maps a point in world coordinates to viewport coordinates.<br>
 * - [-n,n] x [-n,n] -> [-w,w] x [h,-h]
 * <p>Note that the Y axix points downwards.</p>
 * @param {Number} x point x coordinate.
 * @param {Number} y point y coordinate.
 * @param {Number} n window size.
 * @returns {Array<Number>} transformed point.
 */
function mapToViewport(x, y, n = 5) {
    return [((x + n / 2) * w) / n, ((-y + n / 2) * h) / n];
}

/**
 * Returns the coordinates of the vertex at index i.
 * @param {Number} i vertex index.
 * @returns {Array<Number>} vertex coordinates.
 */
function getVertex(i) {
    let j = (i % numPoints) * 2;
    return [vertices[j], vertices[j + 1]];
}

/**
 * Code to actually render our geometry.
 * @param {CanvasRenderingContext2D} ctx canvas context.
 * @param {Number} scale scale factor.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
 */
function draw(ctx, scale) {
    ctx.fillStyle = "rgba(0, 204, 204, 1)";
    ctx.rect(0, 0, w, h);
    ctx.fill();

    ctx.beginPath();
    for (let i = 0; i < numPoints; i++) {
        if (i == 3 || i == 4) continue;
        let [x, y] = mapToViewport(...getVertex(i).map((x) => x * scale));
        if (i == 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.closePath();

    // the fill color
    ctx.fillStyle = "red";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(160, 160, 5, 0, 2 * Math.PI);
    ctx.stroke();    // the fill color
    ctx.fillStyle = "green";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(240, 240, 5, 0, 2 * Math.PI);
    ctx.stroke();    // the fill color
    ctx.fillStyle = "white";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(240, 160, 5, 0, 2 * Math.PI);
    ctx.stroke();    // the fill color
    ctx.fillStyle = "blue";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(160, 240, 5, 0, 2 * Math.PI);
    ctx.stroke();    // the fill color
    ctx.fillStyle = "red";
    ctx.fill();
}

/**
 * <p>Entry point when page is loaded.</p>
 *
 * Basically this function does setup that "should" only have to be done once,<br>
 * while draw() does things that have to be repeated each time the canvas is
 * redrawn.
 */
function mainEntrance() {
    // retrieve <canvas> element
    var canvasElement = document.querySelector("#theCanvas");
    var ctx = canvasElement.getContext("2d");

    w = canvasElement.width;
    h = canvasElement.height;

    /**
     * A closure to set up an animation loop in which the
     * scale grows by "increment" each frame.
     * @global
     * @function
     */
    var runanimation = (() => {
        var scale = 1.0;
        var angle = -2 * Math.PI / 180;
        var aux = 0;
        var input = "r";
        
        document.body.addEventListener("keydown", (e) => {
          if (e.key == "r") {
            input = "r";
          }
          if (e.key == "g") {
            input = "g";
          }
          if (e.key == "b") {
            input = "b";
          }
          if (e.key == "w") {
            input = "w";
          }
        });

        return () => {
            if(input == "r"){
                draw(ctx, scale);
                ctx.translate(160,240);
                ctx.rotate(angle);
                ctx.translate(-160,-240);
            }

            if(input == "g"){
                draw(ctx, scale);
                ctx.translate(160,160);
                ctx.rotate(angle);
                ctx.translate(-160,-160);
            }

            if(input == "b"){
                draw(ctx, scale);
                ctx.translate(240,160);
                ctx.rotate(angle);
                ctx.translate(-240,-160);
            }

            if(input == "w"){
                draw(ctx, scale);
                ctx.translate(240,240);
                ctx.rotate(angle);
                ctx.translate(-240,-240);
            }

            // request that the browser calls runanimation() again "as soon as it can"
            requestAnimationFrame(runanimation);
        };
    })();

    // draw!
    runanimation();
}