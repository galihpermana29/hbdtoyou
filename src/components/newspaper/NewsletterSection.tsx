export default function NewsletterSection() {
  return (
    <section className="mt-16 py-12 border-t">
      <div className="text-center max-w-xl mx-auto">
        <h2 className="text-2xl font-serif mb-4">
          Sign up for the Spotlight Newsletter
        </h2>
        <form className="flex gap-4 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Your email address"
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
            Sign Up
          </button>
        </form>
      </div>
    </section>
  );
}
