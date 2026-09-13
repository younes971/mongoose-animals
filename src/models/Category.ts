import mongoose, { Schema } from 'mongoose';

export interface Category {
  category_name: string;
}

const categorySchema = new Schema<Category>({
  category_name: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
  },
});

export default mongoose.model<Category>('Category', categorySchema);
