const express = require ("express");
const User = require('../models/user');
const router = express.Router();

const {jwtAuthMiddleware, generationToken} = require('./../jwt');
// POST route for adding person
router.post('/signup', async (req, res) => {
    try{
      const data = req.body // Assuming the request body contains the person data
      // create a new newUser document using the mongoose model
      const newUser = new User(data);
      // newUser.name = data.name;
  
      const response = await newUser.save();
      console.log('data saved');

      const payload = {
            id: response.id,
      }
      console.log(JSON.stringify(payload));
      const token = generationToken(payload);
      console.log('token is' , token);

      res.status(200).json({response: response, token: token});
  }
  catch(err){
      console.log(err);
      res.status(500).json({error: 'internal server error'});
  }
  })

  // login route
  router.post('/login', async (req, res) => {
    try{
        // extract username and password from request body
        const {aadharCardNumber, password} = req.body;

        // find the user by username
        const user = await User.findOne({aadharCardNumber: aadharCardNumber});

        // if user does not exist or password does not match
        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({error: 'invalid username or password'});
        }
        // generate token
        const payload = {
            id: user.id,
        }    
        const token = generationToken(payload);

        // return token as a response
        res.json({token})
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'internal server error'});
    }

})

// profile route
router.get('/profile', jwtAuthMiddleware, async (req, res) => {
    try{
        const userData = req.user;
        const userId = userData.id;
        const user = await User.findById(userId);

        res.status(200).json({user})
    } catch(err){
        console.log(err);
        res.status(500).json({error: 'internal server error'});
    }
})

router.put('/profile/password', async(req, res) => {
    try{
        const userId = req.user.id; //parser will extract the id from the token
        const {currentPassword, newPassword} = req.body //extract current the new passsword from the request body
        
        // find the user by userId
        const user = await User.findById(userId);
        // if password does not match return error
        if(!user || !(await user.comparePassword(currentPassword))){
            return res.status(401).json({error: 'Invalid username or password'});
        }

        // update the user password
        user.password = newPassword;
        await user.save();

        console.log('data updated');
        res.status(200).json(response);

    }catch(err){
        console.log(err);
        res.status(500).json({error: 'internal server error'})
    }
})

module.exports = router;