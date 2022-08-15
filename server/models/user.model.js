import mongoose from "mongoose";
const Schema = mongoose.Schema

const userSchema = new Schema({
    publicAddress: {
        type: Schema.Types.String,
        required: true,
    },
    mnemonicPhrase: {
        type: Schema.Types.String,
        required: true,
    },
    email: {
        type: Schema.Types.String,
        required: true,
    },
    name: {
        type: Schema.Types.String,
        required: true,
    },
    picture: {
        type: Schema.Types.String,
        required: true,
    },
    refresh_token: {
        type: Schema.Types.String,
        required: false,
    },
})
const User = mongoose.model('User', userSchema);
export default User