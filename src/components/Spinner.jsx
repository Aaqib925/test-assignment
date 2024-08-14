const Spinner = () => {
  return (
    <div
      className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-gray-300 border-t-transparent dark:border-gray-600 dark:border-t-transparent"
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export default Spinner
