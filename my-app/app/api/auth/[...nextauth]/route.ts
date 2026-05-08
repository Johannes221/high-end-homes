// NextAuth v5 Route Handler

import { handlers } from "@/lib/auth";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export const { GET, POST } = handlers;
