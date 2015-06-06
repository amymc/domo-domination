var container, camera, scene, renderer, particles, geometry, material, i, sprite, size;
var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var phrasesArray = ["Domo says: Relax", "Domo says: <inset witty comment here>", "Domo says: fuck that shit", "Domo says: eat more pizza", "Domo says: conduct yourself"];

init();
animate();

function init() {

	container = document.createElement( 'div' );
	document.body.appendChild(container);

	camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 2, 2000 );
	camera.position.z = 1000;

	scene = new THREE.Scene();

	//controls the density of the particles as the distance grows
	scene.fog = new THREE.FogExp2( 0x000000, 0.001 );

	geometry = new THREE.Geometry();

	sprite = THREE.ImageUtils.loadTexture( "textures/domo.png" );

	//generates random co-ordinates for the particles
	for ( i = 0; i < 2500; i ++ ) {

		var vertex = new THREE.Vector3();
		vertex.x = 2000 * Math.random() - 1000;
		vertex.y = 2000 * Math.random() - 1000;
		vertex.z = 2000 * Math.random() - 1000;

		geometry.vertices.push( vertex );

	}

	//sizeAttenuation means the particles will appear smaller as distance grows
	//alphaTest makes semi-transparent areas fully transparent
	material = new THREE.PointCloudMaterial( { size: 110, sizeAttenuation: true, map: sprite, alphaTest: 0.1, transparent: true } );

	particles = new THREE.PointCloud( geometry, material );
	scene.add( particles );

	renderer = new THREE.WebGLRenderer();
	//resizes the ouput canvas to fit the window
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	//instantiate a domEvents layer so we can bind a click event listener to the individual particles
	var domEvents	= new THREEx.DomEvents(camera, renderer.domElement);

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	domEvents.addEventListener( particles, 'click', onDocumentClick );
	window.addEventListener( 'resize', onWindowResize, false );

}

function onDocumentClick() {//shuffles the phrases to alert a random phrase on each click

	shuffleArray(phrasesArray);
	alert(phrasesArray[0]);

}

//taken from http://stackoverflow.com/a/12646864
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function onWindowResize() {//resets camera aspect ratio on window resize

	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove( event ) {//sets new values for mouseX and mouseY on mouse movement, these are used in the render function to update the camera position.

	mouseX = event.clientX - windowHalfX;
	mouseY = event.clientY - windowHalfY;

}

function animate() {

	//calls the animation function before the browser performs next repaint
	requestAnimationFrame(animate);

	render();

}

function render() {

	camera.position.x += ( mouseX - camera.position.x ) * 0.01;
	camera.position.y += ( - mouseY - camera.position.y ) * 0.01;

	camera.lookAt( scene.position );

	renderer.render( scene, camera );

}
