'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { postsApi, commentsApi } from '@/lib/services/api';
import Link from 'next/link';

interface Comment {
  id: number;
  content: string;
  author: {
    username: string;
  };
  created_at: string;
  parent_id: number | null;
  replies?: Comment[];
}

interface Post {
  id: number;
  title: string;
  content: string;
  author: {
    username: string;
    id: number;
  };
  created_at: string;
  updated_at: string;
  tags: Array<{ name: string }>;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
}

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState<number | null>(null);

  useEffect(() => {
    if (params.slug) {
      fetchPost();
      fetchComments();
    }
  }, [params.slug]);

  const fetchPost = async () => {
    try {
      const data = await postsApi.getOne(params.slug as string);
      setPost(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load post');
    }
  };

  const fetchComments = async () => {
    try {
      if (!post) return;
      const data = await commentsApi.getForPost(post.id);
      setComments(data);
    } catch (err: any) {
      console.error('Error fetching comments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    try {
      await postsApi.like(params.slug as string);
      setPost(prev => prev ? { ...prev, likes_count: prev.likes_count + 1, is_liked: true } : null);
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleComment = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    if (!newComment.trim()) return;

    try {
      setIsSubmitting(true);
      await commentsApi.create({
        post_id: post!.id,
        content: newComment,
        parent_id: replyTo,
      });
      setNewComment('');
      setReplyTo(null);
      await fetchComments();
      setPost(prev => prev ? { ...prev, comments_count: prev.comments_count + 1 } : null);
    } catch (err) {
      console.error('Error posting comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 p-4 rounded-md">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      </div>
    );
  }

  if (isLoading || !post) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <article className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-8">
          {/* Post Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
            <div className="flex items-center text-sm text-gray-500">
              <span>By {post.author.username}</span>
              <span className="mx-2">•</span>
              <time dateTime={post.created_at}>
                {new Date(post.created_at).toLocaleDateString()}
              </time>
              {post.updated_at !== post.created_at && (
                <>
                  <span className="mx-2">•</span>
                  <span>Updated on {new Date(post.updated_at).toLocaleDateString()}</span>
                </>
              )}
            </div>
          </div>

          {/* Post Content */}
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          <div className="mt-8 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag.name}
                className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
              >
                {tag.name}
              </span>
            ))}
          </div>

          {/* Post Actions */}
          <div className="mt-8 flex items-center space-x-4 border-t border-gray-200 pt-6">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 text-sm ${
                post.is_liked ? 'text-primary' : 'text-gray-500 hover:text-primary'
              }`}
            >
              <svg
                className="h-5 w-5"
                fill={post.is_liked ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span>{post.likes_count} likes</span>
            </button>
            <button
              onClick={() => document.getElementById('comment-input')?.focus()}
              className="flex items-center space-x-2 text-sm text-gray-500 hover:text-primary"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span>{post.comments_count} comments</span>
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-gray-50 px-6 py-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Comments</h2>

          {/* Comment Form */}
          <div className="mb-8">
            <div className="flex space-x-4">
              <div className="flex-1">
                <textarea
                  id="comment-input"
                  rows={3}
                  placeholder={replyTo ? 'Write a reply...' : 'Write a comment...'}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>
              <div className="flex flex-col justify-end">
                <button
                  onClick={handleComment}
                  disabled={isSubmitting || !newComment.trim()}
                  className="inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Posting...' : 'Post'}
                </button>
              </div>
            </div>
            {replyTo && (
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <span>Replying to a comment</span>
                <button
                  onClick={() => setReplyTo(null)}
                  className="ml-2 text-primary hover:text-primary/80"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.length === 0 ? (
              <p className="text-center text-gray-500">No comments yet. Be the first to comment!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{comment.author.username}</span>
                      <span className="text-gray-500">•</span>
                      <time className="text-gray-500" dateTime={comment.created_at}>
                        {new Date(comment.created_at).toLocaleDateString()}
                      </time>
                    </div>
                    {user && (
                      <button
                        onClick={() => setReplyTo(comment.id)}
                        className="text-sm text-primary hover:text-primary/80"
                      >
                        Reply
                      </button>
                    )}
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 ml-8 space-y-4">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-medium text-gray-900">{reply.author.username}</span>
                            <span className="text-gray-500">•</span>
                            <time className="text-gray-500" dateTime={reply.created_at}>
                              {new Date(reply.created_at).toLocaleDateString()}
                            </time>
                          </div>
                          <p className="text-gray-700">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </article>
    </div>
  );
} 