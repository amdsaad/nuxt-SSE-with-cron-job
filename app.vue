<template>
  <div>
    <h1>Real-time Backend Check</h1>
    <p>{{ message }}</p>
    <button @click="closeConnection">Close Connection</button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const message = ref('Waiting for updates...')
let eventSource // Declare eventSource globally in the component

onMounted(() => {
  // Check if there's an existing connection, close it if found
  if (eventSource) {
    eventSource.close()
    console.log('Previous SSE connection closed')
  }

  // Create a new SSE connection
  eventSource = new EventSource('/api/sse')

  eventSource.onopen = () => {
    console.log('Connection to SSE established')
  }

  eventSource.onerror = (error) => {
    console.log('Error connecting to SSE', error)
  }

  eventSource.onmessage = (event) => {
    console.log('event.data', event.data)
    message.value = event.data
  }
})

// Function to close the SSE connection
const closeConnection = () => {
  if (eventSource) {
    eventSource.close() // Close the SSE connection
    console.log('SSE connection closed')
  }
}

// Clean up on component unmount or hot reload
onUnmounted(() => {
  closeConnection() // Ensure the connection is closed when the component is destroyed
})
</script>
