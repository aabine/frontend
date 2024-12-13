'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import Link from 'next/link';

interface Comment {
  id: number;
  content: string;
  author: {
    username: string;
    id: number;
  };
  post: {
    title: string;
    slug: string;
  };
  status: 'active' | 'flagged' | 'hidden';
  created_at: string;
  parent_id: number | null;
}

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await fetch('/api/v1/comments/all');
      const data = await response.json();
      setComments(data);
    } catch (err) {
      setError('Failed to fetch comments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (commentId: number, status: Comment['status']) => {
    try {
      await fetch(`/api/v1/comments/${commentId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      fetchComments(); // Refresh the list
    } catch (err) {
      setError('Failed to update comment status');
    }
  };

  const handleDelete = async (commentId: number) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await fetch(`/api/v1/comments/${commentId}`, {
        method: 'DELETE',
      });
      fetchComments(); // Refresh the list
    } catch (err) {
      setError('Failed to delete comment');
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Comments</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all comments in the system including their status and associated posts.
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 p-4 rounded-md">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="mt-8 flex flex-col">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Comment
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Post
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Author
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Date
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {comments.map((comment) => (
                    <tr key={comment.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="max-w-xs truncate">{comment.content}</div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <Link
                          href={`/blog/${comment.post.slug}`}
                          className="text-primary hover:text-primary/80"
                        >
                          {comment.post.title}
                        </Link>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {comment.author.username}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <select
                          value={comment.status}
                          onChange={(e) => handleStatusChange(comment.id, e.target.value as Comment['status'])}
                          className={`rounded-md text-sm focus:ring-primary focus:border-primary ${
                            comment.status === 'flagged'
                              ? 'border-red-300 text-red-900'
                              : comment.status === 'hidden'
                              ? 'border-gray-300 text-gray-700'
                              : 'border-green-300 text-green-900'
                          }`}
                        >
                          <option value="active">Active</option>
                          <option value="flagged">Flagged</option>
                          <option value="hidden">Hidden</option>
                        </select>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => handleDelete(comment.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 