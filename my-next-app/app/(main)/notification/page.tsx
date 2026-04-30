import { getNotificationsAction } from "@/app/actions/notifications.action";
import NotificationList from "@/features/notifications/ui/NotificationList";

const PAGE_SIZE = 20;

export default async function NotificationPage() {
  const initial = await getNotificationsAction({ limit: PAGE_SIZE });

  return (
    <NotificationList
      initialItems={!initial.isError ? initial.items : []}
      initialCursor={!initial.isError ? (initial.nextCursor ?? null) : null}
      initialHasNext={!initial.isError ? (initial.hasNext ?? false) : false}
    />
  );
}
