import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Heart, Star, Coffee, Utensils, Film, Music, ShoppingBag, Plus, Search, CheckCircle, Send, MessageCircle, ArrowLeft, Mail, Lock, Upload, Video, X, Camera } from 'lucide-react';

export default function DateMoneyApp() {
  const [userType, setUserType] = useState(null);
  const [view, setView] = useState('home');
  const [selectedCompanion, setSelectedCompanion] = useState(null);
  const [meetingDetails, setMeetingDetails] = useState({ hours: 1, date: '', time: '' });
  const [chatMessage, setChatMessage] = useState('');
  const [activeChat, setActiveChat] = useState(null);
  const [showReviews, setShowReviews] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMediaUpload, setShowMediaUpload] = useState(false);
  
  const [companions, setCompanions] = useState([
    {
      id: 1,
      name: 'Sarah Miller',
      age: 28,
      photo: '👩‍🦰',
      pricePerHour: 500,
      rating: 4.8,
      reviews: 47,
      activities: ['Coffee', 'Food', 'Shopping'],
      bio: 'Love meeting new people! Great conversationalist who enjoys trying new cafes and restaurants.',
      location: 'Downtown',
      verified: true,
      media: [
        { id: 1, type: 'image', url: '📸', caption: 'Coffee date vibes!', likes: 45 },
        { id: 2, type: 'video', url: '🎥', caption: 'Day out shopping', duration: '8s', likes: 67 },
        { id: 3, type: 'image', url: '📸', caption: 'Sunset walk', likes: 89 }
      ],
      availability: {
        monday: ['10:00-14:00', '16:00-20:00'],
        tuesday: ['10:00-14:00', '16:00-20:00'],
        wednesday: ['10:00-14:00'],
        thursday: ['10:00-14:00', '16:00-20:00'],
        friday: ['14:00-22:00'],
        saturday: ['12:00-22:00'],
        sunday: ['12:00-18:00']
      },
      reviewsList: [
        { user: 'John D.', rating: 5, comment: 'Amazing company! Very friendly and great conversation.', date: '2 days ago' },
        { user: 'Mike R.', rating: 4, comment: 'Had a nice coffee date. Would recommend!', date: '1 week ago' }
      ],
      chatHistory: []
    },
    {
      id: 2,
      name: 'Alex Chen',
      age: 32,
      photo: '👨',
      pricePerHour: 600,
      rating: 4.9,
      reviews: 63,
      activities: ['Coffee', 'Movies', 'Music'],
      bio: 'Film enthusiast and coffee lover. Always up for interesting conversations about art and culture.',
      location: 'Midtown',
      verified: true,
      media: [
        { id: 1, type: 'video', url: '🎥', caption: 'Movie recommendations', duration: '10s', likes: 89 },
        { id: 2, type: 'image', url: '📸', caption: 'New cafe discovery!', likes: 54 }
      ],
      availability: {
        monday: ['18:00-22:00'],
        wednesday: ['18:00-22:00'],
        friday: ['16:00-23:00'],
        saturday: ['14:00-23:00'],
        sunday: ['14:00-20:00']
      },
      reviewsList: [
        { user: 'Emma S.', rating: 5, comment: 'Best companion ever! So knowledgeable about films.', date: '3 days ago' }
      ],
      chatHistory: []
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    bio: '',
    pricePerHour: '',
    location: '',
    activities: [],
    media: [],
    availability: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: []
    }
  });

  const [clientProfile, setClientProfile] = useState({
    name: '',
    email: '',
    verified: false
  });

  const [authForm, setAuthForm] = useState({
    email: '',
    password: '',
    name: '',
    isSignUp: false
  });

  const activityIcons = {
    'Coffee': <Coffee className="w-5 h-5" />,
    'Food': <Utensils className="w-5 h-5" />,
    'Movies': <Film className="w-5 h-5" />,
    'Music': <Music className="w-5 h-5" />,
    'Shopping': <ShoppingBag className="w-5 h-5" />
  };

  const activityOptions = ['Coffee', 'Food', 'Movies', 'Music', 'Shopping'];
  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const timeSlots = ['09:00-12:00', '12:00-15:00', '15:00-18:00', '18:00-21:00', '21:00-24:00'];

  const toggleActivity = (activity) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.includes(activity)
        ? prev.activities.filter(a => a !== activity)
        : [...prev.activities, activity]
    }));
  };

  const toggleAvailability = (day, slot) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: prev.availability[day].includes(slot)
          ? prev.availability[day].filter(s => s !== slot)
          : [...prev.availability[day], slot]
      }
    }));
  };

  import { uploadImageToCloudinary, uploadVideoToCloudinary } from './cloudinaryConfig';

