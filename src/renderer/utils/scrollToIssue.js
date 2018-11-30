export default (issue, opts = {}) => {
  if (!issue) return
  const issueEl = document.getElementById(issue.key)
  if (issueEl) {
    setTimeout(() => {
      issueEl.scrollIntoView(opts)
    }, 0)
  }
}
