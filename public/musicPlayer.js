
let previous = document.querySelector('#pre');
let play = document.querySelector('#play');
let next = document.querySelector('#next');
let title = document.querySelector('#title');
let recent_volume= document.querySelector('#volume');
let volume_show = document.querySelector('#volume_show');
let slider = document.querySelector('#duration_slider');
let show_duration = document.querySelector('#show_duration');
let track_image = document.querySelector('#track_image');
let auto_play = document.querySelector('#auto');
let present = document.querySelector('#present');
let total = document.querySelector('#total');
let artist = document.querySelector('#artist');
let song_name = document.getElementById('song_name');
let clickPlaySong = document.querySelector('#song-item') 

let timer;
let autoplay = 0;

let index_no = 0;
let Playing_song = false;


//create a audio Element
let track = document.createElement('audio');
let song_list =[];

// async function firstAsync() {
//     let promise = new Promise((res, rej) => {
//         setTimeout(() => res("Now it's done!"), 1000)
//     });

//     // wait until the promise returns us a value
//     let result = await promise; 
  
//     // "Now it's done!"
//     alert(result); 
//     };

// firstAsync();

var domResolve;
domReady = new Promise (function(resolve){
	domResolve = resolve;
});

document.addEventListener('DOMContentLoaded', function () {
	fetch('http://localhost:5000/getSongs')
	.then(response => response.json())
	.then(data => load_songs(data['data']))
});


function load_songs(data){
	result = data
	for (var i=0; i < result.length; i++){
		song_list[i] = result[i];
	}
	
}

console.log(song_list);



	
// function load_track(index_no){
	// 	clearInterval(timer);
	// 	reset_slider();
	
	// 	track.src = song_list[index_no].song_audio_path_;
	// 	title.innerHTML = All_song[index_no].song_name;	
	// 	track_image.src = All_song[index_no].song_image;
	// 	artist.innerHTML = All_song[index_no].artis_name;
	// 	track.load();
	
	// 	timer = setInterval(range_slider ,1000);
	// 	total.innerHTML = 4;
	// 	console.log(All_song.length);
	// 	present.innerHTML = index_no + 1;
// }

	


// Songs
let All_song = [
	{
	  name: "Goosebumps",
	  path: "song_audio/Travis_Scott_goosebumps.mp3",
	  img: "song_images/goosebumps_travisScott.jpg",
	  singer: "Travis Scott"
	},
	{
	  name: "Peaches",
	  path: "song_audio/Justin_Bieber_Peaches.mp3",
	  img: "song_images/peaches_justin_bieber.jpg",
	  singer: "Justin Bieber"
	},

	{
		name: "Gods Plan",
		path: "song_audio/Drake_God_s_Plan.mp3",
		img: "song_images/gods_plan.jpg",
		singer: "Drake"
	},
	{
		name: "Yosemite",
		path: "song_audio/Travis_Scott_YOSEMITE.mp3",
		img: "song_images/Yosemite.jpg",
		singer: "Travis Scott"
	}

];

//function load the track
function load_track(index_no){
	clearInterval(timer);
	reset_slider();

	track.src = All_song[index_no].path;
	title.innerHTML = All_song[index_no].name;	
	track_image.src = All_song[index_no].img;
    artist.innerHTML = All_song[index_no].singer;
    track.load();

	timer = setInterval(range_slider ,1000);
	total.innerHTML = 4;
	console.log(All_song.length);
	present.innerHTML = index_no + 1;
}


load_track(index_no);


//mute sound function
function mute_sound(){
	track.volume = 0;
	volume.value = 0;
	volume_show.innerHTML = 0;
}


// // checking.. the song is playing or not
function justplay(){
 	if(Playing_song==false){
 		playsong();
 	}else{
 		pausesong();
 	}
}

function playsong(){
	track.play();
	Playing_song = true;
	play.innerHTML = '<i class="fa fa-pause" aria-hidden="true"></i>';
}
  
// reset song slider
function reset_slider(){
 	slider.value = 0;
}

// play song
function playsong(){
  track.play();
  Playing_song = true;
  play.innerHTML = '<i class="fa fa-pause" aria-hidden="true"></i>';
}

//pause song
function pausesong(){
	track.pause();
	Playing_song = false;
	play.innerHTML = '<i class="fa fa-play" aria-hidden="true"></i>';
}


// next song
function next_song(){
	if(index_no < All_song.length - 1){
		index_no += 1;
		load_track(index_no);
		playsong();
	}else{
		index_no = 0;
		load_track(index_no);
		playsong();

	}
}


// previous song
function previous_song(){
	if(index_no > 0){
		index_no -= 1;
		load_track(index_no);
		playsong();

	}else{
		index_no = All_song.length;
		load_track(index_no);
		playsong();
	}
}


// change volume
function volume_change(){
	volume_show.innerHTML = recent_volume.value;
	track.volume = recent_volume.value / 100;
}

// change slider position 
function change_duration(){
	slider_position = track.duration * (slider.value / 100);
	track.currentTime = slider_position;
}

// autoplay function
function autoplay_switch(){
	if (autoplay==1){
       autoplay = 0;
       auto_play.style.background = "rgba(255,255,255,0.2)";
	}else{
       autoplay = 1;
       auto_play.style.background = "#FF8A65";
	}
}


function range_slider(){
	let position = 0;
        
        // update slider position
		if(!isNaN(track.duration)){
		   position = track.currentTime * (100 / track.duration);
		   slider.value =  position;
	    }

       
       // function will run when the song is over
       if(track.ended){
       	 play.innerHTML = '<i class="fa fa-play" aria-hidden="true"></i>';
           if(autoplay==1){
		       index_no += 1;
		       load_track(index_no);
		       playsong();
           }
	    }
}
