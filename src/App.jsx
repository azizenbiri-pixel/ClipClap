import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Share2, 
  Plus, 
  Music, 
  User, 
  Home, 
  Grid, 
  ArrowLeft,
  X,
  Send,
  Edit3,
  Check,
  Compass,
  Bell
} from 'lucide-react';

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
    comments: [
      { id: 1, user: "Sophie_Dev", text: "Superbe ambiance !", time: "2h" }
    ]
  },
  {
    id: 2,
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    user: "lucie_travel",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop",
    description: "Une vue magnifique 🌄 #travel #clipclap",
    song: "Chill Vibes - Lucie",
    likes: 8500,
    isLiked: false,
    saves: 450,
    isSaved: false,
    isFollowing: false,
    comments: []
  }
];

export default function ClipClapApp() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentPage, setCurrentPage] = useState('profile'); // 'feed' | 'profile' | 'home'
  const [activeTab, setActiveTab] = useState('Videos'); // 'Videos' | 'Likes' | 'Saved'
  
  const [videos, setVideos] = useState(INITIAL_VIDEOS);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  
  const [showComments, setShowComments] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");

  const [userProfile, setUserProfile] = useState({
    name: "AlexCreations",
    username: "AlexCreations",
    bio: "Storyteller & Filmmaker. Let's create ripples. 🎬✨",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop",
    followers: "50.1k",
    likes: "1.2M",
    following: "300"
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const touchStartY = useRef(0);
  const touchStartX = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

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
    } else if (currentPage === 'feed' && !showComments) {
      if (deltaY > 50 && currentVideoIndex < videos.length - 1) {
        setCurrentVideoIndex(prev => prev + 1);
      } else if (deltaY < -50 && currentVideoIndex > 0) {
        setCurrentVideoIndex(prev => prev - 1);
      }
    }
  };

  const toggleLike = () => {
    setVideos(prev => prev.map((v, idx) => 
      idx === currentVideoIndex ? { ...v, isLiked: !v.isLiked, likes: v.isLiked ? v.likes - 1 : v.likes + 1 } : v
    ));
  };

  const toggleSave = () => {
    setVideos(prev => prev.map((v, idx) => 
      idx === currentVideoIndex ? { ...v, isSaved: !v.isSaved, saves: v.isSaved ? v.saves - 1 : v.saves + 1 } : v
    ));
  };

  const toggleFollow = () => {
    setVideos(prev => prev.map((v, idx) => 
      idx === currentVideoIndex ? { ...v, isFollowing: !v.isFollowing } : v
    ));
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    const newComment = { id: Date.now(), user: userProfile.username, text: newCommentText, time: "À l'instant" };
    setVideos(prev => prev.map((v, idx) => 
      idx === currentVideoIndex ? { ...v, comments: [newComment, ...v.comments] } : v
    ));
    setNewCommentText("");
  };

  // -------------------------------------------------------------
  // SPLASH SCREEN
  // -------------------------------------------------------------
  if (showSplash) {
    return (
      <div 
        onClick={() => setShowSplash(false)}
        className="flex flex-col items-center justify-between h-screen w-full bg-[#0a0a1a] text-white p-8 select-none relative overflow-hidden cursor-pointer"
      >
        <div className="flex-1 flex flex-col items-center justify-center text-center z-10">
          <div className="relative mb-8">
            <div className="w-32 h-32 rounded-3xl border-2 border-pink-500/50 bg-gradient-to-tr from-purple-900/40 to-pink-900/40 backdrop-blur-md flex items-center justify-center shadow-[0_0_50px_rgba(236,72,153,0.5)]">
              <div className="relative text-pink-400">
                <span className="text-6xl">🎬</span>
                <span className="absolute -bottom-2 -left-3 text-2xl bg-pink-500 text-black p-1 rounded-full shadow-lg">🎵</span>
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]">
            ClipClap
          </h1>
          <p className="text-[11px] uppercase tracking-[0.2em] text-purple-300 mt-3 font-bold">
            SHORT VIDEO SOCIAL NETWORK
          </p>
          <p className="text-xs text-gray-400 mt-2 font-light italic">
            Connecting Stories, Creating Ripples
          </p>
        </div>

        <div className="w-56 h-1.5 bg-gray-800/80 rounded-full overflow-hidden mb-12 shadow-[0_0_15px_rgba(168,85,247,0.3)] z-10">
          <div className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 animate-[pulse_1.5s_infinite] rounded-full w-full"></div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // APPLICATION MAIN
  // -------------------------------------------------------------
  return (
    <div 
      className="relative w-full h-screen bg-[#0a0a1a] text-white overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ----------------- FEED VIDÉO ----------------- */}
      {currentPage === 'feed' && (
        <div className="relative h-full w-full bg-black">
          <video
            key={currentVideo.id}
            className="w-full h-full object-cover"
            src={currentVideo.url}
            autoPlay
            loop
            muted
            playsInline
          />

          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70 pointer-events-none" />

          <div className="absolute top-4 left-0 right-0 flex justify-center items-center gap-6 text-sm font-semibold z-10">
            <span className="text-gray-400 cursor-pointer" onClick={() => setShowSplash(true)}>Accueil</span>
            <span className="text-white border-b-2 border-white pb-1">Pour toi</span>
          </div>

          <div className="absolute right-3 bottom-20 flex flex-col items-center gap-5 z-20">
            <div className="relative mb-2">
              <img src={currentVideo.avatar} alt="Avatar" className="w-12 h-12 rounded-full border-2 border-pink-500 object-cover" />
              {!currentVideo.isFollowing && (
                <button onClick={toggleFollow} className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-pink-500 text-white rounded-full p-0.5">
                  <Plus size={14} />
                </button>
              )}
            </div>

            <button onClick={toggleLike} className="flex flex-col items-center">
              <div className="p-2 rounded-full bg-black/30 backdrop-blur-sm">
                <Heart size={30} className={currentVideo.isLiked ? "fill-pink-500 text-pink-500" : "text-white"} />
              </div>
              <span className="text-xs font-semibold mt-1">{(currentVideo.likes / 1000000).toFixed(1)}M</span>
            </button>

            <button onClick={() => setShowComments(true)} className="flex flex-col items-center">
              <div className="p-2 rounded-full bg-black/30 backdrop-blur-sm">
                <MessageCircle size={30} className="text-white" />
              </div>
              <span className="text-xs font-semibold mt-1">{currentVideo.comments.length}</span>
            </button>

            <button onClick={toggleSave} className="flex flex-col items-center">
              <div className="p-2 rounded-full bg-black/30 backdrop-blur-sm">
                <Bookmark size={30} className={currentVideo.isSaved ? "fill-yellow-400 text-yellow-400" : "text-white"} />
              </div>
              <span className="text-xs font-semibold mt-1">{currentVideo.saves}</span>
            </button>

            <button onClick={() => alert("Lien copié !")} className="flex flex-col items-center">
              <div className="p-2 rounded-full bg-black/30 backdrop-blur-sm">
                <Share2 size={30} className="text-white" />
              </div>
              <span className="text-xs font-semibold mt-1">Partager</span>
            </button>
          </div>

          <div className="absolute left-4 bottom-20 right-20 z-10 flex flex-col gap-2">
            <h3 className="font-bold text-base cursor-pointer hover:underline" onClick={() => setCurrentPage('profile')}>
              @{currentVideo.user}
            </h3>
            <p className="text-sm text-gray-200 line-clamp-2">{currentVideo.description}</p>
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <Music size={14} className="animate-spin" />
              <span>{currentVideo.song}</span>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- PAGE PROFIL STYLISÉE NÉON ----------------- */}
      {currentPage === 'profile' && (
        <div className="h-full w-full bg-[#0d0926] text-white flex flex-col overflow-y-auto pb-20 relative">
          {/* Arrière-plan néon dégradé */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-20 right-0 w-60 h-60 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />

          {/* Header Profil */}
          <div className="pt-6 pb-2 text-center relative z-10">
            <h1 className="text-xl font-bold tracking-wide">ClipClap</h1>
          </div>

          {/* Section Utilisateur */}
          <div className="flex flex-col items-center px-6 pt-2 z-10">
            {/* Avatar avec cercle lumineux rose néon */}
            <div className="relative mb-3">
              <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 shadow-[0_0_25px_rgba(236,72,153,0.7)] flex items-center justify-center">
                <img 
                  src={userProfile.avatar} 
                  alt="Avatar"
                  className="w-full h-full rounded-full object-cover border-2 border-[#0d0926]"
                />
              </div>
            </div>

            {/* Pseudo & Bio */}
            {isEditingProfile ? (
              <div className="flex flex-col gap-2 w-full max-w-xs text-center my-2">
                <input 
                  type="text" 
                  value={userProfile.username} 
                  onChange={(e) => setUserProfile({...userProfile, username: e.target.value})}
                  className="bg-purple-900/40 border border-purple-500/40 px-3 py-1 rounded-full text-center text-sm text-white"
                />
                <textarea 
                  value={userProfile.bio} 
                  onChange={(e) => setUserProfile({...userProfile, bio: e.target.value})}
                  className="bg-purple-900/40 border border-purple-500/40 px-3 py-1 rounded-xl text-center text-xs text-gray-300 resize-none"
                />
              </div>
            ) : (
              <>
                <h2 className="text-base font-bold tracking-wide">@{userProfile.username}</h2>
                <p className="text-xs text-gray-300 mt-1.5 text-center font-light">
                  {userProfile.bio}
                </p>
              </>
            )}

            {/* Stats format image (50.1k Followers | 1.2M Likes | 300 Following) */}
            <div className="flex items-center gap-2 my-4 text-xs font-semibold text-gray-200">
              <span><strong className="text-white">{userProfile.followers}</strong> Followers</span>
              <span className="text-purple-400">|</span>
              <span><strong className="text-white">{userProfile.likes}</strong> Likes</span>
              <span className="text-purple-400">|</span>
              <span><strong className="text-white">{userProfile.following}</strong> Following</span>
            </div>

            {/* Bouton Edit Profile */}
            <button 
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white text-xs font-bold px-8 py-2.5 rounded-full shadow-lg shadow-purple-900/40 border border-purple-400/30 transition-all active:scale-95"
            >
              {isEditingProfile ? "Save Profile" : "Edit Profile"}
            </button>
          </div>

          {/* Onglets (Videos / Likes / Saved) */}
          <div className="flex justify-around border-b border-purple-900/40 mt-6 z-10 text-sm font-semibold">
            {['Videos', 'Likes', 'Saved'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 px-4 relative transition-colors ${
                  activeTab === tab ? 'text-white' : 'text-gray-400'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 shadow-[0_0_8px_rgba(236,72,153,0.8)]" />
                )}
              </button>
            ))}
          </div>

          {/* Grille des vidéos avec badges de vues */}
          <div className="p-3 grid grid-cols-3 gap-2.5 z-10">
            {[
              { id: 1, views: "12.5k views", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&auto=format&fit=crop" },
              { id: 2, views: "8.9k views", img: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=300&auto=format&fit=crop" },
              { id: 3, views: "15.2k views", img: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=300&auto=format&fit=crop" },
              { id: 4, views: "19.2k views", img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&auto=format&fit=crop" },
              { id: 5, views: "8.2k views", img: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&auto=format&fit=crop" },
              { id: 6, views: "15.2k views", img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&auto=format&fit=crop" }
            ].map((item) => (
              <div 
                key={item.id} 
                className="aspect-[3/4] rounded-xl overflow-hidden relative border border-purple-500/20 shadow-md group cursor-pointer"
                onClick={() => setCurrentPage('feed')}
              >
                <img 
                  src={item.img} 
                  alt="Thumbnail" 
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                {/* Badge de vues violet néon */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-purple-950/80 backdrop-blur-md border border-purple-500/40 text-purple-200 text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-md whitespace-nowrap">
                  {item.views}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------- BARRE DE NAVIGATION INFÉRIEURE (5 ICONES) ----------------- */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#09061a]/95 backdrop-blur-md border-t border-purple-900/30 flex justify-around items-center z-30 px-2">
        {/* Home */}
        <button 
          onClick={() => setCurrentPage('feed')} 
          className={`flex flex-col items-center ${currentPage === 'feed' ? 'text-purple-400' : 'text-gray-400'}`}
        >
          <Home size={20} />
          <span className="text-[10px] mt-1 font-medium">Home</span>
        </button>

        {/* Discover */}
        <button 
          onClick={() => setCurrentPage('feed')} 
          className="flex flex-col items-center text-gray-400"
        >
          <Compass size={20} />
          <span className="text-[10px] mt-1 font-medium">Discover</span>
        </button>

        {/* Create (+) */}
        <button className="flex flex-col items-center">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center shadow-[0_0_12px_rgba(236,72,153,0.6)]">
            <Plus size={22} className="text-white" />
          </div>
          <span className="text-[10px] mt-0.5 font-medium text-gray-400">Create</span>
        </button>

        {/* Notifications */}
        <button className="flex flex-col items-center text-gray-400">
          <Bell size={20} />
          <span className="text-[10px] mt-1 font-medium">Notifications</span>
        </button>

        {/* Profile */}
        <button 
          onClick={() => setCurrentPage('profile')} 
          className={`flex flex-col items-center ${currentPage === 'profile' ? 'text-pink-400' : 'text-gray-400'}`}
        >
          <User size={20} />
          <span className="text-[10px] mt-1 font-medium">Profile</span>
        </button>
      </div>
    </div>
  );
}
