import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { assets, facilityIcons, roomCommonData } from '../assets/assets';
import StarRating from '../components/StarRating';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const RoomDetails = () => {
  const { id } = useParams();
  const { rooms, getToken, axios, navigate } = useAppContext();
  const [room, setRoom] = useState(null);
  const [mainImage, setMainImage] = useState(null);

  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState(1);

  const [isAvailable, setIsAvailable] = useState(false);

  const checkAvailability = async () => {
    try {
      if (!checkInDate || !checkOutDate) {
        toast.error('Please select both check-in and check-out dates');
        return;
      }

      if (new Date(checkInDate) > new Date(checkOutDate)) {
        toast.error('Check-In Date should be less than Check-Out Date');
        return;
      }

      const { data } = await axios.post('/api/bookings/check-availability', {
        room: id,
        checkInDate,
        checkOutDate,
      });

      if (data.success) {
        if (data.isAvailable) {
          setIsAvailable(true);
          toast.success('Room is available');
        } else {
          setIsAvailable(false);
          toast.error('Room is not available');
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (!isAvailable) {
        await checkAvailability();
        return;
      }

      const { data } = await axios.post(
        '/api/bookings/book',
        { room: id, checkInDate, checkOutDate, guests, paymentMethod: 'Pay At Hotel' },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        toast.success(data.message);
        navigate('/my-bookings');
        window.scrollTo(0, 0);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const foundRoom = rooms.find((room) => room._id === id);
    if (foundRoom) {
      setRoom(foundRoom);
      setMainImage(foundRoom.images[0]);
    }
  }, [rooms, id]);

  if (!room) return null;

  return (
    <div className="py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32">
      {/* Room Title */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
        <h1 className="text-3xl md:text-4xl font-playfair">
          {room.hotel.name} <span className="font-inter text-sm">({room.roomType})</span>
        </h1>
        <p className="text-xs font-inter py-1.5 px-3 text-white bg-orange-500">20% OFF</p>
      </div>

      {/* Ratings */}
      <div className="flex items-center gap-1 mt-2">
        <StarRating />
        <p className="ml-2">200+ reviews</p>
      </div>

      {/* Location */}
      <div className="flex items-center mt-2 gap-1">
        <img src={assets.locationIcon} alt="location" />
        <span>{room.hotel.address}</span>
      </div>

      {/* Images */}
      <div className="flex flex-col lg:flex-row mt-6 gap-6">
        <div className="lg:w-1/2 w-full">
          <img src={mainImage} alt="room main" className="w-full rounded-xl shadow-lg object-cover" />
        </div>
        <div className="grid grid-cols-2 gap-4 lg:w-1/2 w-full">
          {room.images.length > 1 &&
            room.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`room ${index}`}
                className={`w-full rounded-xl shadow-md object-cover cursor-pointer ${mainImage === image ? 'outline-3 outline-orange-500' : ''
                  }`}
                onClick={() => setMainImage(image)}
              />
            ))}
        </div>
      </div>

      {/* Highlights */}
      <div className="flex flex-col md:flex-row md:justify-between mt-10">
        <div className="flex flex-col">
          <h1 className="text-3xl md:text-4xl font-playfair">Experience Luxury like Never Before</h1>
          <div className="flex flex-wrap items-center mt-3 mb-6 gap-4">
            {room.amenities.map((item, index) => (
              <div key={index} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100">
                <img src={facilityIcons[item]} alt={item} className="w-5 h-5" />
                <p className="text-xs">{item}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-2xl font-medium">${room.pricePerNight}/night</p>
      </div>

      {/* Booking Form */}
      <form
        className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl mx-auto mt-16 max-w-6xl"
        onSubmit={onSubmitHandler}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-10 text-gray-500">
          {/* Check-In */}
          <div className="flex flex-col">
            <label htmlFor="checkInDate" className="font-medium">
              Check-In
            </label>
            <input
              type="date"
              id="checkInDate"
              className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
              required
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Separator */}
          <div className="w-px h-20 bg-gray-300/70 hidden md:block"></div>

          {/* Check-Out */}
          <div className="flex flex-col">
            <label htmlFor="checkOutDate" className="font-medium">
              Check-Out
            </label>
            <input
              type="date"
              id="checkOutDate"
              className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
              required
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              min={checkInDate}
              disabled={!checkInDate}
            />
          </div>

          {/* Separator */}
          <div className="w-px h-20 bg-gray-300/70 hidden md:block"></div>

          {/* Guests */}
          <div className="flex flex-col">
            <label htmlFor="guests" className="font-medium">
              Guests
            </label>
            <input
              type="number"
              id="guests"
              min="1"
              className="max-w-20 rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
              required
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-primary hover:bg-primary-dull active:scale-95 transition-all text-white rounded-md max-md:w-full max-md:mt-6 md:px-25 py-3 md:py-4 text-base cursor-pointer"
        >
          {isAvailable ? 'Book Now' : 'Check Availability'}
        </button>
      </form>

      {/* Room Common Data */}
      <div className="mt-25 space-y-4">
        {roomCommonData.map((spec, index) => (
          <div key={index} className="flex items-start gap-2">
            <img src={spec.icon} alt={`${spec.title}-icon`} className="w-6.5" />
            <div>
              <p className="text-base">{spec.title}</p>
              <p className="text-gray-500">{spec.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Description */}
      <div className="max-w-3xl border-y border-gray-300 my-15 py-10 text-gray-500">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus velit, distinctio doloribus ducimus numquam
          inventore nobis odio aliquid est doloremque molestias maiores at soluta possimus explicabo? Ipsa quos cum nemo
          rem ipsam tempora, exercitationem neque qui esse alias, deleniti, porro ab consequuntur repellat magnam officia?
        </p>
      </div>

      {/* Host Info */}
      <div className="flex flex-col items-start gap-4">
        <div className="flex items-center gap-4">
          <img src={room.hotel.owner.image} alt="host" className="h-14 w-14 md:h-18 md:w-18 rounded-full" />
          <div>
            <p className="text-lg md:text-xl">Hosted by {room.hotel.name}</p>
            <div className="flex items-center mt-1">
              <StarRating />
              <p className="ml-2">200+ reviews</p>
            </div>
          </div>
        </div>
        <button className="px-6 py-2.5 mt-4 rounded text-white bg-primary hover:bg-primary-dull transition-all cursor-pointer">
          Contact Now
        </button>
      </div>
    </div>
  );
};

export default RoomDetails;