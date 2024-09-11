const express = require ("express");
const User = require('../models/candidate');
const Candidate = require('../models/candidate');
const router = express.Router();
const {jwtAuthMiddleware, generationToken} = require('./../jwt');


const checkAdminRole = async(userId) => {
    try{
        const user = await User.findById(userId);
        return user.role == 'admin';
    }catch(err){
        return false;
    }
}
// POST route for adding person
router.post('/', jwtAuthMiddleware, async (req, res) => {
    try{
        if(!checkAdminRole(req.user.id))
            return res.status(404).json({message: 'user has not admin role'});
        
      const data = req.body // Assuming the request body contains the person data
      // create a new newUser document using the mongoose model
      const newCandidate = new Candidate(data);
      // newUser.name = data.name;
  
      const response = await newCandidate.save();
      console.log('data saved');

      res.status(200).json({response: response });
  }
  catch(err){
      console.log(err);
      res.status(500).json({error: 'internal server error'});
  }
  })

router.put('/:candidateID', jwtAuthMiddleware,async(req, res) => {
    try{
        if(!checkAdminRole(req.user.id))
            return res.status(403).json({message: 'user has not admin role'});
        const candidateID = req.params.candidateID;
        const updatedCandidateData = req.body; //
        const response = await Candidate.findByIdAndUpdate(candidateID, updatedCandidateData, {
            new: true, //return the updated document
            runValidators: true, //run mongoose validation
        })
        if (!response){
            return res.status(404).json({err: 'candidate not found'});
        }

        console.log('candidate data updated');
        res.status(200).json(response);
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'internal server error'})
    }
})

router.delete('/:candidateID', jwtAuthMiddleware,async(req, res) => {
    try{
        if(!checkAdminRole(req.user.id))
            return res.status(403).json({message: 'user has not admin role'});
        const candidateID = req.params.candidateID;
               const response = await Candidate.findByIdAndUpdate(candidateID);
        if (!response){
            return res.status(404).json({err: 'candidate not found'});
        }

        console.log('candidate deleted');
        res.status(200).json(response);
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'internal server error'})
    }
})

// let's start voting
router.post('/vote/:candidate', jwtAuthMiddleware, async(req, res) => {
    candidateID = req.params.candidateID;
    userId = req.user.id;

    try{
        // find the candidate document with the specificed candidateId
        const candidate = Candidate.findById(candidateID);
        if(!candidate){
            return res.status(404).json({err: 'candidate not found'});
        }

        const user = await User.findById(userId);
        if(!user){
            return res.status.apply(404).json({message: 'user not found'});
        }
        if(user.isVoted){
            return res.status(400).json({message: 'user has already voted'});
        }
        if(user.role == 'admin'){
            res.status(403).json({message: 'admon is not allowed'});
        } 
        candidate.votes.push({user: userId})
        candidate.voteCount++;
        await user.save();

        res.status(200).json({message: 'vote recorded successfully'});
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'internal server error'})
    }
})


router.get('/vote/count', async(req, res) => {
    try{
        // find all candidates and sort them by voteCount in decensing order
        const candidate = await Candidate.find().sort({voteCount: 'desc'});

        //map the candidates to only return their name and votecount
        const voteRecord = candidate.map((data) => {
            return {
                party: data.party,
                count: data.voteCount
            }
        });

        return res.status(200).json(voteRecord);
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'internal server error'})
    }

})

router.get('/candidate', async (req, res) => {
    try{
        const candidateDate = await Candidate.find();
        console.log('data fetched');
        res.status(200).json(candidateDate);
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'enternal server error'});
    }
}
)
module.exports = router;