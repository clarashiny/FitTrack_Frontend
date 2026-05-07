import React from "react";
import { FaTrash } from "react-icons/fa";

const CommentCard = ({ comment, onDelete }) => {
  return (
    <div className="flex justify-between items-start bg-gray-100 p-2 rounded mb-2">
      <div>
        <p className="text-sm text-gray-800">
          <span className="font-semibold">{comment.user}:</span>{" "}
          {comment.text}
        </p>
      </div>

      {onDelete && (
        <FaTrash
          onClick={() => onDelete(comment.id)}
          className="text-red-500 cursor-pointer text-xs mt-1"
        />
      )}
    </div>
  );
};

export default CommentCard;
