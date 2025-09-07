import React from 'react'
import ForumAdd from '../../components/ForumAdd/ForumAdd';
import ForumPost from '../../components/ForumPost/ForumPost';
import './Forum.css';

const Forum = () => {
  return (
    <div>
       <ForumAdd></ForumAdd>
       <ForumPost></ForumPost>
    </div>
  )
}

export default Forum