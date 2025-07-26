import React from 'react';
import './ForumSection.css'; // Assuming you have a CSS file for styling
import { useRef } from 'react';

import { assets, forumPosts } from '../../assets/assets';

const ForumSection = () => {
  const containerRef = useRef(null);

  const scrollLeft = () => {
    containerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    containerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  return (
    <section className="forum-section">
      <div className="forum-container">
        <img src={assets.quote} alt="quote" className="quote-image" />
            <header className="forum-header">
        <img src={assets.matchgorforum} alt="Match&Go Forum Logo" className="forum-brand"
        />
        <h2 className="forum-section-title">Top Posts</h2>
      </header>


        {/* Flèches */}
        <button className="scroll-btn left" onClick={scrollLeft}>‹</button>
        <button className="scroll-btn right" onClick={scrollRight}>›</button>

        <div className="forum-posts-wrapper" ref={containerRef}>
          <div className="forum-posts-container">
            {forumPosts.map((post) => (
              <article className="forum-post-card" key={post.id}>
                <div className="forum-user-info">
                  <img
                    src={post.userPhoto}
                    alt={`${post.firstName} ${post.lastName}`}
                    className="forum-user-photo"
                  />
                  <div>
                    <h4 className="forum-user-name">{post.firstName} {post.lastName}</h4>
                    <p className="forum-user-role">{post.role}</p>
                  </div>
                </div>
                <p className="forum-post-content">"{post.content}"</p>
                <div className="forum-post-reactions">
                  <span>👍 {post.likes}</span>
                  <span>💬 {post.comments}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForumSection;