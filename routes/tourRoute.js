import express from 'express';
import { createTour, deleteTour, getRelatedTour, getTour, getTours, getToursBySearch, getToursByTag, getToursByUser, likeTour, updateTour } from '../controllers/tourController.js';
import auth from '../middlewares/authMiddleware.js';
const router = express.Router();


router.get('/search', getToursBySearch);
router.get('/tag/:tag', getToursByTag);
router.post('/relatedTours', getRelatedTour);

router.route('/').post(auth, createTour).get(getTours);
router.get('/:id', getTour);
router.get('/userTours/:id', auth, getToursByUser);
router.delete("/:id", auth, deleteTour);
router.patch("/:id", auth, updateTour);
router.patch("/like/:id", auth, likeTour);


export default router;
