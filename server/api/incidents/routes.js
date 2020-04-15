const express = require('express')
var rn = require('random-number')
const router = express.Router({mergeParams: true})
const dataStore = require('../../data/dataStore')

var gen = rn.generator({
  min:  100000000
, max:  999999999
, integer: true
})

router.route('/incidentInfo/:id/:quoteId')
  .get(async (req, res, next) => {
    res.send(JSON.stringify(await getIncidentInfo(req.params.id, req.params.quoteId)))
  })
  .post(async (req, res, next) => {
    res.send(JSON.stringify({result : await saveIncidentInfo(req.body, req.params.quoteId)}))
  })

  let getIncidentInfo = async (id, quoteId) => {
    console.log('Returning Incident #', id)
    let incident = await dataStore.findIncident(quoteId)
    return incident
  }
  
  let saveIncidentInfo = async (data, quoteId) => {
    let incident = '';
    if(data.id !== ''){
      incident = await dataStore.findIncident(quoteId)
    }else{
      incident = {};
      incident.quoteId = quoteId
    }
    
    incident.category = data.category
    incident.driver = data.driver
    incident.responsible = data.responsible
    incident.when = data.when
    
    if(data.id === '') {
      incident.id = gen().toString()
    }
  
    dataStore.addIncident(incident)

    return incident.id;
  }

module.exports = router;