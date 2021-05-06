#! /usr/bin/env node

console.log(
  "This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true"
);

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require("async");
var Artist = require("./models/Artist");
var Release = require("./models/Release");
var Band = require("./models/Band");
var Genre = require("./models/Genre");

var mongoose = require("mongoose");
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

var artists = [];
var genres = [];
var releases = [];
var bands = [];

function artistCreate(name, member_of, releases, d_birth, d_death, cb) {
  authordetail = { name: name };
  if (d_birth != false) authordetail.date_of_birth = d_birth;
  if (d_death != false) authordetail.date_of_death = d_death;
  if (member_of != false) authordetail.member_of = member_of;
  if (releases != false) authordetail.releases = releases;

  var artist = new Artist(authordetail);

  artist.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Artist: " + artist);
    artists.push(artist);
    cb(null, artist);
  });
}

function genreCreate(name, cb) {
  var genre = new Genre({ name: name });

  genre.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Genre: " + genre);
    genres.push(genre);
    cb(null, genre);
  });
}

function releaseCreate(title, band, artist, cover, genre, cb) {
  releasedetail = {
    title: title,
    cover: cover,
  };
  if (genre != false) releasedetail.genre = genre;
  if (band != false) releasedetail.band = band;
  if (artist != false) releasedetail.artist = artist;

  var release = new Release(releasedetail);
  release.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Release: " + release);
    releases.push(release);
    cb(null, release);
  });
}

function bandCreate(name, members, releases, formed, disbanded, cb) {
  banddetail = {
    name: name,
    memebers: members,
    releases: releases,
    formed: formed,
  };
  if (disbanded != false) banddetail.disbanded = disbanded;

  var band = new Band(banddetail);
  band.save(function (err) {
    if (err) {
      console.log("ERROR CREATING Band: " + band);
      cb(err, null);
      return;
    }
    console.log("New Band: " + band);
    bands.push(band);
    cb(null, band);
  });
}

// name, members, releases, formed, disbanded, cb
// name, member_of, releases, d_birth, d_death, cb

function createGenreArtists(cb) {
  async.series(
    [
      function (callback) {
        artistCreate("Jamal East", false, false, "2001-02-29", false, callback);
      },
      function (callback) {
        artistCreate(
          "Mike River",
          false,
          false,
          "1995-01-23",
          "2021-01-24",
          callback
        );
      },
      function (callback) {
        artistCreate(
          "Steven Roacher",
          false,
          false,
          "1972-02-13",
          false,
          callback
        );
      },
      function (callback) {
        artistCreate("Ball Bike", false, false, "1985-08-19", false, callback);
      },
      function (callback) {
        artistCreate(
          "Lil J, die young",
          false,
          false,
          "2010-09-11",
          "2019-11-21",
          callback
        );
      },
      function (callback) {
        artistCreate("HydroHomo", false, false, "1972-09-11", false, callback);
      },
      function (callback) {
        artistCreate(
          "Igor Sysoev",
          false,
          false,
          "2001-01-24",
          false,
          callback
        );
      },
      function (callback) {
        genreCreate("hip-hop", callback);
      },
      function (callback) {
        genreCreate("drone", callback);
      },
      function (callback) {
        genreCreate("new-age type shit", callback);
      },
      function (callback) {
        genreCreate("dadrock", callback);
      },
    ],
    // optional callback
    cb
  );
}

// title, band, artist, cover, genre, cb

function createReleases(cb) {
  async.parallel(
    [
      function (callback) {
        releaseCreate(
          "Jeezuz",
          false,
          artists[0],
          "https://cdn11.bigcommerce.com/s-0c3e0/images/stencil/1280x1280/products/255/608/jesus-loves-you-personalized-kids-music-cd__23028.1293717951.jpg?c=2?imbypass=on",
          genres[0],
          callback
        );
      },
      function (callback) {
        releaseCreate(
          "We are 20 and we're cool",
          bands[0],
          false,
          "https://cdn11.bigcommerce.com/s-0c3e0/images/stencil/1280x1280/products/255/608/jesus-loves-you-personalized-kids-music-cd__23028.1293717951.jpg?c=2?imbypass=on",
          genres[1],
          callback
        );
      },
      function (callback) {
        releaseCreate(
          "Why I hate my wife",
          bands[1],
          false,
          "https://cdn11.bigcommerce.com/s-0c3e0/images/stencil/1280x1280/products/255/608/jesus-loves-you-personalized-kids-music-cd__23028.1293717951.jpg?c=2?imbypass=on",
          genres[2],
          callback
        );
      },
      function (callback) {
        releaseCreate(
          "Sippin on Da Devil Juice",
          bands[2],
          false,
          "https://cdn11.bigcommerce.com/s-0c3e0/images/stencil/1280x1280/products/255/608/jesus-loves-you-personalized-kids-music-cd__23028.1293717951.jpg?c=2?imbypass=on",
          genres[3],
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

// name, member_of, releases, d_birth, d_death, cb
// name, members, releases, formed, disbanded, cb

function createBands(cb) {
  async.parallel(
    [
      function (callback) {
        bandCreate(
          "20-somethins",
          [artists[1], artists[2]],
          [],
          "2018",
          false,
          callback
        );
      },
      function (callback) {
        bandCreate(
          "dads in the basement drinking beerz",
          [artists[3], artists[4]],
          [],
          "2009",
          false,
          callback
        );
      },
      function (callback) {
        bandCreate(
          "waterhomies",
          [artists[5], artists[6]],
          [],
          "2001",
          "2004",
          callback
        );
      },
    ],
    // Optional callback
    cb
  );
}

async.series(
  [createGenreArtists, createBands, createReleases],
  console.log(artists),
  // Optional callback
  function (err, results) {
    if (err) {
      console.log("FINAL ERR: " + err);
    } else {
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
