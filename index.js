const Sequelize = require("sequelize");
const dbConnection = new Sequelize("postgres://kelseyroy/spotifyclone/", {
  //logging: false //this would turn off all the information seqlize is outputting
});
//the db connection: local host is just the IP address, the port proves it's a server listenting to a port
//just have to include postgres. Connection string

//nested objects
const Song = dbConnection.define("song", {
  title: {
    type: Sequelize.STRING, //255 characters
    allowNull: false,
  },
  duration: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  lyrics: {
    type: Sequelize.TEXT, //similar data type to string, but allows the string to be as long as it wants
    // allowNull: true this is the default
  },
});

const Album = dbConnection.define("album", {
  coverURL: {
    type: Sequelize.STRING(1000),
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  year: {
    type: Sequelize.DATE,
    allowNull: false,
  },
});

const Artist = dbConnection.define("artist", {
    name: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    country: {
        type: Sequelize.STRING(5)
    },
    bio: {
        type: Sequelize.TEXT;
    }
})

const beatlesSong = await Song.create({
    title: "Yesterday",
    duration: 200
});

const beatlesAlbumHelp = await Album.create({
  name: "Help!",
  year: "1965",
});
const beatlesAlbumAbbey = await Album.create({
    name: "Abbey Road",
    year: "1969",
  });

const beatlesArtist = await Artist.create({
    name: "Beatles"
})
const joeArtist = await Artist.create({
    name: "Joe"
})

await beatlesSong.setAlbum(beatlesAlbum);
//await beatlesSong.setAlbum(beatlesAlbum.id); same same
await beatlesAlbumHelp.addArtist(beatlesArtist);
await beatlesAlbumAbbey.addArtist(beatlesArtist);
await beatlesAlbumAbbey.addArtist(joeArtist);


const albumsWithTheirArtist = await Album.findAll({
    include: [Artist]
})
//will return Beatles
console.log(albumsWithTheirArtist[1].artsts[0].name)

//belongsTo - create an "albumId" on your songs table.
//Song in this is known as the "source"
//Album in this is known as the "target"
//the "source" gets a foreign to the "target"
Song.belongsTo(Album);
//this line changed the structure of my database to add an album Id to the songs table

// hasMany - Create an 'albumId' on your songs table.
//does the same thing as belongsTo but in the different direction. This makes the 
Album.hasMany(Song);

Album.belongsToMany(Artist, {through: "album_to_artist"});
Artist.belongsToMany(Album, {through: "artist_to_album"});
//   artists_to_albums (can have many artists working on one album)
// albumID         artistId
//    1               1
//    2               1
//    2               3
const myAsyncFn = async () => {
  //   await Song.sync(); //sync --> either CONNECTS or CREATES the table the model represents
  await dbConnection.sync({ force: true }); //this will delete all your tables and recreate the database everytime you run this function
  // await dbConnection.sync();//this will sync every tables at once
  //   const newSong = new Song({
  //       title: "Hello",
  //       duration: 7 * 60;
  //       lyrics: "Jazma knows these"
  //   })

  //   await newSong.save(); //this will actually commit the newSong to the database

  //   const newSong = await Song.create({
  //     title: "Hotel California",
  //     duration: 4.5 * 60,
  //     lyrics: "Welcome to the Hotel California",
  //   });

  const songs = await Song.findAll({
    where: {
      title: "Yesterday",
    },
  }); //always put await next to funcitons that will talk to your database

  console.log(songs[0].title);
};
myAsyncFn();
