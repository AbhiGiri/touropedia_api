import mongoose from "mongoose";
import tourModel from "../models/tourModel.js";

export const createTour = async (req, res) => {
    const tour = req.body;
    const newTour = new tourModel({
        ...tour,
        creator: req.userId,
        createdAt: new Date().toISOString()
    });
    try {
        await newTour.save();
        res.status(201).json(newTour);
    } 
    catch (error) {
        res.status(400).json({message: 'create tourSomething went wrong'});
    }
};

export const getTours = async (req, res) => {
  const {page} = req.query;
    try {
        const limit = 6;
        const startIndex = (Number(page) - 1) * limit;
        const total = await tourModel.countDocuments({});
        const tours = await tourModel.find().limit(limit).skip(startIndex);
        
        res.status(201).json({
          data: tours,
          currentPage: Number(page),
          totalTours: total,
          numberOfPages: Math.ceil(total / limit),
        });

    } catch (error) {
        res.status(400).json({message: 'something went wrong'});
    }
};

export const getTour = async (req, res) => {
    const {id} = req.params;
    try {
        const tours = await tourModel.findById(id);
        res.status(201).json(tours);

    } catch (error) {
        res.status(400).json({message: 'something went wrong'});
    }
};

export const getToursByUser = async (req, res) => {
    const {id} = req.params;
    
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({message: "user doesn't exist"});
    };
    const userTours = await tourModel.find({creator: id});
    res.status(200).json(userTours);
};


export const updateTour = async (req, res) => {
    const { id } = req.params;
    const { title, description, creator, imageFile, tags } = req.body;
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: `No tour exist with id: ${id}` });
      }
  
      const updatedTour = {
        creator,
        title,
        description,
        tags,
        imageFile,
        _id: id,
      };
      await tourModel.findByIdAndUpdate(id, updatedTour, { new: true });
      res.json(updatedTour);
      
    } catch (error) {
      res.status(404).json({ message: "Something went wrong" });
    }
};

export const deleteTour = async (req, res) => {
    const { id } = req.params;
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: `No tour exist with id: ${id}` });
      }
      await tourModel.findByIdAndRemove(id);
      res.json({ message: "Tour deleted successfully" });
      
    } catch (error) {
      res.status(404).json({ message: "Something went wrong" });
    }
};

export const getToursBySearch = async (req, res) => {
  const {searchQuery} = req.query;
  try {    
    const title = new RegExp(searchQuery, 'i');
    console.log(title);
    const tours = await tourModel.find({title});
    res.status(201).json(tours);

  } catch (error) {
    res.status(404).json({message: 'something went wrong while fetching tours BySearch'})
  }
};

export const getToursByTag = async (req, res) => {
  const {tag} = req.params;

  try {
      const tours = await tourModel.find({tags: {$in: tag}});
      res.status(201).json(tours);

  } catch (error) {
    res.status(400).json({message: 'something went wrong to find tag tours'});
  }
};

export const getRelatedTour = async (req, res) => {
  const {tags} = req.body;
  try {
      const tours = await tourModel.find({tags: {$in: tags}});
      res.status(201).json(tours);

  } catch (error) {
    res.status(400).json({message: 'something went wrong to find tag tours'});
  }
 };

 export const likeTour = async (req, res) => {
  const { id } = req.params;
  try {
    if (!req.userId) {
      return res.json({ message: "User is not authenticated" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: `No tour exist with id: ${id}` });
    }

    const tour = await tourModel.findById(id);

    const index = tour.likes.findIndex((id) => id === String(req.userId));

    if (index === -1) {
      tour.likes.push(req.userId);
    } else {
      tour.likes = tour.likes.filter((id) => id !== String(req.userId));
    }

    const updatedTour = await tourModel.findByIdAndUpdate(id, tour, {
      new: true,
    });
    res.status(200).json(updatedTour);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};