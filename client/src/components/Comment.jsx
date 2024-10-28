import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Textarea } from 'flowbite-react';
import Cookies from 'js-cookie';
import Comment from './Comment'; // The existing Comment component
import { checkAuth } from '../utils/auth'; // Implied import for checkAuth function

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const isAuthenticated = checkAuth();
    if (!isAuthenticated) {
      console.log('User is not authenticated');
      // Handle unauthenticated state
    }
    console.log('Current user:', currentUser); // Log the current user
    console.log('Access token:', Cookies.get('access_token')); // Log the access token
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await fetch(`https://geomancy-blog.onrender.com/api/comment/getPostComments/${postId}`);
      const data = await res.json();
      
      if (res.ok) {
        setComments(data);
        setError(null);
      }
    } catch (error) {
      setError('Error fetching comments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get('access_token');
      console.log('Current token:', token); // Debug log

      if (!token) {
        console.log('No token found');
        setError('Please log in to comment');
        return;
      }

      // Log the request details
      const requestDetails = {
        url: 'https://geomancy-blog.onrender.com/api/comment/create',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: {
          content: commentContent,
          postId
        }
      };
      console.log('Request details:', requestDetails);

      const res = await fetch(requestDetails.url, {
        method: requestDetails.method,
        headers: requestDetails.headers,
        credentials: 'include',
        body: JSON.stringify(requestDetails.body)
      });

      console.log('Response status:', res.status);
      console.log('Response headers:', Object.fromEntries([...res.headers]));

      // Try to get response body regardless of status
      const data = await res.json().catch(e => ({
        error: 'Failed to parse response',
        details: e.message
      }));
      console.log('Response data:', data);

      if (!res.ok) {
        throw new Error(data.message || `Server returned ${res.status}`);
      }

      setComments([data, ...comments]);
      setCommentContent('');
      setError(null);
    } catch (error) {
      console.error('Full error details:', {
        message: error.message,
        stack: error.stack
      });
      setError(error.message || 'Something went wrong');
    }
  };

  const handleLike = async (commentId) => {
    try {
      const token = Cookies.get('access_token');
      
      if (!token) {
        setError('Please log in to like comments');
        return;
      }

      const res = await fetch(`https://geomancy-blog.onrender.com/api/comment/likeComment/${commentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      const data = await res.json();
      
      if (!res.ok) {
        setError(data.message || 'Failed to like comment');
        return;
      }

      setComments(comments.map(comment => 
        comment._id === commentId ? data : comment
      ));
      setError(null);
    } catch (error) {
      setError('Error liking comment');
    }
  };

  const handleEdit = async (commentId, newContent) => {
    try {
      const token = Cookies.get('access_token');
      
      if (!token) {
        setError('Please log in to edit comments');
        return;
      }

      const res = await fetch(`https://geomancy-blog.onrender.com/api/comment/editComment/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({ content: newContent }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        setError(data.message || 'Failed to edit comment');
        return;
      }

      setComments(comments.map(comment => 
        comment._id === commentId ? { ...comment, content: newContent } : comment
      ));
      setError(null);
    } catch (error) {
      setError('Error editing comment');
    }
  };

  const handleDelete = async (commentId) => {
    try {
      const token = Cookies.get('access_token');
      
      if (!token) {
        setError('Please log in to delete comments');
        return;
      }

      const res = await fetch(`https://geomancy-blog.onrender.com/api/comment/deleteComment/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Failed to delete comment');
        return;
      }

      setComments(comments.filter(comment => comment._id !== commentId));
      setError(null);
    } catch (error) {
      setError('Error deleting comment');
    }
  };

  return (
    <div className='max-w-2xl mx-auto w-full p-3'>
      {currentUser ? (
        <div className='flex flex-col gap-3'>
          <h3 className='text-sm font-semibold'>Write a comment</h3>
          <form onSubmit={handleSubmit} className='border-b border-gray-200 dark:border-gray-800 pb-4'>
            <Textarea
              placeholder='Add a comment...'
              rows={3}
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              required
            />
            {error && (
              <div className='text-red-500 text-sm mt-2'>
                {error}
              </div>
            )}
            <div className='flex justify-end mt-3'>
              <Button
                type='submit'
                gradientDuoTone='purpleToBlue'
                size='sm'
                disabled={!commentContent.trim()}
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div className='text-sm text-gray-500 dark:text-gray-400 mb-6'>
          Please sign in to comment
        </div>
      )}

      {loading ? (
        <div className='text-sm text-gray-500 dark:text-gray-400'>
          Loading comments...
        </div>
      ) : (
        <div className='flex flex-col gap-4 mt-8'>
          <h3 className='text-sm font-semibold'>
            {comments.length} Comment{comments.length !== 1 ? 's' : ''}
          </h3>
          {comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onLike={handleLike}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
