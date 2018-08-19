const express = require('express')
const router = express.Router({mergeParams: true})

router.route('/incidentInfo')
  .get((req, res, next) => {
    res.send(JSON.stringify({"type":"A","date":"02-02-2010"}))
  })
  .post((req, res, next) => {
    res.send('data saved')
  })

module.exports = router;