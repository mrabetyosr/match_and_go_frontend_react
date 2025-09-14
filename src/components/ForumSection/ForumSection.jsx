import React from 'react';
import './ForumSection.css';
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
    <section className="top-posts-section">
      <div className="top-posts-container">
        <img src={assets.quote} alt="quote" className="top-posts-quote-image" />
        
        <header className="top-posts-header">
          <img 
            src={assets.matchgorforum} 
            alt="Match&Go Forum Logo" 
            className="top-posts-brand"
          />
          <h2 className="top-posts-title">Top Posts</h2>
        </header>

        {/* Flèches */}
        <button className="top-posts-scroll-btn left" onClick={scrollLeft}>‹</button>
        <button className="top-posts-scroll-btn right" onClick={scrollRight}>›</button>

        <div className="top-posts-wrapper" ref={containerRef}>
          <div className="top-posts-grid">
            {forumPosts.map((post) => (
              <article className="top-post-card" key={post.id}>
                <div className="top-post-user-info">
                  <img
                    src={post.userPhoto}
                    alt={`${post.firstName} ${post.lastName}`}
                    className="top-post-user-photo"
                  />
                  <div>
                    <h4 className="top-post-user-name">{post.firstName} {post.lastName}</h4>
                    <p className="top-post-user-role">{post.role}</p>
                  </div>
                </div>
                <p className="top-post-content">"{post.content}"</p>
                <div className="top-post-reactions">
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