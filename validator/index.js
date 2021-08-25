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

exports.createUserValidator = (req, res, next) => {
    req.check("username", "Username is require").notEmpty()

    req.check("email","Email must be between 3 to 32 characters")
    .matches(/.+\@.+\..+/)
    .withMessage("Email has an incorrect format")
    .isLength({
        min: 4,
        max: 2000
    })
    req.check("password", "Password is require").notEmpty()
    req.check('password')
    .isLength({min: 6})
    .withMessage("Password must contain at least 6 characters")
    .matches(/\d/)
    .withMessage("Password must contain a number")
    //check for errors
    const errors = req.validationErrors()
    if(errors){
        const firstError = errors.map((error) => error.msg)[0]
        return res.status(400).json({error: firstError})
    }

    next()

}