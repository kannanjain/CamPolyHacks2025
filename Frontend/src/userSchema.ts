import mongoose, {Schema} from "mongoose";

interface IUser{
    userId: string;
    name: string;
    email: string;
    interests: string[];
    visibility: boolean;
    lta: string;
    location: GeolocationCoordinates;
}

const userSchema = new Schema<IUser>({
    userId: {type: String, required: true},
    name: {type: String, required: false},
    email: {type: String, required: false},
    interests: {type: [String], required: false},
    visibility: {type: Boolean, required: true},
    lta: {type: String, required: false, default: ""},
    location: {type:GeolocationCoordinates, required: false}
})

export default mongoose.models.user || mongoose.model("user", userSchema);