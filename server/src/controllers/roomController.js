import Hotel from "../models/Hotel";


//api to create a new room for a hotel
export const createRoom = async (req, res) => {
    try {
        const { roomType, pricePerNight, amenities } = req.body;
        const hotel = await Hotel.findOne({ owner: req.auth.userId });
        if (!hotel) {
            return res.json({ success: false, message: 'No Hotel found' });
        }
    } catch (error) {

    }
}

//api to get all rooms
export const getAllRooms = async (req, res) => {

}

//api to get all rooms for a specific hotel
export const getOwnerRooms = async (req, res) => {

}

//get to toggle availability of a room

