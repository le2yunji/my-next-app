import { getMyBoardsAction } from "@/app/actions/boards.action";
import SavedView from "@/features/saved/ui/SavedView";

export default async function SavedPage() {
  const result = await getMyBoardsAction();

  if ("isError" in result) {
    return (
      <div className="px-5 py-10 text-center text-sm text-red-500">
        {result.message}
      </div>
    );
  }

  return <SavedView boards={result.boards} userId={result.userId} />;
}
