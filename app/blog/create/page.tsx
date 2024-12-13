'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import dynamic from 'next/dynamic';
import { postsApi } from '@/lib/services/api';
import { useAuth } from '@/lib/context/AuthContext';

// Import ReactQuill dynamically to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <div className="h-64 w-full bg-gray-50 animate-pulse rounded-md" />,
});

const postSchema = z.object({
  title: z.string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be less than 100 characters'),
  summary: z.string()
    .min(10, 'Summary must be at least 10 characters')
    .max(200, 'Summary must be less than 200 characters'),
  content: z.string()
    .min(50, 'Content must be at least 50 characters'),
  tags: z.string()
    .transform(val => val.split(',').map(tag => tag.trim()).filter(Boolean)),
});

type PostForm = z.infer<typeof postSchema>;

export default function CreatePostPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PostForm>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      summary: '',
      content: '',
      tags: '',
    },
  });

  const content = watch('content');

  const onEditorChange = (value: string) => {
    setValue('content', value, { shouldValidate: true });
  };

  const onSubmit = async (data: PostForm) => {
    try {
      setIsLoading(true);
      setError(null);

      // Create FormData object
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('summary', data.summary);
      formData.append('content', data.content);
      formData.append('tags', JSON.stringify(data.tags));

      // Create post
      const response = await postsApi.create(formData);
      console.log('Post created successfully:', response);

      // Redirect to the new post
      if (response && response.slug) {
        router.push(`/blog/${response.slug}`);
      } else {
        router.push('/blog');
      }
    } catch (err: any) {
      console.error('Error creating post:', err);
      if (err.response?.status === 403) {
        setError('You must be logged in to create a post');
        router.push('/auth/login');
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError(err.message || 'Failed to create post');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ color: [] }, { background: [] }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean'],
    ],
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Don't render the form if user is not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Create New Post
          </h2>
        </div>
      </div>

      <div className="mt-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="title"
                {...register('title')}
                className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Enter your post title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
              Summary
            </label>
            <div className="mt-1">
              <textarea
                id="summary"
                rows={3}
                {...register('summary')}
                className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Write a brief summary of your post"
              />
              {errors.summary && (
                <p className="mt-1 text-sm text-red-600">{errors.summary.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <div className="mt-1 prose max-w-full">
              <ReactQuill
                theme="snow"
                value={content}
                onChange={onEditorChange}
                modules={modules}
                className="h-64 mb-12"
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
              Tags
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="tags"
                {...register('tags')}
                className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Enter tags separated by commas"
              />
              {errors.tags && (
                <p className="mt-1 text-sm text-red-600">{errors.tags.message}</p>
              )}
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Separate tags with commas (e.g. technology, programming, web development)
            </p>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating...' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 