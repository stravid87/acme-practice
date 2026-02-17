<template>
  <div id="app">
    <h1>K8s Exercise: Request Chain</h1>
    <p>Status: <strong>{{ status }}</strong></p>
    
    <button @click="fetchData" :disabled="loading">
      {{ loading ? 'Calling Proxies...' : 'Trigger Request' }}
    </button>

    <div v-if="result" class="results">
      <div class="card">
        <h3>Final Response</h3>
        <p>{{ result.message }}</p>
      </div>

      <div class="card">
        <h3>Hop Trace</h3>
        <ol>
          <li v-for="(hop, index) in result.trace" :underline="index">
            {{ hop }}
          </li>
          <li>Browser (Vue SPA)</li>
        </ol>
      </div>
    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const result = ref(null);
const loading = ref(false);
const error = ref(null);
const status = ref('Ready');

const fetchData = async () => {
  loading.value = true;
  error.value = null;
  status.value = 'Communicating with Forward Proxy...';

  try {
    // Pointing to our Ingress (instead of '/' where the SPA UI lives)
    const response = await fetch('/api-proxy/fetch-all');
    
    if (!response.ok) throw new Error(`Proxy error: ${response.status}`);
    
    result.value = await response.json();
    status.value = 'Success!';
  } catch (err) {
    error.value = `Chain Broken: ${err.message}. Is the Forward Proxy running?`;
    status.value = 'Failed';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
#app { font-family: sans-serif; padding: 20px; max-width: 600px; }
button { padding: 10px 20px; cursor: pointer; background: #42b883; color: white; border: none; border-radius: 4px; }
button:disabled { background: #ccc; }
.results { margin-top: 20px; display: flex; gap: 10px; }
.card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; flex: 1; }
.error { color: red; margin-top: 20px; font-weight: bold; }
ol { text-align: left; }
</style>