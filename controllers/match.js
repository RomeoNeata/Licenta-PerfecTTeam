const Match  = require('../models/match.model')


exports.getMatches = (req, res) => {
    const matches = Match.find()
    .then((matches) => {
        res.status(200).json({matches: matches})
    })
    .catch(err => console.log(err))
}

exports.createMatch = (req,res) => {
    const match = new Match(req.body)
    console.log("Creating Match:", match)
    match.save( (err,result) => {
        if(err) {
            return res.status(400).json({
                error: err
            })
        }
        res.status(200).json({
            match: result
        })
    }
    )
}