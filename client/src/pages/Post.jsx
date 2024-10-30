export default function Post() {
  // ... existing state and hooks

  return (
    <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
      <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>
        {post && post.title}
      </h1>
      {post && post.image && (
        <div className='max-w-3xl mx-auto w-full h-full'>
          <img
            src={post.image}
            alt={post.title}
            className='mt-10 p-3 max-h-[600px] w-full object-cover'
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/default-post-image.jpg';
            }}
          />
        </div>
      )}
      <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs'>
        {/* ... rest of the component */}
      </div>
      <div className='p-3 max-w-2xl mx-auto w-full post-content'>
        {post && (
          <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
        )}
      </div>
      {/* ... rest of the component */}
    </main>
  );
} 