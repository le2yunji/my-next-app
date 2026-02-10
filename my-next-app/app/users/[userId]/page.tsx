// app/users/[userId]/page.tsx
import UserFeedList from "@/features/users/ui/UserFeedList";

export default async function UserPage({
  params,
}: {
  params: Promise<{ userId: string }>; // params가 그냥 객체가 아니라 Promise(ReactPromise) 로 넘어오고 있음.
}) {
  const { userId } = await params;
  return (
    <div>
      <h1>{userId}의 피드</h1>
      <UserFeedList userId={userId} />
    </div>
  );
}
