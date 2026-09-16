import React, { useRef, useState } from 'react';
import { FiCamera } from 'react-icons/fi';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';

const AvatarUpload = ({ user, onUploadSuccess }) => {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      return toast.error('ছবি ২ মেগাবাইটের চেয়ে ছোট হতে হবে');
    }

    const formData = new FormData();
    formData.append('avatar', file);

    setLoading(true);
    try {
      const res = await authAPI.uploadAvatar(formData);
      toast.success('প্রোফাইল ছবি সফলভাবে আপডেট হয়েছে');
      if (onUploadSuccess && res.data?.user) {
        onUploadSuccess(res.data.user);
      }
    } catch (err) {
      toast.error('ছবি আপলোড করতে ব্যর্থ হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const getAvatarUrl = () => {
    if (user?.avatar) {
      return user.avatar;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=random`;
  };

  return (
    <div className="relative inline-block">
      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg bg-gray-100 dark:bg-gray-800">
        <img 
          src={getAvatarUrl()} 
          alt={user?.name || 'Avatar'} 
          className="w-full h-full object-cover"
        />
        {loading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          </div>
        )}
      </div>
      <button 
        onClick={() => fileInputRef.current?.click()}
        disabled={loading}
        className="absolute bottom-0 right-0 p-2 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
        title="ছবি পরিবর্তন করুন"
      >
        <FiCamera size={16} />
      </button>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
    </div>
  );
};

export default AvatarUpload;
