import mongoose from 'mongoose'
import mongooseSequence from 'mongoose-sequence' // Pravilno učitavanje mongoose-sequence

// Povezivanje mongoose-sequence sa mongoose instancom
const autoIncrement = mongooseSequence(mongoose) // Prosleđivanje mongoose instancu

const clientBilbordSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // povezivanje sa korisnikom
    },
    bilbord_id: {
      type: Number,
      unique: true,
    },
    imageUrl: {
      type: String,
      default: '',
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

// Dodat plugin za auto-increment
clientBilbordSchema.plugin(autoIncrement, { inc_field: 'bilbord_id' }) // Dodavanje inkrementa

const ClientBilbord = mongoose.model('ClientBilbord', clientBilbordSchema)

export default ClientBilbord
