import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  brand: string;
  category: string;
  categoryLabel: string;
  price: number;
  weight: string;
  netWeight: string;
  unit: string;
  image: string;
  images: string[];
  description: string;
  descriptionFull: string;
  tags: string[];
  isNew: boolean;
  isPremium: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    brand: { type: String, default: "SmaG", trim: true },
    category: { type: String, default: "pechenye" },
    categoryLabel: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    weight: { type: String, required: true },
    netWeight: { type: String, default: "" },
    unit: { type: String, default: "quti" },
    image: { type: String, required: true },
    images: [{ type: String }],
    description: { type: String, default: "" },
    descriptionFull: { type: String, default: "" },
    tags: [{ type: String }],
    isNew: { type: Boolean, default: false },
    isPremium: { type: Boolean, default: false },
  },
  { timestamps: true, suppressReservedKeysWarning: true }
);

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
