import mongoose, { Schema } from 'mongoose';

export interface Polygon {
  type: 'Polygon';
  coordinates: number[][][];
}

export interface Species {
  species_name: string;
  image: string;
  category: mongoose.Types.ObjectId;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
}

interface SpeciesModel extends mongoose.Model<Species> {
  findByArea(polygon: Polygon): Promise<Species[]>;
}

const speciesSchema = new Schema<Species, SpeciesModel>({
  species_name: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

speciesSchema.index({ location: '2dsphere' });

speciesSchema.statics.findByArea = async function (
  polygon: Polygon
): Promise<Species[]> {
  return this.find({
    location: {
      $geoWithin: {
        $geometry: polygon,
      },
    },
  });
};

export default mongoose.model<Species, SpeciesModel>('Species', speciesSchema);
