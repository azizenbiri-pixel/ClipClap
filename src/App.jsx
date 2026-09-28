import React, { useState, useEffect, useRef } from 'react';
import {
  Heart, MessageCircle, Bookmark, Share2, Plus, Music,
  User, Home, Compass, Bell
} from 'lucide-react';
import { supabase } from './supabase';

const INITIAL_VIDEOS = [
  {
    id: 1,
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    user: "AlexCreations",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop",
    description: "Storyteller & Filmmaker. Let's create ripples. ✨🎬",
    song: "Son original - AlexCreations",
    likes: 1200000,
    isLiked: false,
    saves: 1200,
    isSaved: false,
    isFollowing: false,
    comments: [{ id: 1, user: "Sophie_Dev", text: "Superbe ambiance!", time: "2h" }]
  }
];

export default function ClipClapApp() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentPage, setCurrentPage] = useState('profile');
  const [activeTab, setActiveTab] = useState('Videos');
  const [videos, setVideos] = useState(INITIAL_VIDEOS);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");
  const [userProfile, setUserProfile] = useState({
    name: "AlexCreations", username: "AlexCreations",
    bio: "Storyteller & Filmmaker. Let's create ripples. 🎬✨",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop",
    followers: "50.1k", likes: "1.2M", following: "300"
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // --- 1. CHARGER LES VIDEOS DEPUIS SUPABASE ---
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    fetchClips();
    return () => clearTimeout(timer);
  }, []);

  const fetchClips = async () => {
    const { data, error } = await supabase.from('clips').select('*').order('created_at', { ascending: false });
    if (!error && data && data.length > 0) {
      const mapped = data.map(c => ({
        id: c.id,
        url: c.video_url || c.url,
        user: c.user_name || c.user || "AlexCreations",
        avatar: c.avatar_url || c.avatar || userProfile.avatar,
        description: c.description || "",
        song: c.song || "Son original",
        likes: c.likes || 0,
        isLiked: false,
        saves: c.saves || 0,
        isSaved: false,
        isFollowing: false,
        comments: []
      }));
      setVideos(mapped);
    }
  };
 // --- 2. AJOUTER UNE VIDEO DANS SUPABASE ---
  const handleCreateClip = async () => {
    const url = prompt("Colle l'URL de ta vidéo MP4 :");
    if (!url) return;
    const desc = prompt("Description?") || "Ma nouvelle vidéo #clipclap";

    const { data, error } = await supabase.from('clips').insert([{
      video_url: url,
      user_name: userProfile.username,
      avatar_url: userProfile.avatar,
      description: desc,
      song: "Son original - " + userProfile.username
    }]).select();

    if (error) {
      alert("Erreur Supabase : " + error.message);
      console.log(error);
    } else {
      alert("Vidéo enregistrée dans Supabase!");
      fetchClips();
      setCurrentPage('feed');
    }
  };

  const touchStartY = useRef(0);
  const touchStartX = useRef(0);
  const currentVideo = videos[currentVideoIndex];

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchStartY.current = e.targetTouches[0].clientY;
  };
  const handleTouchEnd = (e) => {
    const deltaX = touchStartX.current - e.changedTouches[0].clientX;
    const deltaY = touchStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 70 && currentPage === 'feed') setCurrentPage('profile');
      if (deltaX < -70 && currentPage === 'profile') setCurrentPage('feed');
    } else if (currentPage === 'feed' &&!showComments) {
      if (deltaY > 50 && currentVideoIndex < videos.length - 1) setCurrentVideoIndex(p => p + 1);
      else if (deltaY < -50 && currentVideoIndex > 0) setCurrentVideoIndex(p => p - 1);
    }
  };

  const toggleLike = () => setVideos(p => p.map((v, idx) => idx === currentVideoIndex? {...v, isLiked:!v.isLiked, likes: v.isLiked? v.likes - 1 : v.likes + 1 } : v));
  const toggleSave = () => setVideos(p => p.map((v, idx) => idx === currentVideoIndex? {...v, isSaved:!v.isSaved, saves: v.isSaved? v.saves - 1 : v.saves + 1 } : v));
  const toggleFollow = () => setVideos(p => p.map((v, idx) => idx === currentVideoIndex? {...v, isFollowing:!v.isFollowing } : v));
  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    const newComment = { id: Date.now(), user: userProfile.username, text: newCommentText, time: "À l'instant" };
    setVideos(p => p.map((v, idx) => idx === currentVideoIndex? {...v, comments: [newComment,...v.comments] } : v));
    setNewCommentText("");
  };

  if (showSplash) {
    return (
      <div onClick={() => setShowSplash(false)} className="flex flex-col items-center justify-between h-screen w-full bg-[#0a0a1a] text-white p-8 select-none relative overflow-hidden cursor-pointer">
        <div className="flex-1 flex flex-col items-center justify-center text-center z-10">
          <div className="w-32 h-32 rounded-3xl border-2 border-pink-500/50 bg-gradient-to-tr from-purple-900/40 to-pink-900/40 backdrop-blur-md flex items-center justify-center shadow-[0_0_50px_rgba(236,72,153,0.5)] mb-8">
            <span className="text-6xl">🎬</span>
          </div>
          <h1 className="text-4xl font-extrabold">ClipClap</h1>
          <p className="text-[11px] uppercase tracking-[0.2em] text-purple-300 mt-3 font-bold">SHORT VIDEO SOCIAL NETWORK</p>
        </div>
        <div className="w-56 h-1.5 bg-gray-800/80 rounded-full overflow-hidden mb-12"><div className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 w-full"></div></div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-[#0a0a1a] text-white overflow-hidden select-none" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      {currentPage === 'feed' && currentVideo && (
        <div className="relative h-full w-full bg-black">
          <video key={currentVideo.id} className="w-full h-full object-cover" src={currentVideo.url} autoPlay loop muted playsInline />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70 pointer-events-none" />
          <div className="absolute right-3 bottom-20 flex flex-col items-center gap-5 z-20">
            <div className="relative mb-2"><img src={currentVideo.avatar} alt="Avatar" className="w-12 h-12 rounded-full border-2 border-pink-500" />{!currentVideo.isFollowing && (<button onClick={toggleFollow} className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-pink-500 rounded-full p-0.5"><Plus size={14} /></button>)}</div>
            <button onClick={toggleLike} className="flex flex-col items-center"><Heart size={30} className={currentVideo.isLiked? "fill-pink-500 text-pink-500" : "text-white"} /><span className="text-xs mt-1">{(currentVideo.likes/1000000).toFixed(1)}M</span></button>
            <button onClick={() => setShowComments(true)} className="flex flex-col items-center"><MessageCircle size={30} /><span className="text-xs mt-1">{currentVideo.comments.length}</span></button>
            <button onClick={toggleSave} className="flex flex-col items-center"><Bookmark size={30} className={currentVideo.isSaved? "fill-yellow-400 text-yellow-400" : "text-white"} /><span className="text-xs mt-1">{currentVideo.saves}</span></button>
            <button onClick={() => alert("Lien copié!")} className="flex flex-col items-center"><Share2 size={30} /><span className="text-xs mt-1">Partager</span></button>
          </div>
          <div className="absolute left-4 bottom-20 right-20 z-10"><h3 className="font-bold" onClick={() => setCurrentPage('profile')}>@{currentVideo.user}</h3><p className="text-sm text-gray-200 line-clamp-2">{currentVideo.description}</p><div className="flex items-center gap-2 text-xs text-gray-300"><Music size={14} /><span>{currentVideo.song}</span></div></div>
        </div>
      )}

      {currentPage === 'profile' && (
        <div className="h-full w-full bg-[#0d0926] flex flex-col overflow-y-auto pb-20">
          <div className="pt-6 text-center"><h1 className="text-xl font-bold">ClipClap</h1></div>
          <div className="flex flex-col items-center px-6 pt-2">
            <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-pink-500 to-purple-500 mb-3"><img src={userProfile.avatar} className="w-full h-full rounded-full object-cover border-2 border-[#0d0926]" alt="avatar"/></div>
            <h2 className="font-bold">@{userProfile.username}</h2><p className="text-xs text-gray-300 text-center">{userProfile.bio}</p>
            <div className="flex gap-2 my-4 text-xs"><span><strong>{userProfile.followers}</strong> Followers</span><span>|</span><span><strong>{userProfile.likes}</strong> Likes</span><span>|</span><span><strong>{userProfile.following}</strong> Following</span></div>
            <button onClick={() => setIsEditingProfile(!isEditingProfile)} className="bg-gradient-to-r from-purple-700 to-indigo-700 px-8 py-2.5 rounded-full text-xs font-bold">{isEditingProfile? "Save" : "Edit Profile"}</button>
          </div>
          <div className="p-3 grid grid-cols-3 gap-2.5">
            {videos.map((v) => (
              <div key={v.id} onClick={() => { setCurrentVideoIndex(videos.findIndex(x=>x.id===v.id)); setCurrentPage('feed'); }} className="aspect-[3/4] rounded-xl overflow-hidden relative border border-purple-500/20 cursor-pointer"><video src={v.url} className="w-full h-full object-cover" muted /><div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" /><div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-purple-950/80 text-[10px] px-2 py-0.5 rounded-full">{v.user}</div></div>
            ))}
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#09061a]/95 backdrop-blur-md border-t border-purple-900/30 flex justify-around items-center z-30">
        <button onClick={() => setCurrentPage('feed')} className={`${currentPage === 'feed'? 'text-purple-400' : 'text-gray-400'}`}><Home size={20} /></button>
        <button className="text-gray-400"><Compass size={20} /></button>
        <button onClick={handleCreateClip} className="w-9 h-9 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center"><Plus size={22} /></button>
        <button className="text-gray-400"><Bell size={20} /></button>
        <button onClick={() => setCurrentPage('profile')} className={`${currentPage === 'profile'? 'text-pink-400' : 'text-gray-400'}`}><User size={20} /></button>
      </div>
    </div>
  );
}
