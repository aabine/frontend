'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import Image from 'next/image';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="space-y-24 animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 pt-16 pb-32">
        {/* Background decorative elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/5 blur-[100px]"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-8">
            <div className="mx-auto max-w-2xl lg:mx-0 lg:flex lg:flex-col lg:justify-center">
              <div className="mb-8 inline-flex items-center rounded-full bg-primary/10 px-3 py-1">
                <p className="text-sm font-medium text-primary">
                  ✨ Your ideas deserve to be shared
                </p>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
                  Share Your Story
                </span>
                <span className="mt-2 block">With the World</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-xl">
                A modern platform for writers and readers. Create beautiful blog posts, engage with your audience, and build your online presence.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                {!user ? (
                  <>
                    <Link
                      href="/auth/register"
                      className="transform transition-all duration-300 inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-primary to-purple-600 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                      Get Started
                      <svg className="ml-2 -mr-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                    <Link
                      href="/auth/login"
                      className="transform transition-all duration-300 inline-flex items-center justify-center px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:-translate-y-0.5"
                    >
                      Sign In
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/blog/create"
                    className="transform transition-all duration-300 inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-primary to-purple-600 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    Create New Post
                    <svg className="ml-2 -mr-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </Link>
                )}
              </div>
              <div className="mt-10 flex items-center gap-x-6">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200"></div>
                  ))}
                </div>
                <p className="text-sm leading-6 text-gray-600">
                  Join <span className="font-semibold text-primary">2,000+</span> writers who already share their stories
                </p>
              </div>
            </div>
            <div className="relative lg:mt-0">
              <div className="relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-[350px] w-[350px] rounded-full bg-gradient-to-r from-primary/30 to-purple-600/30 blur-3xl"></div>
                </div>
                <div className="relative mx-auto w-full max-w-lg">
                  <div className="relative rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-900/5">
                    <div className="flex items-center space-x-2 mb-6">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="group relative">
                      <div className="absolute -inset-2 rounded-lg bg-gradient-to-r from-primary/50 to-purple-600/50 opacity-0 blur transition duration-500 group-hover:opacity-75"></div>
                      <div className="relative rounded-lg bg-white p-6">
                        <pre className="text-sm overflow-x-auto">
                          <code className="language-javascript text-gray-800">
{`// Your next great blog post
const BlogPost = () => {
  return (
    <article className="prose">
      <h1>Welcome to My Blog</h1>
      <p>
        Here's where your ideas
        come to life...
      </p>
    </article>
  );
};`}
                          </code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-primary">Features</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to blog
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Start writing and sharing your stories with powerful features designed to help you succeed
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-7xl">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-purple-600/5 transition-all duration-500 group-hover:opacity-100"></div>
                  <div className="relative">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="mt-6 text-xl font-semibold leading-7 tracking-tight text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-base leading-7 text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative isolate">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent -z-10"></div>
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Ready to start blogging?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
              Join our community of writers and readers today. Start sharing your stories with the world.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href={user ? "/blog/create" : "/auth/register"}
                className="transform transition-all duration-300 inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-primary to-purple-600 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                {user ? "Create Your First Post" : "Get Started for Free"}
                <svg className="ml-2 -mr-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    title: 'Rich Text Editor',
    description: 'Write beautiful content with our modern editor. Support for markdown, images, and code blocks.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  {
    title: 'SEO Optimized',
    description: 'Get more visibility with built-in SEO tools. Help your content rank better in search results.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    title: 'Analytics',
    description: "Track your blog performance with detailed analytics. Understand your audience better.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];
