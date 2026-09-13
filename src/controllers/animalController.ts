import { Request, Response } from 'express';
import Animal from '../models/Animal';

export const getAnimals = async (_req: Request, res: Response) => {
  try {
    const animals = await Animal.find()
      .populate({
        path: 'species',
        populate: {
          path: 'category',
        },
      })
      .select('-__v');

    res.json(animals);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getAnimalById = async (req: Request, res: Response) => {
  try {
    const animal = await Animal.findById(req.params.id)
  .populate({
    path: 'species',
    populate: {
      path: 'category',
    },
  })
  .select('-__v');

    if (!animal) {
      res.status(404).json({ message: 'Animal not found' });
      return;
    }

    res.json(animal);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const createAnimal = async (req: Request, res: Response) => {
  try {
    const animal = await Animal.create(req.body);
    res.status(201).json(animal);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const updateAnimal = async (req: Request, res: Response) => {
  try {
    const animal = await Animal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!animal) {
      res.status(404).json({ message: 'Animal not found' });
      return;
    }

    res.json(animal);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const deleteAnimal = async (req: Request, res: Response) => {
  try {
    const animal = await Animal.findByIdAndDelete(req.params.id);

    if (!animal) {
      res.status(404).json({ message: 'Animal not found' });
      return;
    }

    res.json(animal);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getAnimalsByLocation = async (req: Request, res: Response) => {
  try {
    const topRight = req.query.topRight as string;
    const bottomLeft = req.query.bottomLeft as string;

    const [topRightLat, topRightLon] = topRight.split(',').map(Number);
    const [bottomLeftLat, bottomLeftLon] = bottomLeft.split(',').map(Number);

    const animals = await Animal.find({
  location: {
    $geoWithin: {
      $box: [
        [bottomLeftLon, bottomLeftLat],
        [topRightLon, topRightLat],
      ],
    },
  },
})
  .populate({
    path: 'species',
    populate: {
      path: 'category',
    },
  })
  .select('-__v');
    res.json(animals);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const getAnimalsBySpecies = async (req: Request, res: Response) => {
  try {
    const animals = await Animal.aggregate([
      {
        $lookup: {
          from: 'species',
          localField: 'species',
          foreignField: '_id',
          as: 'species',
        },
      },
      {
        $unwind: '$species',
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'species.category',
          foreignField: '_id',
          as: 'species.category',
        },
      },
      {
        $unwind: '$species.category',
      },
      {
        $match: {
          'species.species_name': req.params.species,
        },
      },
      {
        $project: {
          __v: 0,
          'species.__v': 0,
          'species.category.__v': 0,
        },
      },
    ]);

    res.json(animals);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