// Replace the old handleMediaUpload function with this:
const handleMediaUpload = (type) => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = type === 'video' ? 'video/*' : 'image/*';
  
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File too large! Maximum size is 10MB');
        return;
      }
      
      // Show loading message
      alert('Uploading... Please wait');
      
      try {
        let uploadedUrl;
        
        if (type === 'video') {
          // Check video duration
          const video = document.createElement('video');
          video.preload = 'metadata';
          video.onloadedmetadata = async () => {
            window.URL.revokeObjectURL(video.src);
            if (video.duration > 10) {
              alert('Video too long! Maximum duration is 10 seconds');
              return;
            }
            
            // Upload to Cloudinary
            uploadedUrl = await uploadVideoToCloudinary(file);
            addMediaToProfile(uploadedUrl, type, Math.round(video.duration));
          };
          video.src = URL.createObjectURL(file);
        } else {
          // Upload image to Cloudinary
          uploadedUrl = await uploadImageToCloudinary(file);
          addMediaToProfile(uploadedUrl, type, null);
        }
      } catch (error) {
        alert('Upload failed! Please try again.');
        console.error('Upload error:', error);
      }
    }
  };
  
  input.click();
  setShowMediaUpload(false);
};

const addMediaToProfile = (url, type, duration) => {
  const newMedia = {
    id: Date.now(),
    type: type,
    url: url, // Now this is the actual Cloudinary URL!
    caption: 'New post',
    likes: 0,
    duration: duration ? `${duration}s` : null
  };
  setFormData(prev => ({
    ...prev,
    media: [...prev.media, newMedia]
  }));
  alert('Upload successful! ✅');
};
        
        // Check video duration for videos
        if (type === 'video') {
          const video = document.createElement('video');
          video.preload = 'metadata';
          video.onloadedmetadata = () => {
            window.URL.revokeObjectURL(video.src);
            if (video.duration > 10) {
              alert('Video too long! Maximum duration is 10 seconds');
              return;
            }
            addMediaToProfile(file, type, video.duration);
          };
          video.src = URL.createObjectURL(file);
        } else {
          addMediaToProfile(file, type, null);
        }
      }
    };
    
    input.click();
    setShowMediaUpload(false);
  };
  
  const addMediaToProfile = (file, type, duration) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const newMedia = {
        id: Date.now(),
        type: type,
        url: e.target.result, // This is the base64 data URL
        caption: file.name,
        likes: 0,
        duration: duration ? `${Math.round(duration)}s` : null
      };
      setFormData(prev => ({
        ...prev,
        media: [...prev.media, newMedia]
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleLogin = () => {
    if (authForm.email && authForm.password) {
      if (authForm.isSignUp && !authForm.name) {
        alert('Please enter your name');
        return;
      }
      setClientProfile({ 
        name: authForm.name || authForm.email.split('@')[0], 
        email: authForm.email, 
        verified: true 
      });
      setIsLoggedIn(true);
      setView('browse');
    }
  };

  const handleCompanionSubmit = () => {
    if (formData.name && formData.age && formData.pricePerHour && formData.bio && 
        formData.location && formData.activities.length > 0) {
      const newCompanion = {
        id: companions.length + 1,
        name: formData.name,
        age: parseInt(formData.age),
        photo: '👤',
        pricePerHour: parseInt(formData.pricePerHour),
        rating: 5.0,
        reviews: 0,
        activities: formData.activities,
        bio: formData.bio,
        location: formData.location,
        verified: true,
        media: formData.media,
        availability: formData.availability,
        reviewsList: [],
        chatHistory: []
      };
      setCompanions([...companions, newCompanion]);
      setFormData({ 
        name: '', 
        age: '', 
        bio: '', 
        pricePerHour: '', 
        location: '', 
        activities: [], 
        media: [],
        availability: {
          monday: [], tuesday: [], wednesday: [], thursday: [], friday: [], saturday: [], sunday: []
        }
      });
      setView('browse');
      alert('Profile created successfully! 🎉');
    } else {
      alert('Please fill all required fields');
    }
  };

  const handleMeetRequest = (companion) => {
    setSelectedCompanion(companion);
    setView('meet-request');
  };

  const openChat = (companion) => {
    setActiveChat(companion);
    setView('chat');
  };

  const sendMessage = () => {
    if (chatMessage.trim() && activeChat) {
      const updatedCompanions = companions.map(c => {
        if (c.id === activeChat.id) {
          return {
            ...c,
            chatHistory: [...c.chatHistory, { sender: 'client', message: chatMessage, time: new Date().toLocaleTimeString() }]
          };
        }
        return c;
      });
      setCompanions(updatedCompanions);
      setActiveChat({
        ...activeChat,
        chatHistory: [...activeChat.chatHistory, { sender: 'client', message: chatMessage, time: new Date().toLocaleTimeString() }]
      });
      setChatMessage('');
    }
  };

  const submitReview = (companion) => {
    if (newReview.comment.trim()) {
      const updatedCompanions = companions.map(c => {
        if (c.id === companion.id) {
          return {
            ...c,
            reviewsList: [
              { user: clientProfile.name || 'Anonymous', rating: newReview.rating, comment: newReview.comment, date: 'Just now' },
              ...c.reviewsList
            ],
            reviews: c.reviews + 1
          };
        }
        return c;
      });
      setCompanions(updatedCompanions);
      setNewReview({ rating: 5, comment: '' });
      setShowReviews(false);
    }
  };

  const totalAmount = selectedCompanion ? selectedCompanion.pricePerHour * meetingDetails.hours : 0;

  if (!userType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <Heart className="w-16 h-16 text-pink-500 mx-auto mb-4" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-3">
              DateMoney
            </h1>
            <p className="text-gray-600 text-lg">Connect, Meet, Get Paid</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div 
              onClick={() => { setUserType('client'); setView('client-login'); }}
              className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition cursor-pointer border-2 border-transparent hover:border-purple-300"
            >
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Find a Companion</h2>
              <p className="text-gray-600 mb-4">Browse companions, view photos/videos, free chat, and meet!</p>
              <div className="flex items-center gap-2 text-sm text-purple-600 font-medium">
                <span>Get Started</span>
                <span>→</span>
              </div>
            </div>

            <div 
              onClick={() => { setUserType('companion'); setView('companion-setup'); }}
              className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition cursor-pointer border-2 border-transparent hover:border-pink-300"
            >
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 text-pink-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Become a Companion</h2>
              <p className="text-gray-600 mb-4">Set your schedule, upload photos/videos, chat free, earn money!</p>
              <div className="flex items-center gap-2 text-sm text-pink-600 font-medium">
                <span>Start Earning</span>
                <span>→</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-pink-500" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                DateMoney
              </h1>
              {isLoggedIn && clientProfile.verified && (
                <span className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  <CheckCircle className="w-4 h-4" />
                  {clientProfile.name}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              {userType === 'companion' && (
                <>
                  <button
                    onClick={() => setView('browse')}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      view === 'browse' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Browse
                  </button>
                  <button
                    onClick={() => setView('companion-setup')}
                    className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                      view === 'companion-setup' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    My Profile
                  </button>
                </>
              )}
              {userType === 'client' && isLoggedIn && view !== 'chat' && (
                <button
                  onClick={() => setView('browse')}
                  className="px-4 py-2 rounded-lg font-medium bg-purple-500 text-white hover:bg-purple-600 transition"
                >
                  Browse Companions
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {view === 'client-login' && (
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {authForm.isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-gray-600 mb-8">
              {authForm.isSignUp ? 'Sign up to start browsing' : 'Log in to your account'}
            </p>

            <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
              {authForm.isSignUp && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={authForm.name}
                    onChange={(e) => setAuthForm({...authForm, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={authForm.email}
                    onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={authForm.password}
                    onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition"
              >
                {authForm.isSignUp ? 'Sign Up' : 'Log In'}
              </button>

              <div className="text-center">
                <button
                  onClick={() => setAuthForm({...authForm, isSignUp: !authForm.isSignUp})}
                  className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                >
                  {authForm.isSignUp ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
                </button>
              </div>
            </div>
          </div>
        )}

        {view === 'companion-setup' && (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Your Companion Profile</h2>
            <p className="text-gray-600 mb-8">Set up your profile with photos, videos, and availability!</p>

            <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Your age"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price per Hour (₹)</label>
                  <input
                    type="number"
                    value={formData.pricePerHour}
                    onChange={(e) => setFormData({...formData, pricePerHour: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Downtown"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">About You</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows="4"
                  placeholder="Tell people about yourself..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Activities You Offer</label>
                <div className="flex flex-wrap gap-3">
                  {activityOptions.map(activity => (
                    <button
                      key={activity}
                      type="button"
                      onClick={() => toggleActivity(activity)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                        formData.activities.includes(activity)
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {activityIcons[activity]}
                      {activity}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">Photos & Videos</label>
                  <button
                    onClick={() => setShowMediaUpload(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Media
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {formData.media.map(item => (
                    <div key={item.id} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      {item.type === 'video' ? (
                        <video 
                          src={item.url} 
                          className="w-full h-full object-cover"
                          controls
                        />
                      ) : (
                        <img 
                          src={item.url} 
                          alt={item.caption}
                          className="w-full h-full object-cover"
                        />
                      )}
                      {item.duration && (
                        <span className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                          {item.duration}
                        </span>
                      )}
                      <button
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          media: prev.media.filter(m => m.id !== item.id)
                        }))}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {formData.media.length === 0 && (
                    <div className="col-span-4 text-center py-8 text-gray-400">
                      <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No media uploaded yet</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Set Your Availability</label>
                <div className="space-y-3">
                  {daysOfWeek.map(day => (
                    <div key={day} className="bg-gray-50 p-4 rounded-lg">
                      <div className="font-medium text-gray-800 mb-2 capitalize">{day}</div>
                      <div className="flex flex-wrap gap-2">
                        {timeSlots.map(slot => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => toggleAvailability(day, slot)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                              formData.availability[day].includes(slot)
                                ? 'bg-green-500 text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleCompanionSubmit}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition"
              >
                Create Profile
              </button>
            </div>

            {showMediaUpload && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl p-6 max-w-md w-full">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Upload Media</h3>
                    <button onClick={() => setShowMediaUpload(false)} className="text-gray-500 hover:text-gray-700">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <button
                      onClick={() => handleMediaUpload('image')}
                      className="w-full flex items-center justify-center gap-3 p-4 border-2 border-purple-300 rounded-lg hover:bg-purple-50 transition"
                    >
                      <Camera className="w-6 h-6 text-purple-600" />
                      <span className="font-medium text-gray-800">Upload Photo</span>
                    </button>
                    <button
                      onClick={() => handleMediaUpload('video')}
                      className="w-full flex items-center justify-center gap-3 p-4 border-2 border-pink-300 rounded-lg hover:bg-pink-50 transition"
                    >
                      <Video className="w-6 h-6 text-pink-600" />
                      <span className="font-medium text-gray-800">Upload Video (5-10s)</span>
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-4 text-center">
                    Upload photos (max 10MB) or videos (max 10 seconds, 10MB)
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {view === 'browse' && (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Find Your Perfect Companion</h2>
            <p className="text-gray-600 mb-8">Browse profiles, view media, FREE chat, and arrange meetings!</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companions.map(companion => (
                <div key={companion.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
                  <div className="bg-gradient-to-br from-pink-400 to-purple-400 h-40 flex items-center justify-center relative">
                    <span className="text-7xl">{companion.photo}</span>
                    {companion.verified && (
                      <div className="absolute top-3 right-3 bg-white rounded-full p-1.5">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{companion.name}</h3>
                        <p className="text-sm text-gray-500">{companion.age} years old</p>
                      </div>
                      <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-semibold text-gray-700">{companion.rating}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{companion.bio}</p>

                    <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{companion.location}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {companion.activities.slice(0, 3).map(activity => (
                        <span key={activity} className="flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
                          {activityIcons[activity]}
                          {activity}
                        </span>
                      ))}
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {companion.media.slice(0, 3).map(item => (
                        <div key={item.id} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition">
                          {item.type === 'video' ? (
                            <video 
                              src={item.url} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <img 
                              src={item.url} 
                              alt={item.caption}
                              className="w-full h-full object-cover"
                            />
                          )}
                          {item.duration && (
                            <span className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                              {item.duration}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-semibold text-green-900">Available Today</span>
                      </div>
                      <div className="text-xs text-green-700">
                        {Object.entries(companion.availability).find(([day]) => day === 'monday')?.[1]?.slice(0, 2).join(', ') || 'Check schedule'}
                      </div>
                    </div>

                    <button 
                      onClick={() => { setSelectedCompanion(companion); setShowReviews(true); }}
                      className="w-full text-purple-600 text-sm font-medium mb-3 hover:text-purple-700"
                    >
                      View {companion.reviews} Reviews
                    </button>

                    <div className="flex gap-2 mb-3">
                      <button 
                        onClick={() => openChat(companion)}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg font-medium hover:bg-blue-100 transition"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Chat FREE
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center gap-1">
                        <span className="text-2xl font-bold text-gray-800">₹{companion.pricePerHour}</span>
                        <span className="text-sm text-gray-500">/hr</span>
                      </div>
                      <button 
                        onClick={() => handleMeetRequest(companion)}
                        className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg font-medium hover:from-pink-600 hover:to-purple-600 transition"
                      >
                        Meet & Pay
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {showReviews && selectedCompanion && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-gray-800">Reviews for {selectedCompanion.name}</h3>
                    <button onClick={() => setShowReviews(false)} className="text-gray-500 hover:text-gray-700 text-2xl">
                      ✕
                    </button>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-800 mb-3">Write a Review</h4>
                    <div className="flex items-center gap-2 mb-3">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star
                          key={star}
                          className={`w-6 h-6 cursor-pointer ${star <= newReview.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                          onClick={() => setNewReview({...newReview, rating: star})}
                        />
                      ))}
                    </div>
                    <textarea
                      value={newReview.comment}
                      onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      rows="3"
                      placeholder="Share your experience..."
                    />
                    <button
                      onClick={() => submitReview(selectedCompanion)}
                      className="mt-2 bg-purple-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-600 transition"
                    >
                      Submit Review
                    </button>
                  </div>

                  <div className="space-y-4">
                    {selectedCompanion.reviewsList.map((review, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center text-purple-700 font-semibold">
                              {review.user[0]}
                            </div>
                            <span className="font-semibold text-gray-800">{review.user}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-1">{review.comment}</p>
                        <p className="text-xs text-gray-400">{review.date}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {view === 'chat' && activeChat && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setView('browse')} className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition">
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <span className="text-4xl">{activeChat.photo}</span>
                    <div>
                      <h3 className="text-white font-bold">{activeChat.name}</h3>
                      <p className="text-pink-100 text-sm">Online</p>
                    </div>
                  </div>
                  <div className="text-white text-right">
                    <p className="text-sm font-bold">FREE Chat</p>
                    <p className="text-xs">No charges!</p>
                  </div>
                </div>
              </div>

              <div className="h-96 overflow-y-auto p-4 bg-gray-50">
                {activeChat.chatHistory.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="font-semibold">Start your conversation!</p>
                      <p className="text-sm mt-1">Chat is completely FREE 🎉</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeChat.chatHistory.map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.sender === 'client' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs px-4 py-2 rounded-lg ${
                          msg.sender === 'client' 
                            ? 'bg-purple-500 text-white' 
                            : 'bg-white text-gray-800'
                        }`}>
                          <p>{msg.message}</p>
                          <p className={`text-xs mt-1 ${msg.sender === 'client' ? 'text-purple-200' : 'text-gray-500'}`}>
                            {msg.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-4 bg-white border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Type your message..."
                  />
                  <button 
                    onClick={sendMessage}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-lg font-medium hover:from-pink-600 hover:to-purple-600 transition flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'meet-request' && selectedCompanion && (
          <div className="max-w-2xl mx-auto">
            <button 
              onClick={() => setView('browse')}
              className="text-purple-600 hover:text-purple-700 mb-4 flex items-center gap-2"
            >
              ← Back to Browse
            </button>

            <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Request a Meeting</h2>

              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center gap-4">
                  <span className="text-5xl">{selectedCompanion.photo}</span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{selectedCompanion.name}</h3>
                    <p className="text-sm text-gray-600">{selectedCompanion.location}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-semibold">{selectedCompanion.rating}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Available Times This Week</h3>
                <div className="space-y-2">
                  {Object.entries(selectedCompanion.availability).slice(0, 3).map(([day, slots]) => (
                    slots.length > 0 && (
                      <div key={day} className="text-sm">
                        <span className="font-medium text-blue-900 capitalize">{day}: </span>
                        <span className="text-blue-700">{slots.join(', ')}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                  <input
                    type="date"
                    value={meetingDetails.date}
                    onChange={(e) => setMeetingDetails({...meetingDetails, date: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Time</label>
                  <input
                    type="time"
                    value={meetingDetails.time}
                    onChange={(e) => setMeetingDetails({...meetingDetails, time: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (Hours)</label>
                <input
                  type="number"
                  value={meetingDetails.hours}
                  onChange={(e) => setMeetingDetails({...meetingDetails, hours: parseInt(e.target.value) || 1})}
                  min="1"
                  max="8"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4 border-2 border-purple-300">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Rate per hour</span>
                  <span className="font-semibold text-gray-800">₹{selectedCompanion.pricePerHour}</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-semibold text-gray-800">{meetingDetails.hours} hour(s)</span>
                </div>
                <div className="border-t-2 border-purple-300 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">Total Amount</span>
                    <span className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                      ₹{totalAmount}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  How Payment Works
                </h3>
                <ul className="space-y-1 text-sm text-green-800">
                  <li>• Send meeting request with date & time</li>
                  <li>• Meet at agreed location</li>
                  <li>• Pay directly after meeting (Cash/UPI)</li>
                  <li>• Leave a review to help others</li>
                </ul>
              </div>

              <button 
                onClick={() => {
                  alert(`Meeting request sent to ${selectedCompanion.name}! They will confirm via chat.`);
                  setView('chat');
                  setActiveChat(selectedCompanion);
                }}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 rounded-lg font-bold text-lg hover:from-pink-600 hover:to-purple-600 transition"
              >
                Send Meeting Request
              </button>

              <p className="text-xs text-gray-500 text-center">
                Payment is made directly to companion after meeting. No advance payment required!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
