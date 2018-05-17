/**
 * @author alteredq / http://alteredqualia.com/
 * @author mr.doob / http://mrdoob.com/
 */

var zeCore = {

	canvas: !! window.CanvasRenderingContext2D,
	webgl: ( function () { try { var canvas = document.createElement( 'canvas' ); return !! window.WebGLRenderingContext && ( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) ); } catch( e ) { return false; } } )(),
	workers: !! window.Worker,
	fileapi: window.File && window.FileReader && window.FileList && window.Blob,

	onBeforeFrameMove: null,
	onAfterFrameMove: null,
	onBeforeFrameRender: null,
	onAfterFrameRender: null,

    firstFrame: 1,
    mouseLDown: 0,
    mouseMDown: 0,
    mouseRDown: 0,
    mousePrevX: 0,
    mousePrevY: 0,
    mouseX: 0,
    mouseY: 0,

	getWebGLErrorMessage: function () {
		var element = document.createElement( 'div' );
		element.className = 'ze-webgl-error';

		if (!this.webgl) {

			element.innerHTML = window.WebGLRenderingContext ? [
				'Tu placa de video y/o navegador no parecen soportar <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation">WebGL</a>.<br />',
				'Para obtener mas información, sigue <a href="http://get.webgl.org/">este enlace</a>.'
			].join( '\n' ) : [
				'Tu navegador no parece soportar <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation">WebGL</a>.<br/>',
				'Para obtener mas información, sigue <a href="http://get.webgl.org/">este enlace</a>.'
			].join( '\n' );

		}
		return element;
	},

	addGetWebGLMessage: function ( parameters ) {

		var parent, id, element;

		parameters = parameters || {};

		parent = parameters.parent !== undefined ? parameters.parent : document.body;
		id = parameters.id !== undefined ? parameters.id : 'oldie';

		element = zeCore.getWebGLErrorMessage();
		element.id = id;

		parent.appendChild( element );

	}

};


function zeCoreMouseButton(event) {
    if ('which' in event) {
        return event.which;
    }
    else {
        if ('button' in event) {
            var buttons = "";
            if (event.button & 1) {
                return 1;
            }
            if (event.button & 2) {
                if (buttons == "") {
                    return 3;
                }
                else {
                    buttons += " + right";
                }
            }
            if (event.button & 4) {
                if (buttons == "") {
                    return 2;
                }
                else {
                    return 2;
                }
            }
        }
    }
}


function _zeCoreWindowResize() {
    zeCore.camera.aspect = window.innerWidth / window.innerHeight;
    zeCore.camera.updateProjectionMatrix();
    zeCore.renderer.setSize(window.innerWidth, window.innerHeight);
}

function _zeCoreDocumentMouseDown(event) {
    button = zeCoreMouseButton(event);
    if (button == 1) zeCore.mouseLDown = 1;
    if (button == 2) zeCore.mouseMDown = 1;
    if (button == 3) zeCore.mouseRDown = 1;
}

function _zeCoreDocumentMouseMove(event) {
    zeCore.mousePrevX = zeCore.mouseX;
    zeCore.mousePrevY = zeCore.mouseY;
    zeCore.mouseX = event.clientX;
    zeCore.mouseY = event.clientY;
}

function _zeCoreDocumentMouseUp(event) {
    button = zeCoreMouseButton(event);
    if (button == 1) zeCore.mouseLDown = 0;
    if (button == 2) zeCore.mouseMDown = 0;
    if (button == 3) zeCore.mouseRDown = 0;
}


function zeCoreInit() {

    // Check for WebGL
	if (!zeCore.webgl) {
	    zeCore.addGetWebGLMessage();
	    return;
	}

    // Initialize renderer
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(0x000000, 1.0);
	renderer.autoClear = false;
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
	zeCore.renderer = renderer;

	// Initialize camera
	camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100000);
	camera.position.z = 6000;
	zeCore.camera = camera;

    // Initialize scene
	scene = new THREE.Scene();
	zeCore.scene = scene;

    // Initialize listeners
	window.addEventListener('resize', _zeCoreWindowResize, false);
	document.addEventListener('mousedown', _zeCoreDocumentMouseDown, false);
	document.addEventListener('mousemove', _zeCoreDocumentMouseMove, false);
	document.addEventListener('mouseup', _zeCoreDocumentMouseUp, false);


}

function zeCoreAnimate() {
    requestAnimationFrame(zeCoreAnimate);
    zeCoreRender();
}

function zeCoreRender() {
    zeCoreFrameMove();
    zeCoreFrameRender();
}

function zeCoreFrameMove() {
    if (zeCore.onBeforeFrameMove != null) zeCore.onBeforeFrameMove();

    if ((zeCore.mouseLDown == 1) || (zeCore.firstFrame == 1)) {
        zeCore.firstFrame = 0;
        zeCore.camera.position.x += (zeCore.mouseX - zeCore.mousePrevX) * 50;
        zeCore.camera.position.y -= (zeCore.mouseY - zeCore.mousePrevY) * 50;
    }
    zeCore.camera.lookAt(zeCore.scene.position);

    if (zeCore.onAfterFrameMove != null) zeCore.onAfterFrameMove();
}

function zeCoreFrameRender() {
    if (zeCore.onBeforeFrameRender != null) zeCore.onBeforeFrameRender();

    zeCore.renderer.render(zeCore.scene, zeCore.camera);

    if (zeCore.onAfterFrameRender != null) zeCore.onAfterFrameRender();
}