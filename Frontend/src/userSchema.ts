import mongoose, {Schema} from "mongoose";

interface IUser{
    name: string;
    email: string;
    interests: string[];
    visibility: boolean;
    lta: string;
    location: {longitude: GeolocationCoordinates, latitude: GeolocationCoordinates};
}

const userSchema = new Schema<IUser>({
    name: {type: String, required: false},
    email: {type: String, required: false},
    interests: {type: [String], required: false},
    visibility: {type: Boolean, required: true},
    lta: {type: String, required: false, default: ""},
    location: {longitude:{type: GeolocationCoordinates, required: false}, latitude: {type: GeolocationCoordinates, required: false}}
})

export default mongoose.models.user || mongoose.model("user", userSchema);