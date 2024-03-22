import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

type UserProfile = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

const Profile = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState({ name: '', email: '', avatar: null });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const { data } = await axios.get<UserProfile>('http://localhost:5000/api/users/v1/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserProfile(data);
        setEditData({ name: data.name, email: data.email, avatar: null }); // Pre-fill edit form
      } catch (error) {
        console.error('Error fetching profile:', error);
        router.push('/login');
      }
    };

    fetchUserProfile();
  }, [router]);

  const handleEditChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (files) {
      setEditData({ ...editData, avatar: files[0] });
    } else {
      setEditData({ ...editData, [name]: value });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('name', editData.name);
    formData.append('email', editData.email);
    if (editData.avatar) formData.append('avatar', editData.avatar);

    const token = localStorage.getItem('token');
    try {
      await axios.put('http://localhost:5000/api/users/v1/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setIsEditMode(false);
      setLoading(false);
      // Optionally refetch user profile here to update UI
    } catch (error) {
      console.error('Error updating profile:', error);
      setLoading(false);
    }
  };

  if (!userProfile) return <div>Loading...</div>;

return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Profile</h1>
      {!isEditMode ? (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700">Name:</label>
              <p className="mt-1">{userProfile.name}</p>
            </div>
            <div>
              <label className="block text-gray-700">Email:</label>
              <p className="mt-1">{userProfile.email}</p>
            </div>
          </div>
          {userProfile.avatar && (
            <div className="mt-4">
              <label className="block text-gray-700">Avatar:</label>
              <img src={'http://localhost:5000/'+userProfile.avatar} alt="Avatar" className="mt-1 w-24 h-24 rounded-full" />
            </div>
          )}
          <button
            onClick={() => setIsEditMode(true)}
            className="mt-6 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-150 ease-in-out"
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow rounded-lg p-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={editData.name}
              onChange={handleEditChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Your Name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={editData.email}
              onChange={handleEditChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Your Email"
            />
          </div>
          <div>
            <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">Avatar</label>
            <input
              type="file"
              name="avatar"
              onChange={handleEditChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <button
            type="submit"
            className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-150 ease-in-out disabled:bg-blue-300"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      )}


    </div>
);  
};

export default Profile;
