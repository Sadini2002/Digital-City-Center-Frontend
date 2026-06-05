/** Two-column auth content for pages that use the full site header (e.g. login). */
export default function AuthPageMain({ children }) {
  return (
    <main className="mx-auto flex w-full min-w-0 max-w-7xl flex-1 flex-col-reverse gap-6 px-3 py-6 sm:gap-8 sm:px-6 sm:py-8 lg:flex-row lg:items-start lg:gap-10 lg:px-8 lg:py-10">
      {children}
    </main>
  )
}
