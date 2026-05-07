import React from "react";
import { FaHeart } from "react-icons/fa";

const LikeButton = ({ likes, onLike }) => {
  return (
    <div className="flex items-center gap-2">
      <FaHeart
        onClick={onLike}
        className="cursor-pointer text-red-500 hover:scale-110 transition"
      />
      <span className="text-sm text-gray-700">{likes} Likes</span>
    </div>
  );
};

export default LikeButton;
