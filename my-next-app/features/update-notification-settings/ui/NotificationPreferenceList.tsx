import {
  NOTIFICATION_LABEL,
  NotificationType,
  PREF_TYPES,
} from "@/entities/notification";

type NotificationPreferenceListProps = {
  prefs: Partial<Record<NotificationType, boolean>>;
  onToggle: (type: NotificationType) => void;
};

export function NotificationPreferenceList({
  prefs,
  onToggle,
}: NotificationPreferenceListProps) {
  return (
    <div className="mt-6">
      <h2 className="mb-3 text-sm font-semibold text-near-black">
        알림 수신 설정
      </h2>

      <ul className="divide-y divide-linen rounded-xl border border-linen">
        {PREF_TYPES.map((type) => {
          const checked = !!prefs[type];

          return (
            <li
              key={type}
              className="flex items-center justify-between px-4 py-3"
            >
              <span className="text-sm text-near-black">
                {NOTIFICATION_LABEL[type]}
              </span>

              <button
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={() => onToggle(type)}
                className={`relative h-6 w-10 rounded-full transition-colors ${
                  checked ? "bg-near-black" : "bg-silver"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    checked ? "translate-x-4" : "translate-x-0.5"
                  }`}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
