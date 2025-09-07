import React, { useState } from "react";
import axios from "axios";

const UpdatePosts = ({ post, token, onUpdateSuccess, onCancel }) => {
  const [updatedContent, setUpdatedContent] = useState(post.content);
  const [updatedPhoto, setUpdatedPhoto] = useState(null);

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("content", updatedContent);
      if (updatedPhoto) {
        formData.append("photo", updatedPhoto);
      }

      const { data } = await axios.put(
        `http://localhost:7001/api/users/post/update/${post._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // pass updated post back to parent
      onUpdateSuccess({
        ...post,
        content: updatedContent,
        photo: updatedPhoto
          ? URL.createObjectURL(updatedPhoto)
          : post.photo,
      });
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div>
      <textarea
        value={updatedContent}
        onChange={(e) => setUpdatedContent(e.target.value)}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setUpdatedPhoto(e.target.files[0])}
      />
      <button onClick={handleUpdate}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default UpdatePosts;
