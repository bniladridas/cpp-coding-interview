<script>
    import { page } from '$app/stores';
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 class="text-4xl font-bold text-red-600 mb-4">Oops! Something went wrong</h1>
        <p class="text-gray-700 mb-4">
            Error {$page.status}: {$page.error?.message || 'Page not found'}
        </p>
        <a 
            href="/" 
            class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300"
        >
            Return to Home
        </a>
    </div>
</div>
