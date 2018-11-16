export default (issue, opts = {}) => {
  if (!issue) return
  const issueEl = document.getElementById(issue.key)
  if (issueEl) {
    issueEl.scrollIntoView(opts)
  }
}
