import React from 'react';
import './ParagraphBlogPosts.css';

const ParagraphBlogPosts = ({ title, posts }) => {
  return (
    <div className="blog-posts">
      <div className="blog-posts-header">
        <h2 className="blog-posts-title">{title || 'READ BLOG POSTS'}</h2>
        <a href="/blog" className="view-all-link">VIEW ALL</a>
      </div>
      
      {posts && posts.length > 0 ? (
        <div className="posts-container">
          {posts.map((post, index) => (
            <div key={post.id || index} className="post-item">
              {post.image && post.image.mediaImage && (
                <div className="post-image">
                  <img 
                    src={post.image.mediaImage.variations?.[0]?.url || post.image.mediaImage.url} 
                    alt={post.image.mediaImage.alt || post.title} 
                  />
                </div>
              )}
              <div className="post-meta">
                <span className="post-category">FASHION</span>
                <span className="post-date">/ JUL 11, 2022</span>
              </div>
              <h3 className="post-title">{post.title}</h3>
              <p className="post-excerpt">
                Turpis purus, gravida orci, fringilla dignissim lacus, turpis ut suspendisse vel tellus...
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No blog posts available</p>
      )}
    </div>
  );
};

export default ParagraphBlogPosts; 