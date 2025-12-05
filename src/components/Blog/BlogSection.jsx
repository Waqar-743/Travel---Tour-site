import blogPosts from '../../data/blog';
import './Blog.css';

const BlogSection = () => {
  return (
    <section id="blog" className="blog section">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">Travel Tips</span>
          <h2 className="section-title">From Our Blog</h2>
          <div className="divider"></div>
          <p className="section-description">
            Insights, tips, and stories to help you prepare for your 
            Gilgit Baltistan adventure.
          </p>
        </div>

        <div className="blog-grid">
          {blogPosts.map((post, index) => (
            <article 
              key={post.id} 
              className="blog-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="blog-image">
                <img src={post.image} alt={post.title} loading="lazy" />
                <span className="blog-category">{post.category}</span>
              </div>
              
              <div className="blog-content">
                <div className="blog-meta">
                  <span className="blog-date">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    {post.date}
                  </span>
                  <span className="blog-read-time">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    {post.readTime}
                  </span>
                </div>
                
                <h3 className="blog-title">{post.title}</h3>
                <p className="blog-excerpt">{post.excerpt}</p>
                
                <button className="blog-link">
                  Read More
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
