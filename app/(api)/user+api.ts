import { ExpoRequest } from 'expo-router/server';

export async function POST(request: ExpoRequest) {
  try {
    const body = await request.json();
    const { name, email, clerkId } = body;

    if (!name || !email || !clerkId) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Placeholder for database logic
    console.log('Creating user in DB:', { name, email, clerkId });

    return Response.json({ data: body }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating user:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
