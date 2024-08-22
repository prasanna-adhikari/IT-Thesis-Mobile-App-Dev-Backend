import mongoose from "mongoose";

export default async (MONGO_URI) => {
  try {
    await mongoose.connect(MONGO_URI, {});
    console.info(`MongoDB is connected\nURI: ${MONGO_URI}`);
  } catch (error) {
    console.error(error);
  }
};
