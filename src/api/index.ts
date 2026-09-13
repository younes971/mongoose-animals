import express, {Request, Response} from 'express';
import {MessageResponse} from '../types/Messages';
import categoriesRouter from './categories';
import speciesRouter from './species';
import animalsRouter from './animals';

const router = express.Router();

router.get<{}, MessageResponse>('/', (_req: Request, res: Response) => {

  res.json({

    message: 'api v1',

  });

});

router.use('/categories', categoriesRouter);
router.use('/species', speciesRouter);
router.use('/animals', animalsRouter);

export default router;
