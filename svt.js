var sp = getSpotifyApi(1);
var models = sp.require("sp://import/scripts/api/models");
var views = sp.require("sp://import/scripts/api/views");
var player = models.player;

exports.init = init;

var testData = {
    titles: [
        {
            title: "Homeland",
            image: "http://www.svt.se/cachable_image/1348044594000/svts/article242034.svt/ALTERNATES/small/homeland_affisch.jpg",
            description: "I dramathrillern Homeland misstänker CIA-agenten Carrie Mathison att krigshjälten Nicholas Brody, befriad efter åtta års fångenskap i Afghanistan, har omvänts och nu kämpar för Al-Qaida.",
            songs: [
                {
                    artist: "The Chantels",
                    track: "Maybe"
                },
                {
                    artist: "Metallica",
                    track: "Master of puppets"
                },
                {
                    artist: "Opeth",
                    track: "Coil"
                },
                {
                    artist: "J.J. Fad",
                    track: "Supersonic"
                }
            ]
        },
        {
            title: "På spåret",
            image: "http://www.svt.se/cachable_image/1353403287000/pa-sparet/article551575.svt/ALTERNATES/small/pasparetplay.jpg",
            description: "Kristian Luuk och domaren Fredrik Lindström leder Sveriges mest populära frågeprogram.",
            songs: [
                {
                    artist: "TLC",
                    track: "No Scrubs"
                },
                {
                    artist: "Destiny\"s Child",
                    track: "Bills"
                }
                ,
                {
                    artist: "N.W.A.",
                    track: "Straight outta compton"
                },
                {
                    artist: "R.Kelly",
                    track: "I believe I can fly"
                }
            ]
        }
    ]
};

function init() {

    render();

}

function render() {
    var mainElement = document.getElementById("main");
    for (var i = 0; i < testData.titles.length; i++) {
        var item = testData.titles[i];
        var titleElement = document.createElement("div");

        // meta
        var metaElement = document.createElement("div");
        var titleHeader = document.createElement("h2");
        var imageElement = document.createElement("img");
        var descriptionElement = document.createElement("p");

        imageElement.setAttribute("src", item.image);
        imageElement.setAttribute("class", "poster");

        titleHeader.innerText = item.title;

        descriptionElement.setAttribute("class", "description");
        descriptionElement.innerText = item.description;

        metaElement.setAttribute("class", "meta");
        metaElement.appendChild(imageElement);
        metaElement.appendChild(titleHeader);
        metaElement.appendChild(descriptionElement);

        titleElement.setAttribute("id", "title" + i);
        titleElement.setAttribute("class", "item");
        titleElement.appendChild(metaElement);

        // playlist
        var playlist = document.createElement("div");
        playlist.setAttribute("class", "list");

        for (var n = 0; n < item.songs.length; n++) {
            var song = item.songs[n];
            search(playlist, song.artist, song.track);
        }
        titleElement.appendChild(playlist);
        mainElement.appendChild(titleElement);
    }
}

function search(wrapper, artist, track) {
    var search = new models.Search(artist + " " + track);
    search.localResults = models.LOCALSEARCHRESULTS.IGNORE;

    search.observe(models.EVENT.CHANGE, function () {
        var playlist = new models.Playlist();

        for (var i = 0; i < search.tracks.length; i++) {
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