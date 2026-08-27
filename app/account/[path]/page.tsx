import Sidebar from "@/components/sidebar";
import { getSession } from "@/lib/auth/server";
import { AccountView } from "@neondatabase/auth/react";
import { accountViewPaths } from "@neondatabase/auth/react/ui/server";

export function generateStaticParams() {
  return Object.values(accountViewPaths).map((path) => ({ path }));
}

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
    const { path } = await params;
    const { data: session } = await getSession();
    const user = session?.user;
    const userId = user?.id;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar currentPath="/settings" />

      <main className="ml-64 p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
              <p className="text-sm text-gray-500">
                Manage your account settings and preferences.
              </p>
            </div>
          </div>
        </div>
        <div className="max-w-6xl">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <AccountView path={path} />
          </div>
        </div>
      </main>
    </div>
  );
}