import mongoose from "mongoose";
import { arrayLimit } from "./validators";

export type PointType = {
  type: "Point";
  coordinates: [Number, Number];
};

type Location = {
  latitude: Number;
  longitude: Number;
};

export function fromLocation({ latitude, longitude }: Location): PointType {
  return {
    type: "Point",
    coordinates: [longitude, latitude]
  };
}

export const PointSchema = new mongoose.Schema({
  type: {
    type: String, // Don't do `{ location: { type: String } }`
    enum: ["Point"], // 'location.type' must be 'Point'
    required: true
  },
  coordinates: {
    type: [Number], // [ longitude, latitude ] -> Yes, LONGITUDE FIRST, latitude second
    validate: [arrayLimit(2), "Need pass lat and long"],
    required: true
  }
});
