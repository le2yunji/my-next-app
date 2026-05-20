/**
 * 백엔드 인증 요청용 headers를 만드는 코드
 *
 * 브라우저가 Next.js 서버로 요청할 때는 브라우저가 쿠키를 자동으로 주지만,
 * Server Action 내부에서 백엔드 API를 다시 호출할 때는 브라우저가 요청하는 게 아니라 Next.js 서버가 요청하는 것이라
 * Server Action에서 현재 요청의 쿠키를 읽고, HTTP Cookie 헤더 형태로 만들어서 백엔드 API요청에 직접 넣어줘야 함.
 */

import { cookies } from "next/headers";

export async function getServerAuthHeaders(): Promise<HeadersInit> {
  const cookieStore = await cookies();

  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  return cookieHeader ? { Cookie: cookieHeader } : {};
}
