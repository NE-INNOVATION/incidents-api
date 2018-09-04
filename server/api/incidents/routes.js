const express = require('express')
const router = express.Router({mergeParams: true})

let incidents = [];

router.route('/incidentInfo/:id/:quoteId')
  .get((req, res, next) => {
    res.send(JSON.stringify(getIncidentInfo(req.params.id, req.params.quoteId)))
  })
  .post((req, res, next) => {
    res.send(JSON.stringify({result : saveIncidentInfo(req.body)}))
  })

  let getIncidentInfo = (id, quoteId) => {
    console.log('Returning Incident #', id)
    return incidents.find( x => x.id === id && x.quoteId === quoteId)
  }
  
  let saveIncidentInfo = (data) => {
    let incident = '';
    if(data.id !== ''){
      incident = incidents.find( x => x.id === data.id );
    }else{
      incident = {};
      incident.quoteId = data.quoteId
    }
    
    incident.type = data.type
    incident.driver = data.driver
    incident.responsible = data.responsible
    incident.when = data.when
    
    if(data.id === '') {
      incident.id = incidents.length + 1
      incidents.push(incident)
    }
  
    return incidents.length;
  }

module.exports = router;