'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';

interface Settings {
  site_name: string;
  site_description: string;
  allow_comments: boolean;
  allow_registrations: boolean;
  require_email_verification: boolean;
  posts_per_page: number;
  maintenance_mode: boolean;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    site_name: 'Blog Platform',
    site_description: 'A modern blogging platform',
    allow_comments: true,
    allow_registrations: true,
    require_email_verification: true,
    posts_per_page: 10,
    maintenance_mode: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/v1/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      setSuccess('Settings updated successfully');
    } catch (err) {
      setError('Failed to update settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (key: keyof Settings, value: string | boolean | number) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Site Settings
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-8 divide-y divide-gray-200">
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="rounded-md bg-green-50 p-4">
            <p className="text-sm text-green-700">{success}</p>
          </div>
        )}

        <div className="space-y-8 divide-y divide-gray-200">
          <div className="pt-8">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">General Settings</h3>
              <p className="mt-1 text-sm text-gray-500">
                Basic site configuration and settings.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label htmlFor="site_name" className="block text-sm font-medium text-gray-700">
                  Site Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="site_name"
                    id="site_name"
                    value={settings.site_name}
                    onChange={(e) => handleChange('site_name', e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="site_description" className="block text-sm font-medium text-gray-700">
                  Site Description
                </label>
                <div className="mt-1">
                  <textarea
                    id="site_description"
                    name="site_description"
                    rows={3}
                    value={settings.site_description}
                    onChange={(e) => handleChange('site_description', e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">Features</h3>
              <p className="mt-1 text-sm text-gray-500">
                Enable or disable various site features.
              </p>
            </div>

            <div className="mt-6">
              <fieldset>
                <div className="space-y-4">
                  <div className="relative flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id="allow_comments"
                        name="allow_comments"
                        type="checkbox"
                        checked={settings.allow_comments}
                        onChange={(e) => handleChange('allow_comments', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="allow_comments" className="font-medium text-gray-700">
                        Allow Comments
                      </label>
                      <p className="text-gray-500">Enable commenting on blog posts.</p>
                    </div>
                  </div>

                  <div className="relative flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id="allow_registrations"
                        name="allow_registrations"
                        type="checkbox"
                        checked={settings.allow_registrations}
                        onChange={(e) => handleChange('allow_registrations', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="allow_registrations" className="font-medium text-gray-700">
                        Allow Registrations
                      </label>
                      <p className="text-gray-500">Allow new users to register.</p>
                    </div>
                  </div>

                  <div className="relative flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id="require_email_verification"
                        name="require_email_verification"
                        type="checkbox"
                        checked={settings.require_email_verification}
                        onChange={(e) => handleChange('require_email_verification', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="require_email_verification" className="font-medium text-gray-700">
                        Require Email Verification
                      </label>
                      <p className="text-gray-500">Require users to verify their email address.</p>
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>

          <div className="pt-8">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">Advanced Settings</h3>
              <p className="mt-1 text-sm text-gray-500">
                Advanced configuration options.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <label htmlFor="posts_per_page" className="block text-sm font-medium text-gray-700">
                  Posts Per Page
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="posts_per_page"
                    id="posts_per_page"
                    min="1"
                    max="50"
                    value={settings.posts_per_page}
                    onChange={(e) => handleChange('posts_per_page', parseInt(e.target.value))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <div className="relative flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="maintenance_mode"
                      name="maintenance_mode"
                      type="checkbox"
                      checked={settings.maintenance_mode}
                      onChange={(e) => handleChange('maintenance_mode', e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="maintenance_mode" className="font-medium text-gray-700">
                      Maintenance Mode
                    </label>
                    <p className="text-gray-500">Put the site in maintenance mode.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-5">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
} 