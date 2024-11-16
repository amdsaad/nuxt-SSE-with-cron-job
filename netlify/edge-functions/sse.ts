import { TextEncoder } from 'node:util'; // Adjusted import for Deno compatibility
// import { createClient } from '@supabase/supabase-js';

// // Initialize Supabase client
// const SUPABASE_URL = process.env.SUPABASE_URL || '';
// const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || '';
// const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Function to perform backend operations
// async function performBackendOperations() {
//   try {
//     // Example backend health check logic
//     const healthCheck = {
//       status: 'healthy',
//       timestamp: new Date().toISOString(),
//     };

//     // Fetch open orders from Supabase (adjust query as needed)
//     const { data: orders, error } = await supabase
//       .from('orders') // Replace 'orders' with your actual table name
//       .select('*')
//       .eq('state', 'open'); // Adjust the condition as necessary

//     if (error) {
//       console.error('Error fetching open orders:', error);
//       return { healthCheck, orders: [], error: error.message };
//     }

//     return { healthCheck, orders };
//   } catch (error) {
//     console.error('Error performing backend operations:', error);
//     return { error: error || 'An unexpected error occurred' };
//   }
// }

// Export default function for SSE
export default async (request: Request) => {
  const encoder = new TextEncoder();

  const body = new ReadableStream({
    async start(controller) {
      async function sendData() {
        try {
          const data = { message: 'Hello, world!', date: new Date() }; // Replace with actual data
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        } catch (error) {
          console.error("Error performing backend operations:", error);
          controller.enqueue(encoder.encode(`data: { "error": "Failed to perform operations" }\n\n`));
        }
      }

      // Send initial data immediately
      await sendData();

      // Set up an interval to send data every 60 seconds (adjust as needed)
      const intervalId = setInterval(sendData, 30000);

      // Clean up when the stream is closed
      controller.close = () => clearInterval(intervalId);
    },
  });

  return new Response(body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
};