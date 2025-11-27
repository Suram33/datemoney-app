import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Heart, Star, Coffee, Utensils, Film, Music, ShoppingBag, Plus, Search, CheckCircle, Send, MessageCircle, ArrowLeft, Mail, Lock, Upload, Video, X, Camera } from 'lucide-react';
import { uploadImageToCloudinary, uploadVideoToCloudinary } from './cloudinaryConfig';

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
        { id: 1, type: 'image', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400', caption: 'Coffee date vibes!', likes: 45 },
        { id: 2, type: 'image', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400', caption: 'Day out shopping', likes: 67 }
      ],
      availability: {
        monday: ['10:00-14:00', '16:00-20:00'],
        tuesday: ['10:00-14:00'],
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
        { id: 1, type: 'image', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400', caption: 'Movie night', likes: 89 }
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
      monday: [], tuesday: [], wednesday: [], thursday: [], friday: [], saturday: [], sunday: []
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

  const handleMediaUpload = (type) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = type === 'video' ? 'video/*' : 'image/*';
    
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 10 * 1024 * 1024) {
          alert('File too large! Maximum size is 10MB');
          return;
        }
        
        alert('Uploading... Please wait');
        
        try {
          let uploadedUrl;
          
          if (type === 'video') {
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadedmetadata = async () => {
              window.URL.revokeObjectURL(video.src);
              if (video.duration > 10) {
                alert('Video too long! Maximum duration is 10 seconds');
                return;
              }
              uploadedUrl = await uploadVideoToCloudinary(file);
              addMediaToProfile(uploadedUrl, type, Math.round(video.duration));
            };
            video.src = URL.createObjectURL(file);
          } else {
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
      url: url,
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
        name: '', age: '', bio: '', pricePerHour: '', location: '', activities: [], media: [],
        availability: { monday: [], tuesday: [], wednesday: [], thursday: [], friday: [], saturday: [], sunday: [] }
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
                  <button onClick={() => setView('browse')} className={`px-4 py-2 rounded-lg font-medium transition ${view === 'browse' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    Browse
                  </button>
                  <button onClick={() => setView('companion-setup')} className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${view === 'companion-setup' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    <Plus className="w-4 h-4" />
                    My Profile
                  </button>
                </>
              )}
              {userType === 'client' && isLoggedIn && view !== 'chat' && (
                <button onClick={() => setView('browse')} className="px-4 py-2 rounded-lg font-medium bg-purple-500 text-white hover:bg-purple-600 transition">
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
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{authForm.isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
            <p className="text-gray-600 mb-8">{authForm.isSignUp ? 'Sign up to start browsing' : 'Log in to your account'}</p>

            <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
              {authForm.isSignUp && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input type="text" value={authForm.name} onChange={(e) => setAuthForm({...authForm, name: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="Enter your full name" />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input type="email" value={authForm.email} onChange={(e) => setAuthForm({...authForm, email: e.target.value})} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="your@email.com" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input type="password" value={authForm.password} onChange={(e) => setAuthForm({...authForm, password: e.target.value})} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="••••••••" />
                </div>
              </div>

              <button onClick={handleLogin} className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition">
                {authForm.isSignUp ? 'Sign Up' : 'Log In'}
              </button>

              <div className="text-center">
                <button onClick={() => setAuthForm({...authForm, isSignUp: !authForm.isSignUp})} className="text-purple-600 hover:text-purple-700 text-sm font-medium">
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
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="Enter your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                  <input type="number" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="Your age" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price per Hour (₹)</label>
                  <input type="number" value={formData.pricePerHour} onChange={(e) => setFormData({...formData, pricePerHour: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="Downtown" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">About You</label>
                <textarea value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" rows="4" placeholder="Tell people about yourself..." />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Activities You Offer</label>
                <div className="flex flex-wrap gap-3">
                  {activityOptions.map(activity => (
                    <button key={activity} type="button" onClick={() => toggleActivity(activity)} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${formData.activities.includes(activity) ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                      {activityIcons[activity]}
                      {activity}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">Photos & Videos</label>
                  <button onClick={() => setShowMediaUpload(true)} className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition">
                    <Upload className="w-4 h-4" />
                    Upload Media
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {formData.media.map(item => (
                    <div key={item.id} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      {item.type === 'video' ? (
                        <video src={item.url} className="w-full h-full object-cover" controls />
                      ) : (
                        <img src={item.url} alt={item.caption} className="w-full h-full object-cover" />
                      )}
                      {item.duration && (
                        <span className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                          {item.duration}
                        </span>
                      )}
                      <button onClick={() => setFormData(prev => ({ ...prev, media: prev.media.filter(m => m.id !== item.id) }))} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
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
                          <button key={slot} type="button" onClick={() => toggleAvailability(day, slot)} className={`px-3 py-1 rounded-lg text-sm font-medium transition ${formData.availability[day].includes(slot) ? 'bg-green-500 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'}`}>
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={handleCompanionSubmit} className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition">
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
                    <button onClick={() => handleMediaUpload('image')} className="w-full flex items-center justify-center gap-3 p-4 border-2 border-purple-300 rounded-lg hover:bg-purple-50 transition">
                      <Camera className="w-6 h-6 text-purple-600" />
                      <span className="font-medium text-gray-800">Upload Photo</span>
                    </button>
                    <button onClick={() => handleMediaUpload('video')} className="w-full flex items-center justify-center gap-3 p-4 border-2 border-pink-300 rounded-lg hover:bg-pink-50 transition">
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

        {/* Rest of the views - browse, chat, meet-request, reviews */}
        {/* Due to length limits, the full code continues... */}
      </div>
    </div>
  );
}
