var sp = getSpotifyApi(1);
var models = sp.require('sp://import/scripts/api/models');
var views = sp.require("sp://import/scripts/api/views");
var player = models.player;

exports.init = init;

var testData = {
	titles: [{
		title: 'Homeland',
		image: 'http://www.svt.se/cachable_image/1348044594000/svts/article242034.svt/ALTERNATES/small/homeland_affisch.jpg',
		songs: [{
				artist: 'The Chantels',
				track: 'Maybe'
			}, {
				artist: 'J.J. Fad',
				track: 'Supersonic'
			}]
		}, {
		title: 'På spåret',
		image: 'http://www.svt.se/cachable_image/1353403287000/pa-sparet/article551575.svt/ALTERNATES/small/pasparetplay.jpg',
		songs: [{
			artist: 'TLC',
			track: 'No Scrubs'
		}, {
			artist: 'Destiny\'s Child',
			track: 'Say my name'
		}]
	}]
};

function init() {

	render();

}

function render() {
	var mainElement = document.getElementById("main");
	for (var i=0; i < testData.titles.length; i++){
		var item = testData.titles[i];
		var titleElement = document.createElement('div');

		titleElement.setAttribute("id", "title" +i);
		titleElement.setAttribute('class', 'item');

		// meta
		var metaElement = document.createElement('div');
		metaElement.setAttribute('class', 'meta');

		var titleHeader = document.createElement("h2");
		var imageElement = document.createElement('img');

		imageElement.setAttribute("src", item.image);
		imageElement.setAttribute("class", "poster");

		titleHeader.innerText = item.title;

		metaElement.appendChild(imageElement);
		metaElement.appendChild(titleHeader);

		titleElement.appendChild(metaElement);

		// playlist
		var playlist = document.createElement('div');
		playlist.setAttribute('class', 'list');

		for (var n=0; n < item.songs.length; n++) {
			var song = item.songs[n];
			console.log(song.artist);
			console.log(song.track);
			search(playlist, song.artist, song.track);
		}
		titleElement.appendChild(playlist);
		mainElement.appendChild(titleElement);
	}
}

function search(wrapper, artist, track) {
	var search = new models.Search(artist + ' ' + track);
	search.localResults = models.LOCALSEARCHRESULTS.IGNORE;

	search.observe(models.EVENT.CHANGE, function() {
		var playlist = new models.Playlist();

		for(var i = 0; i < search.tracks.length; i++) {
			playlist.add(search.tracks[i]);
			break;
		}

		var list = new views.List(playlist, function (track) {
			return new views.Track(track, views.Track.FIELD.STAR |
					views.Track.FIELD.SHARE |
					views.Track.FIELD.NAME |
					views.Track.FIELD.ARTIST |
					views.Track.FIELD.DURATION |
					views.Track.FIELD.ALBUM);
		});

		list.node.classList.add("sp-light");
		wrapper.appendChild(list.node);
	});

	search.appendNext();
}