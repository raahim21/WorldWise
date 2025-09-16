import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  password: {
    type: String,
    required: true,
  },
});

// export default mongoose.model("User", userSchema);
export default mongoose.model("User", userSchema, "users_no_username");
