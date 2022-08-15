////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//So here we are adding a header in postman with name Authorization. In that header we have added the latest
//jwt token, then we authenticating it with the secret string 'mytaskmanager' and then findind user associated
//with it.
////////////////////////////////////////////////////////////////////////////////////////////////////////////////


const jwt = require('jsonwebtoken')
const User = require('../models/user')


const auth = async (req,res,next) =>{
    try{
        
        const token = req.header('Authorization').replace('Bearer ','') //Important we are giving space after Bearer
        
        const decoded = jwt.verify(token,'mytaskmanager')
        
        const user = await User.findOne({_id: decoded._id, 'tokens.token':token}) // We are finding the 'tokens.token' because in case if user had logged out, then the list will not have token and then he will not be authenticated.
        

        if(!user){
            
            throw new Error()
        }
        req.token = token
        req.user = user
        
        next()
    }
    catch(e){
        res.status(401).send({error: 'Please authenticate.'})
    }
}


module.exports = auth