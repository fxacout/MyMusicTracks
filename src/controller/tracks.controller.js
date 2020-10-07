const { ObjectID,GridFSBucket } = require('mongodb')
const multer = require('multer');
const conn = require('mongoose').connection
const { Readable } = require('stream');

const Track = require('../model/Track')


exports.getTrack =  function(req,res){
    try{
        if(!req.params.trackID)
            throw error;
        var trackID = new ObjectID(req.params.trackID)
        console.log(req.params.trackID)
    }catch(err){
        return res.status(400).json({message: "Invalid ID"})
    }
    res.set('content-type','audio/mp3')
    res.set('accept-ranges','bytes')

    let bucket = new GridFSBucket(conn.db,{
        bucketName: 'tracks'
    })


    let downloadStream = bucket.openDownloadStream(trackID)


    downloadStream.on('data',(chunk)=>{
        console.log("Sending chunk")
        res.write(chunk)
    })

    downloadStream.on('error',(chunk)=>{
        res.sendStatus(404)
    })
    downloadStream.on('end',(chunk)=>{
        res.end()
    })


}
const comprobarExistencia= async function(nombre,author){
  const existe = await Track.findOne({
    name: nombre,
    autor: author
  }).exec()
  return existe!=null
}



const ytdw = require('../services/yt.downloader')
const descargarYGuardar = function(req,res){
  let bucket = new GridFSBucket(conn.db, {
    bucketName: 'tracks'
  })
  let uploadStream = bucket.openUploadStream(req.body.name);
  ytdw.downloadLink(req.body.url, uploadStream)
  let id = uploadStream.id;
  uploadStream.on('error',(err)=>{
    console.log(err)
    return res.status('500').json({error:err})
  })
  uploadStream.on('finish',()=>{
    let newTrack = new Track({name:req.body.name,autor:req.body.autor,trackId:id})
    newTrack.save()
    return res.status('201').json(newTrack)
  })
  uploadStream.on('pipe',()=>{console.log('Me han pipeao')})


  
}


exports.postTrack = async function(req,res){
    if(await comprobarExistencia(req.body.name,req.body.autor)==true){
      return res.status(400).json({message: "La cancion ya se encuentra en la BBDD"})}
    
      
    if(req.body.url){
      return descargarYGuardar(req,res)
    }


  const storage = multer.memoryStorage()
  const upload = multer({ storage: storage, limits: { fields: 2, fileSize: 6000000, files: 1, parts: 3 }});
  
  upload.single('track')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: "Upload Request Validation Failed",error: err });
    } else if(!req.body.name) {
      return res.status(400).json({ message: "No track name in request body" });
    }
    
    let trackName = req.body.name;
    
    // Covert buffer to Readable Stream
    const readableTrackStream = new Readable();
    readableTrackStream.push(req.file.buffer);
    readableTrackStream.push(null);

    let bucket = new GridFSBucket(conn.db, {
      bucketName: 'tracks'
    })
    let uploadStream = bucket.openUploadStream(trackName);
    let id = uploadStream.id;
    readableTrackStream.pipe(uploadStream);

    uploadStream.on('error', (err) => {
      return res.status(500).json({ message: "Error uploading file" ,error: err});
    });

    uploadStream.on('finish', () => {
      let newTrack = new Track({name: req.body.name.toUpperCase(), autor: req.body.autor.toUpperCase(),trackId:id})
      newTrack.save()
      return res.status(201).json(newTrack);
    });
  });
}

exports.getTracks = async function(req,res){
  const lista = await Track.find().exec()
  console.log(lista)
  return res.status(200).send(lista)
}

