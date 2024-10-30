export const getProfileImage = (profilePicture) => {
  const defaultImage = '/default-profile.jpg';
  
  if (!profilePicture) return defaultImage;
  
  const img = new Image();
  img.src = profilePicture;
  
  return new Promise((resolve) => {
    img.onload = () => resolve(profilePicture);
    img.onerror = () => resolve(defaultImage);
  });
}; 