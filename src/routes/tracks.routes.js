const Router = require('express').Router
const tracksCtrl = require('../controller/tracks.controller')
var router = Router()

router.get('/:trackID',tracksCtrl.getTrack)

router.get('/',tracksCtrl.getTracks)

router.post('/',tracksCtrl.postTrack)


module.exports= router