import React from 'react';

const ParagraphBlogPosts = ({ posts }) => {
  return (
    <div className="blog-posts">
      <h2>Blog Posts</h2>
      {posts && posts.length > 0 ? (
        <div className="posts-container">
          {posts.map((post) => (
            <div key={post.id} className="post-item">
              {/* Render post content here */}
              <p>Post ID: {post.id}</p>
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