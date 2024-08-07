import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useUser } from '../context/Auth';
import { useNavigate } from 'react-router-dom';


const Products = () => {
    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const { user, updateUser } = useUser();


    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('price', data.price);
        formData.append('quantity', data.quantity);
        formData.append('userId', user.userId);
        images.forEach(image => {
            formData.append('pictures', image);
        });

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5000/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            toast.success("product created successful!")
            handleClear();
        } catch (err) {
            toast.error(err.message)
            console.error(err);
        }
    };

    const handleImageChange = (e) => {

        const newFiles = Array.from(e.target.files);
        const combinedFiles = [...images, ...newFiles];

        const oversizedFiles = combinedFiles.filter(file => file.size > 3 * 1024 * 1024); // 3MB in bytes
        if (oversizedFiles.length > 0) {
            alert('Each image must be smaller than 3MB');
            e.target.value = null; // Clear the file input
            return;
        }

        if (combinedFiles.length > 6) {
            alert('You can only upload up to 6 images');
            e.target.value = null; // Clear the file input
            return;
        }

        setImages(combinedFiles);
        setImagePreviews(combinedFiles.map(file => URL.createObjectURL(file)));
    };


    const handleDeleteImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        setImages(newImages);
        setImagePreviews(newPreviews);

        // Create a new DataTransfer object and append the remaining files
        const dataTransfer = new DataTransfer();
        newImages.forEach(file => dataTransfer.items.add(file));

        // Update the file input with the new files
        document.getElementById('pictures').files = dataTransfer.files;
    };


    const handleClear = () => {

        reset(); // reset all fields
        setImages(null);
        setImagePreviews(null);
    }

    // handle Logout 
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("token")
        updateUser(null)
        toast.success('Logged out successfully');
        navigate("/login")
    }
    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">

            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md flex flex-col justify-between gap-3">
                <span className='cursor-pointer hover:bg-gray-200 hover:font-semibold w-max px-2' onClick={handleLogout}>Logout</span>
                <h2 className="text-2xl font-bold mb-6 text-center">Submit Your Details</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                            id="name"
                            type="text"
                            {...register('name', { required: true, minLength: 3 })}
                            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : ''
                                }`}
                            placeholder="Enter name"
                        />
                        {errors.name && <p className="text-red-500 text-sm">Name is required and should be at least 3 characters</p>}
                    </div>
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                        <input
                            id="price"
                            type="number"
                            {...register('price', { required: true, min: 0 })}
                            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.price ? 'border-red-500' : ''
                                }`}
                            placeholder="Enter price"
                        />
                        {errors.price && <p className="text-red-500 text-sm">Price is required and should be a positive number</p>}
                    </div>
                    <div>
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                        <input
                            id="quantity"
                            type="number"
                            {...register('quantity', { required: true, min: 0 })}
                            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.quantity ? 'border-red-500' : ''
                                }`}
                            placeholder="Enter quantity"
                        />
                        {errors.quantity && <p className="text-red-500 text-sm">Quantity is required and should be a positive number</p>}
                    </div>
                    <div>
                        <label htmlFor="pictures" className="block text-sm font-medium text-gray-700 mb-1">Pictures</label>
                        <input
                            id="pictures"
                            type="file"
                            multiple
                            {...register('pictures', { required: true })}
                            onChange={handleImageChange}
                            className="block w-full text-gray-500 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.pictures && <p className="text-red-500 text-sm">At least one picture is required & less then 3MB</p>}
                        <div className="mt-2 flex flex-wrap gap-2">
                            {imagePreviews?.map((preview, index) => (
                                <div key={index} className="relative w-24 h-24 group">
                                    <img src={preview} alt={`Preview ${index}`} className="object-cover rounded-md shadow-sm w-full h-full" />
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out cursor-pointer" onClick={() => handleDeleteImage(index)}>
                                        <img src="/images/icons/ic_delete.svg" alt="del icon" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Submit
                    </button>

                </form>
                <button
                    onClick={handleClear}
                    className="w-full py-2 px-4 bg-red-600 text-white font-semibold rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                    Clear Form
                </button>

                <span className='text-[12px] text-center text-gray-400 tracking-widest'>powered by usama ramzan</span>
            </div >
        </div >
    );
};

export default Products;
