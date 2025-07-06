import React from 'react'
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';

const ProfilePage = () => {

    const [selectedImage, setSelectedImage] = React.useState(null);
    const [fullName, setFullName] = React.useState('Martin Smith');
    const [bio, setBio] = React.useState('Hi Everyone, I am Using QuickChat');

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        navigate('/');
    };

    return (
        <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center text-white'>
            <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg'>
                <form onSubmit={handleSubmit} className='flex flex-col gap-5 p-10 flex-1'>
                    <h3 className='text-lg'>Profile Details</h3>
                    <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'>
                        <input onChange={(e) => setSelectedImage(e.target.files[0])} type="file" id='avatar' hidden accept='.png, .jpeg, .jpg' />

                        <img src={selectedImage ? URL.createObjectURL(selectedImage) : assets.avatar_icon} alt="" className={`w-12 h-12 object-cover ${selectedImage && 'rounded-full'}`} />
                        upload profile image
                    </label>
                    <input
                        onChange={(e) => setFullName(e.target.value)} value={fullName}
                        type="text" className='p-2 border border-gray-500 rounded-md focus:outline-none' placeholder='Your Name' required />

                    <textarea
                        onChange={(e) => setBio(e.target.value)} value={bio}
                        rows={4}
                        placeholder='provide a short bio' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500'></textarea>

                    <button type='submit' className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer'>
                        Submit
                    </button>
                </form>
                <img className='max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 ' src={assets.logo_icon} alt="" />
            </div>
        </div>
    )
}

export default ProfilePage