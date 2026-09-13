import mongoose, { Schema } from 'mongoose';

export interface Animal {
  animal_name: string;
  birthdate: Date;
  species: mongoose.Types.ObjectId;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
}

interface AnimalModel extends mongoose.Model<Animal> {
  findBySpecies(species_name: string): Promise<Animal[]>;
}

const animalSchema = new Schema<Animal, AnimalModel>({
  animal_name: {
    type: String,
    required: true,
    minlength: 2,
  },
  birthdate: {
    type: Date,
    required: true,
    validate: {
      validator: (value: Date) => value <= new Date(),
      message: 'Birthdate cannot be in the future',
    },
  },
  species: {
    type: Schema.Types.ObjectId,
    ref: 'Species',
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

animalSchema.statics.findBySpecies = async function (
  species_name: string
): Promise<Animal[]> {
  const species = await mongoose
    .model('Species')
    .findOne({ species_name });

  if (!species) {
    return [];
  }

  return this.find({ species: species._id });
};

animalSchema.index({ location: '2dsphere' });

export default mongoose.model<Animal, AnimalModel>('Animal', animalSchema);
