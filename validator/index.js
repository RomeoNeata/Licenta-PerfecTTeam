exports.createMatchValidator = (req, res, next) => {
    req.check('title','Write a title').notEmpty()
    req.check('title','').isLength({
        min: 4,
        max: 150
    })
    req.check('body','Write a body').notEmpty()
    req.check('title','').isLength({
        min: 4,
        max: 150
    })

    //check for errors
    const errors = req.validationErrors()
    if(errors){
        const firstError = errors.map((error) => error.msg)[0]
        return res.status(400).json({error: firstError})
    }

    next()
}