import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IBook extends Document {
  title: string
  author: string
  price: number
  genre: string
  publicationDate?: Date
  isbn?: string
  stock: number
  imageUrl?: string
  description?: string
}

const BookSchema = new Schema<IBook>({
  title: { type: String, required: true, trim: true, index: true },
  author: { type: String, required: true, trim: true, index: true },
  price: { type: Number, required: true, min: 0 },
  genre: { type: String, required: true, index: true },
  publicationDate: { type: Date },
  isbn: { type: String, unique: false, sparse: true },
  stock: { type: Number, default: 0, min: 0, index: true },
  imageUrl: { type: String },
  description: { type: String },
}, { timestamps: true })

BookSchema.index({ title: 'text', author: 'text', description: 'text' })

export const Book: Model<IBook> = mongoose.models.Book || mongoose.model<IBook>('Book', BookSchema)
