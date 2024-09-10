const db = require("../models");
const User = require("../models/user.model");
const Website = db.website;
async function retrieveWebsites(user,site) {
    // Iterate over each website ID in the 'websites' array and retrieve the corresponding website document
    for (const websiteId of user.websites) {
        const website = await Website.findById(websiteId);
        if (website.website === site) {
            return;
        } else {
            
            // console.log(`Website with ID ${websiteId} not found`);
            // next();
        }
    }
}
// Checkduplicatesite = async(req,res,next) =>{
//     console.log(req.body.timer.URL);
    
//     let site = req.body.timer.URL;
//     User.findOne({
//         username:req.session.username,
//     }).exec(
//         (err, user)=>{
//             if (err) {
//                 res.status(500).send({ message: err });
//                 return;
//               }
//               else{
//                     console.log(user.websites);
//                     for (const websiteId of user.websites) {
//                         Website.findById(websiteId)
//                         .exec(
//                             (err,website)=>{
//                                 console.log(website);
//                                 if (err){
//                                     console.log('error');
//                                     return;
//                                 }
//                                 else if (website && website.website === site){
//                                     console.log('site already added');
//                                     return;
//                                 } 
//                             }
//                         )
                
//               }
//             next();  
// }});
// }

const Checkduplicatesite = async (req, res, next) => {
    try {
        console.log(req.body.timer.URL);
        let site = req.body.timer.URL;

        // Find the user asynchronously
        const user = await User.findOne({ username: req.session.username }).exec();
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        console.log(user.websites);

        // Iterate through the websites and check for duplicates
        for (const websiteId of user.websites) {
            const website = await Website.findById(websiteId).exec();
            if (website && website.website === site) {
                const Updateduser = await User.findByIdAndUpdate(
                    user._id,
                    { $pull: { websites: websiteId } },
                    { new: true }
                );
                console.log(Updateduser.websites);
                // console.log('site already added');
                // return res.status(409).send({ message: "Site already exists" });
            }
        } 
        

        // If no duplicate site is found, proceed to the next middleware
        next();
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

const verifysite = {Checkduplicatesite};

module.exports= verifysite