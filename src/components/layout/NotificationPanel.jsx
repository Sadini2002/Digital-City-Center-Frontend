import { useEffect, useRef, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";

import useNotifications from "../../hooks/useNotifications";

export default function NotificationPanel() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const {
    notifications,
    unreadCount,
    markAllRead,
  } = useNotifications();

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  const handleMarkAllRead = async (event) => {
    event.stopPropagation();

    await markAllRead();
  };

  return (
    <div
      ref={containerRef}
      className="relative"
    >
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="relative rounded-lg p-2 text-slate-600 transition hover:bg-slate-50 focus:outline-none"
        aria-label="Notifications"
        aria-expanded={open}
      >
        <Bell className="h-5 w-5" />

        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2.5 w-80 origin-top-right rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
          <div className="mb-2 flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-slate-900">
              Notifications
            </h3>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-dcc-primary hover:underline"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-64 space-y-2 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="py-6 text-center text-xs text-slate-500">
                No notifications yet.
              </p>
            ) : (
              notifications.map((notification) => (
                <NotificationRow
                  key={notification.id}
                  notification={notification}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function NotificationRow({ notification }) {
  return (
    <div
      className={`rounded-lg p-2.5 text-left transition ${
        notification.read
          ? "bg-white hover:bg-slate-50"
          : "border border-violet-100 bg-violet-50/40"
      }`}
    >
      <div className="flex items-start justify-between gap-1">
        <p
          className={`text-xs font-bold ${
            notification.read
              ? "text-slate-700"
              : "text-slate-950"
          }`}
        >
          {notification.title}
        </p>

        {!notification.read && (
          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-dcc-primary" />
        )}
      </div>

      <p className="mt-0.5 text-[11px] leading-normal text-slate-500">
        {notification.message}
      </p>

      <p className="mt-1 text-[9px] font-medium text-slate-400">
        {new Date(
          notification.createdAt
        ).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>
  );
}