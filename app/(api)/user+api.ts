import { neon } from '@neondatabase/serverless';

export async function POST(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const body = await request.json();
    const { name, email, clerkId } = body;

    if (!name || !email || !clerkId) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const response =
      await sql`INSERT INTO users (name, email, clerk_id) VALUES (${name}, ${email}, ${clerkId})`;

    console.log('Creating user in DB:', { name, email, clerkId });

    return Response.json({ data: response }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating user:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
