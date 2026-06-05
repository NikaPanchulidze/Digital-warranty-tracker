import React, { useEffect, useState } from 'react';
import { Bell, CheckCircle2, AlertTriangle, XOctagon } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, Button, Badge, Skeleton, Spinner } from '@/app/components/ui';
import { Pagination } from '@/app/components/Pagination';
import { api } from '@/shared/api/backendApi';
import type { Notification } from '@/shared/types/domain';
import { formatDate } from '@/shared/lib/warranty';

const NOTIFICATIONS_PAGE_SIZE = 6;

export function Notifications() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('unread');
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const { data: notifications = [], isLoading, error } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => (await api.get<Notification[]>('/notifications')).data,
  });

  const markRead = useMutation({
    mutationFn: (id: string) => api.patch(`/notifications/${id}/read`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const markAllRead = useMutation({
    mutationFn: () => api.patch('/notifications/read-all'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === 'unread') return !notification.is_read;
    if (filter === 'read') return notification.is_read;
    return true;
  });
  const unreadCount = notifications.filter((notification) => !notification.is_read).length;
  const totalPages = Math.max(1, Math.ceil(filteredNotifications.length / NOTIFICATIONS_PAGE_SIZE));
  const paginatedNotifications = filteredNotifications.slice((page - 1) * NOTIFICATIONS_PAGE_SIZE, page * NOTIFICATIONS_PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [filter, notifications.length]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500 mt-1">Stay updated on your warranties and products</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="secondary" className="w-full sm:w-auto text-sm gap-2" onClick={() => markAllRead.mutate()} disabled={markAllRead.isPending}>
            {markAllRead.isPending && <Spinner />}
            {markAllRead.isPending ? 'Updating...' : 'Mark all as read'}
          </Button>
        </div>
      </div>

      {error && <Card className="p-4 border-red-100 bg-red-50 text-sm text-red-700">Unable to load notifications. Start the backend server.</Card>}

      <div className="flex gap-2 border-b border-gray-200">
        <TabButton label="All" active={filter === 'all'} onClick={() => setFilter('all')} />
        <button onClick={() => setFilter('unread')} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${filter === 'unread' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
          Unread <Badge variant="neutral" className="ml-1 px-1.5 py-0">{unreadCount}</Badge>
        </button>
        <TabButton label="Read" active={filter === 'read'} onClick={() => setFilter('read')} />
      </div>

      <div className="space-y-4">
        {isLoading && <NotificationSkeleton />}
        {!isLoading && paginatedNotifications.map((notification) => (
          <Card key={notification.id} className={`p-4 transition-all hover:shadow-md ${!notification.is_read ? 'border-l-4 border-l-blue-600 bg-blue-50/30' : ''}`}>
            <div className="flex items-start gap-4">
              <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center mt-1 ${notification.status === 'failed' ? 'bg-red-100' : notification.threshold_days ? 'bg-yellow-100' : 'bg-green-100'}`}>
                {getIcon(notification)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      {notification.title}
                      {!notification.is_read && <span className="inline-block w-2 h-2 bg-blue-600 rounded-full ml-2" />}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 leading-relaxed">{notification.message}</p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">{formatDate(notification.created_at.slice(0, 10))}</span>
                </div>
                <div className="mt-3 flex items-center gap-4">
                  {notification.product_id && (
                    <button
                      type="button"
                      onClick={async () => {
                        if (!notification.is_read) {
                          await markRead.mutateAsync(notification.id);
                        }
                        navigate(`/products/${notification.product_id}`);
                      }}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      View Product
                    </button>
                  )}
                  {!notification.is_read && (
                    <button className="text-sm font-medium text-gray-500 hover:text-gray-900" onClick={() => markRead.mutate(notification.id)}>
                      Mark read
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
        {!isLoading && !filteredNotifications.length && (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No notifications</h3>
            <p className="text-gray-500">There are no {filter !== 'all' ? filter : ''} notifications to display.</p>
          </div>
        )}
      </div>

      {!isLoading && filteredNotifications.length > 0 && (
        <Card>
          <Pagination
            page={page}
            pageSize={NOTIFICATIONS_PAGE_SIZE}
            totalItems={filteredNotifications.length}
            itemLabel="notification"
            onPageChange={setPage}
          />
        </Card>
      )}
    </div>
  );
}

function NotificationSkeleton() {
  return (
    <>
      {[0, 1, 2].map((row) => (
        <Card key={row} className="p-4">
          <div className="flex items-start gap-4">
            <Skeleton className="mt-1 h-10 w-10 rounded-full" />
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div className="w-full">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="mt-3 h-4 w-full" />
                  <Skeleton className="mt-2 h-4 w-3/4" />
                </div>
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="mt-4 h-4 w-24" />
            </div>
          </div>
        </Card>
      ))}
    </>
  );
}

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${active ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
      {label}
    </button>
  );
}

function getIcon(notification: Notification) {
  if (notification.status === 'failed') return <XOctagon className="w-5 h-5 text-red-600" />;
  if (notification.threshold_days) return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
  if (notification.status === 'sent') return <CheckCircle2 className="w-5 h-5 text-green-600" />;
  return <Bell className="w-5 h-5 text-blue-600" />;
}
