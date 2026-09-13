import { Request, Response } from 'express';
import Species from '../models/Species';

export const getSpecies = async (_req: Request, res: Response) => {
  try {
    const species = await Species.find();
    res.json(species);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getSpeciesById = async (req: Request, res: Response) => {
  try {
    const species = await Species.findById(req.params.id);

    if (!species) {
      res.status(404).json({ message: 'Species not found' });
      return;
    }

    res.json(species);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const createSpecies = async (req: Request, res: Response) => {
  try {
    const species = await Species.create(req.body);
    res.status(201).json(species);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const updateSpecies = async (req: Request, res: Response) => {
  try {
    const species = await Species.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!species) {
      res.status(404).json({ message: 'Species not found' });
      return;
    }

    res.json(species);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const deleteSpecies = async (req: Request, res: Response) => {
  try {
    const species = await Species.findByIdAndDelete(req.params.id);

    if (!species) {
      res.status(404).json({ message: 'Species not found' });
      return;
    }

    res.json(species);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getSpeciesByArea = async (req: Request, res: Response) => {
  try {
    const species = await Species.findByArea(req.body);
    res.json(species);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
