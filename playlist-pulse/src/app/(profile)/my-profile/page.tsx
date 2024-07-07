"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import TopBar from '@/app/components/TopBar';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import Link from 'next/link';
import AllPlaylists from '@/app/(playlists)/all-playlists/page';

const Profile: React.FC = () => {
  const { data: session, status } = useSession();
  const [playlists, setPlaylists] = useState<any[]>([]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (session?.accessToken) {
        try {
          const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          });
          const allPlaylists = response.data.items;
          const randomPlaylists = shuffleArray([...allPlaylists]).slice(0, 4);
          setPlaylists(randomPlaylists);
        } catch (error) {
          console.error('Error fetching playlists:', error);
        }
      }
    };

    fetchPlaylists();
  }, [session]);

  // Shuffle function
  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const user = {
    name: session?.user?.name,
    followers: 34554,
    profilePicture: session?.user?.image as string,
    bannerImage: '/images/banner-image.jpg',
  };

  const post = {
    userProfileImage: '/images/profile-picture.jpg',
    userName: 'John Smith',
    postTitle: 'My Recent Adventure',
    postTime: '2 hours ago',
    postContent: 'Had an amazing time hiking the trails at the national park. The views were breathtaking!',
    postImages: [
      '/images/playlist1.jpg',
      '/images/playlist3.jpg',
      '/images/playlist4.jpg',
    ],
  };

  const [postContent, setPostContent] = useState('');
  const [postImages, setPostImages] = useState<string[]>([]);

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Post content:', postContent);
    console.log('Post images:', postImages);
    setPostContent('');
    setPostImages([]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).map((file) =>
        URL.createObjectURL(file)
      );
      setPostImages((prevImages) => [...prevImages, ...filesArray]);

      filesArray.forEach((url) => URL.revokeObjectURL(url));
    }
  };

  return (
    <div>
      <TopBar />
      <div className="container mx-auto mt-24 p-4">
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="relative h-40 rounded-lg overflow-hidden mb-4">
            <Image src={user.bannerImage} alt="Banner" layout="fill" objectFit="cover" className="w-full h-full object-cover" />
          </div>
          <div className="relative flex items-center pb-2 bg-white rounded-lg">
            <div className="relative -mt-16">
              <Image src={user.profilePicture} alt="Profile Picture" width={120} height={120} className="rounded-full border-4 border-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-lg">{user.followers.toLocaleString()} followers</p>
            </div>
            <div className="ml-auto space-x-4 flex items-center">
              <button className="bg-brand text-white px-4 py-2 rounded-md">Connect</button>
              <button className="bg-customgray text-black px-4 py-2 rounded-md">Chat</button>
            </div>
          </div>
          <div className="flex space-x-4 mt-4">
            <button className="flex items-center space-x-2 bg-brand px-4 py-2 text-white rounded-md">
              <span>Share</span>
            </button>
            <Link href="/all-playlists" className="flex items-center space-x-2 bg-customgray text-black px-4 py-2 rounded-md">
              <span>Playlists</span>
            </Link>
            <button className="flex items-center space-x-2 bg-customgray text-black px-4 py-2 rounded-md">
              <span>Messages</span>
            </button>
            <button className="flex items-center space-x-2 bg-customgray text-black px-4 py-2 rounded-md">
              <span>Connections</span>
            </button>
          </div>
        </div>
        <div className="bg-white rounded-lg py-8 mb-8">
          <div className="grid grid-cols-3 grid-flow-row  ">
            <div className="bg-gray-200 p-6 rounded-lg mb-5">
              <h3 className="text-x font-bold mb-2">User Info</h3>
              <div className="space-y-2">
                <button className="bg-gray-300 p-2 rounded-md w-full text-center">Add bio</button>
                <button className="bg-gray-300 p-2 rounded-md w-full text-center">Edit Profile</button>
                <button className="bg-gray-300 p-2 rounded-md w-full text-center">Add interests</button>
              </div>
            </div>
            <div className="col-span-2 row-start-1 p-6 pb-0 pt-0 px-0 rounded-lg mr-5">
              <div className="bg-gray-200 p-4 rounded-lg shadow-md">
                <form onSubmit={handlePostSubmit}>
                  <div className="flex items-center mb-4">
                    <Image src={user.profilePicture} alt="User Profile" width={40} height={40} className="rounded-full" />
                    <input
                      type="text"
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      className="ml-4 w-full p-2 border border-gray-300 rounded-lg"
                      placeholder="Share your favourite Spotify playlist..."
                    />
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="file-input"
                    />
                    <label htmlFor="file-input" className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer">
                      Add Photos
                    </label>
                    <button type="submit" className="bg-brand text-white px-4 py-2 rounded-md">
                      Share
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {postImages.map((image, index) => (
                      <div key={index} className="relative w-full h-32 rounded-lg overflow-hidden">
                        <Image src={image} alt={`Post image ${index + 1}`} layout="fill" objectFit="cover" className="rounded-lg" />
                      </div>
                    ))}
                  </div>
                </form>
              </div>
            </div>
            <div className="bg-gray-300 p-6 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Shared Playlists</h3>
                <Link href="/all-playlists" className="text-blue-600 hover:underline">
                  View All
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {playlists.map((playlist) => (
                  <a key={playlist.id} href={playlist.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="relative group">
                    <div className="w-full h-32 rounded-lg overflow-hidden">
                      <Image src={playlist.images[0]?.url || '/default-playlist.png'} alt={playlist.name} layout="fill" objectFit="cover" className="rounded-lg" />
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                      <span className="text-white text-center">{playlist.name}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
            <div className="bg-gray-300 mx-0 p-6 rounded-lg row-start-2 col-span-2 mr-5">
              <div className="flex items-center mb-4">
                <Image src={post.userProfileImage} alt="User Profile" width={40} height={40} className="rounded-full" />
                <div className="ml-3">
                  <p className="font-bold">{post.userName}</p>
                  <p className="text-sm text-gray-600">{post.postTime}</p>
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2">{post.postTitle}</h3>
              <p className="text-gray-700 mb-4">{post.postContent}</p>
              <div className="grid grid-cols-3 gap-2">
                {post.postImages.map((image, index) => (
                  <div key={index} className="relative w-full h-32 rounded-lg overflow-hidden">
                    <Image src={image} alt={`Post image ${index + 1}`} layout="fill" objectFit="cover" className="rounded-lg" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
