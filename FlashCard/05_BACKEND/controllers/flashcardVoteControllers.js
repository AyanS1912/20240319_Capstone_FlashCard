    const { FlashcardVote } = require('../schema/flashcardVoteSchema')
    const {token_provided, verifyToken} = require('../validators/tokenValidator')

    // Upvote a flashcard
    const upvoteFlashcard = async (req, res) => {
        try {
            // Extract flashcard ID from request parameters
            const flashcardId = req.params.flashcardId

            // Verify token and extract user ID
            const token = req.headers.authorization
            if (!token_provided(token)) {
                return res.status(401).send({ error: "Access denied. Token not provided." })
            }
            const decodedToken = await verifyToken(token)
            if (!decodedToken) {
                return res.status(403).send({ message: "Forbidden. Invalid token." })
            }
            const userId = decodedToken.userId

            // Check if the user has already voted for this flashcard
            let existingVote = await FlashcardVote.findOne({ flashcardId, userId })
            if (existingVote) {
                // If the user has already downvoted the flashcard, update the existing vote to an upvote
                if (existingVote.voteType === "downvote") {
                    existingVote.voteType = "upvote"
                    await existingVote.save()
                    return res.status(200).send({ message: "Your downvote has been changed to an upvote." })
                }
                // If the user has already upvoted the flashcard, return a message
                return res.status(400).send({ message: "You have already upvoted this flashcard." })
            } 
            
            // Create a new upvote for the flashcard
            existingVote = new FlashcardVote({
                flashcardId,
                userId,
                voteType: "upvote"
            })
            await existingVote.save()

            res.status(200).send({ message: "Flashcard upvoted successfully." })
        } catch (error) {
            console.error(error)
            res.status(500).send({ error: "Failed to upvote flashcard." })
        }
    }



    // Downvote a flashcard
    const downvoteFlashcard = async (req, res) => {
        try {
            // Extract flashcard ID from request parameters
            const flashcardId = req.params.flashcardId

            // Verify token and extract user ID
            const token = req.headers.authorization
            if (!token_provided(token)) {
                return res.status(401).send({ error: "Access denied. Token not provided." })
            }
            const decodedToken = await verifyToken(token)
            if (!decodedToken) {
                return res.status(403).send({ message: "Forbidden. Invalid token." })
            }
            const userId = decodedToken.userId

            // Check if the user has already voted for this flashcard
            let existingVote = await FlashcardVote.findOne({ flashcardId, userId })
            if (existingVote) {
                // If the user has already upvoted the flashcard, update the existing vote to a downvote
                if (existingVote.voteType === "upvote") {
                    existingVote.voteType = "downvote"
                    await existingVote.save()
                    return res.status(200).send({ message: "Your upvote has been changed to a downvote." })
                }
                // If the user has already downvoted the flashcard, return a message
                return res.status(400).send({ message: "You have already downvoted this flashcard." })
            } 
            
            // Create a new downvote for the flashcard
            existingVote = new FlashcardVote({
                flashcardId : flashcardId,
                userId : userId,
                voteType: "downvote"
            })
            await existingVote.save()

            res.status(200).send({ message: "Flashcard downvoted successfully." })
        } catch (error) {
            console.error(error)
            res.status(500).send({ error: "Failed to downvote flashcard." })
        }
    }




    module.exports = { upvoteFlashcard, downvoteFlashcard }
