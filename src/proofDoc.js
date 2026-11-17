// Proof document for an institute registration (GitHub issue #7).
// Assumed defaults until the team agrees the open questions on the issue: PDF, JPG or PNG, up to 5 MB, one document.
// TODO: with a backend the file goes to private object storage (POST /institutions/:id/document, multipart) and the
// reviewer gets a short-lived signed URL. Here the browser keeps the file in memory only, so it is gone on refresh.
//   doc { type, name, size, url }   url is a blob: URL that only works in the tab that uploaded it
export const docTypes = ['Registration certificate', 'Society or trust deed', 'Company incorporation (CIN)', 'University or UGC letter', 'Other official document']
export const accept = '.pdf,.jpg,.jpeg,.png'
export const maxMB = 5
const okTypes = ['application/pdf', 'image/jpeg', 'image/png']

// Returns an error message, or '' when the file may be used.
export const checkDoc = file => {
  if (!file) return 'Attach a proof document'
  if (!okTypes.includes(file.type)) return 'Use a PDF, JPG or PNG file'
  if (file.size > maxMB * 1024 * 1024) return `File is over ${maxMB} MB`
  if (file.size === 0) return 'File is empty'
  return ''
}

export const makeDoc = (file, type) => ({ type, name: file.name, size: file.size, url: URL.createObjectURL(file) })
export const sizeLabel = n => n >= 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`
