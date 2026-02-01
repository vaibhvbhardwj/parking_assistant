const AVATAR_COLORS = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8",
  "#F7DC6F", "#BB8FCE", "#85C1E2", "#F8B739", "#52B788"
];

export default function ProfileAvatar({ name, size = 40 }) {
  const getInitials = (fullName) => {
    if (!fullName) return "U";
    return fullName
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (fullName) => {
    if (!fullName) return AVATAR_COLORS[0];
    const index = fullName.charCodeAt(0) % AVATAR_COLORS.length;
    return AVATAR_COLORS[index];
  };

  const avatarStyle = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    backgroundColor: getAvatarColor(name),
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    fontSize: `${size * 0.4}px`,
    flexShrink: 0
  };

  return (
    <div style={avatarStyle}>
      {getInitials(name)}
    </div>
  );
}