import express from 'express';

import {
  getSpecies,
  getSpeciesById,
  createSpecies,
  updateSpecies,
  deleteSpecies,
  getSpeciesByArea,
} from '../controllers/speciesController';

const router = express.Router();

router.post('/', createSpecies);
router.get('/', getSpecies);
router.post('/area', getSpeciesByArea);
router.get('/:id', getSpeciesById);
router.put('/:id', updateSpecies);
router.delete('/:id', deleteSpecies);

export default router;
