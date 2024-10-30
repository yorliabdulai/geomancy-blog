import { Alert, Button, Modal, Textarea } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Comment from './Comment';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import Cookies from 'js-cookie';

export default function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState(null);
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 200) return;

    try {
      const token = Cookies.get('access_token');
      if (!token) {
        setCommentError('Please log in to comment');
        return;
      }

      const res = await fetch('https://geomancy-blog.onrender.com/api/comment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({
          content: comment,
          postId
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to create comment');
      }

      setComment('');
      setCommentError(null);
      setComments([data, ...comments]);
    } catch (error) {
      console.error('Comment error:', error);
      setCommentError(error.message);
    }
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`https://geomancy-blog.onrender.com/api/comment/getPostComments/${postId}`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getComments();
  }, [postId]);

  const handleLike = async (commentId) => {
    try {
      const token = Cookies.get('access_token');
      if (!token) {
        setError('Please sign in to like comments');
        return;
      }

      const res = await fetch(`https://geomancy-blog.onrender.com/api/comment/likeComment/${commentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          navigate('/sign-in');
          return;
        }
        throw new Error(data.message || 'Failed to like comment');
      }

      setComments(comments.map(comment => 
        comment._id === commentId 
          ? { ...comment, likes: data.likes, numberOfLikes: data.likes.length }
          : comment
      ));
    } catch (error) {
      setError(error.message || 'Error liking comment');
    }
  };

  const handleEdit = async (comment, editedContent) => {
    setComments(
      comments.map((c) =>
        c._id === comment._id ? { ...c, content: editedContent } : c
      )
    );
  };

  const handleDelete = async (commentId) => {
    setShowModal(false);
    try {
      if (!currentUser) {
        navigate('/sign-in');
        return;
      }
      const res = await fetch(`https://geomancy-blog.onrender.com/api/comment/deleteComment/${commentId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setComments(comments.filter((comment) => comment._id !== commentId));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='max-w-2xl mx-auto w-full p-3'>
      {currentUser ? (
        <div className='flex items-center gap-1 my-5 text-gray-500 text-sm'>
          <p>Signed in as:</p>
          <img
            className='h-5 w-5 object-cover rounded-full'
            src={currentUser.profilePicture}
            alt=''
          />
          <Link
            to={'/dashboard?tab=profile'}
            className='text-xs text-cyan-600 hover:underline'
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className='text-sm text-teal-500 my-5 flex gap-1'>
          You must be signed in to comment.
          <Link className='text-blue-500 hover:underline' to={'/sign-in'}>
            Sign In
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className='border border-teal-500 rounded-md p-3'
        >
          <Textarea
            placeholder='Add a comment...'
            rows='3'
            maxLength='200'
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className='flex justify-between items-center mt-5'>
            <p className='text-gray-500 text-xs'>
              {200 - comment.length} characters remaining
            </p>
            <Button outline gradientDuoTone='purpleToBlue' type='submit'>
              Submit
            </Button>
          </div>
          {commentError && (
            <Alert color='failure' className='mt-5'>
              {commentError}
            </Alert>
          )}
        </form>
      )}
      {comments.length > 0 ? (
  <div className='space-y-4 mt-8'>
    {comments.map(comment => (
      <div key={comment._id} className='flex flex-col gap-2 border-b border-gray-200 dark:border-gray-800 pb-4'>
        <div className='flex items-center gap-2'>
          <img 
            src={comment.user?.profilePicture}
            alt={comment.user?.username} 
            className='w-8 h-8 rounded-full object-cover'
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/default-profile.jpg';
            }}
          />
          <div className='flex flex-col'>
            <span className='text-sm font-semibold'>
              {comment.user?.username || 'Deleted User'}
            </span>
            <span className='text-xs text-gray-500'>
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <p className='text-gray-700 dark:text-gray-300'>{comment.content}</p>
        <div className='flex gap-2 items-center'>
          <button 
            onClick={() => handleLike(comment._id)}
            className={`text-sm ${comment.likes?.includes(currentUser?._id) 
              ? 'text-blue-500' 
              : 'text-gray-500'} hover:text-blue-500`}
          >
            Like ({comment.numberOfLikes || 0})
          </button>
          {(currentUser?._id === comment.userId || currentUser?.isAdmin) && (
            <>
              <button 
                onClick={() => handleEdit(comment._id, comment.content)}
                className='text-sm text-gray-500 hover:text-green-500'
              >
                Edit
              </button>
              <button 
                onClick={() => handleDelete(comment._id)}
                className='text-sm text-gray-500 hover:text-red-500'
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    ))}
  </div>
) : (
  <p className='text-gray-500 text-sm mt-8'>No comments yet. Be the first to comment!</p>
)}
  </div>
  );
}
