import { useState, useEffect } from 'react';
import './profile.css';

const AVATARS = [
  'avatar1.png', 'avatar2.png', 'avatar3.png', 'avatar4.png',
  'avatar5.png', 'avatar6.png', 'avatar7.png', 'avatar8.png',
];

function Avatar({ currentUser }) {
  const [selectedAvatar, setSelectedAvatar] = useState(currentUser?.avatar || 'avatar8.png');
  const [showAvatarList, setShowAvatarList] = useState(false);

  // Fetch current avatar from server
  useEffect(() => {
    const fetchAvatar = async () => {
      if (!currentUser?._id) return;
      try {
        const res = await fetch(`http://localhost:4000/api/users/${currentUser._id}`);
        if (!res.ok) throw new Error('Failed to fetch user');
        const data = await res.json();
        setSelectedAvatar(data.avatar || 'avatar8.png');
      } catch (err) {
        console.error(err);
      }
    };
    fetchAvatar();
  }, [currentUser?._id]);

  // Update avatar to DB
  const handleAvatar = async (avatar) => {
    try {
      const response = await fetch(`http://localhost:4000/api/users/${currentUser._id}/avatar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar }),
      });
      if (response.ok) {
        setSelectedAvatar(avatar);
        setShowAvatarList(false);
        currentUser.avatar = avatar;
        alert('Avatar updated successfully!');
        console.log('Avatar updated:', avatar);
      } else {
        console.error('Failed to update avatar');
      }
    } catch (error) {
      console.error('Error updating avatar:', error);
    }
  };

  return (
    <div className='avatar-container'>
      <img
        src={`http://localhost:4000/avatars/${selectedAvatar}?t=${Date.now()}`}
        onClick={() => setShowAvatarList(!showAvatarList)}
        alt="User Avatar"
        className="avatar"
      />
      {showAvatarList && (
        <div className='avatar-selection'>
          <div className='avatars-map'>
            {AVATARS.map(avatar => (
              <img
                key={avatar}
                src={`http://localhost:4000/avatars/${avatar}`}
                alt={avatar}
                className="avatar-option"
                onClick={() => setSelectedAvatar(avatar)}
              />
            ))}
          </div>
          {selectedAvatar === 'avatar8.png' && <p>You're still a potato 🥔. Choose any avatar you like!</p>}
          <button 
            className="avatar-button"
            onClick={() => handleAvatar(selectedAvatar)}
          >
            Save selection
          </button>
        </div>
      )}
    </div>
  );
}

export default Avatar;
