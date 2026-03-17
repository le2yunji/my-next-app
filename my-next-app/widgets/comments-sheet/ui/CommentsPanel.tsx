// widgets/comments-sheet/ui/CommentsPanel.tsx
// type Props = {
//   postId: string;
// };

// export default async function CommentsPanel({ postId }: Props) {
//   // const comments = await getComments(postId);

//   return (
//     <section className="pb-6">
//       <h2 className="mb-4 text-lg font-semibold">댓글</h2>

//       <ul className="space-y-4">
//         {comments.map((comment) => (
//           <li key={comment.id}>
//             <p className="text-sm font-semibold">@{comment.author.username}</p>
//             <p className="text-sm text-gray-700">{comment.content}</p>
//           </li>
//         ))}
//       </ul>
//     </section>
//   );
// }

import React from "react";

export default function CommentsPanel() {
  return <div>CommentsPanel</div>;
}
