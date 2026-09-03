const DEFAULT_MAX_BYTES = 5 * 1024 * 1024

const BLOCKED_EXTENSIONS = new Set([
  '.exe',
  '.bat',
  '.cmd',
  '.com',
  '.msi',
  '.dll',
  '.sh',
  '.ps1',
  '.vbs',
  '.js',
  '.jar',
  '.scr',
  '.app',
  '.php',
  '.asp',
  '.aspx',
  '.html',
  '.htm',
])

const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
])

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'])

const DANGEROUS_MIME_TYPES = new Set([
  'application/x-msdownload',
  'application/x-msdos-program',
  'application/vnd.microsoft.portable-executable',
  'application/x-executable',
  'application/x-sh',
  'application/javascript',
  'text/javascript',
  'text/html',
])

function getExtension(fileName) {
  const index = fileName.lastIndexOf('.')
  return index === -1 ? '' : fileName.slice(index).toLowerCase()
}

function hasBlockedExtension(fileName) {
  const parts = fileName.toLowerCase().split('.')
  for (let index = 1; index < parts.length; index += 1) {
    if (BLOCKED_EXTENSIONS.has(`.${parts[index]}`)) return true
  }
  return false
}

export function validateUploadFile(file, options = {}) {
  const maxBytes = options.maxBytes ?? DEFAULT_MAX_BYTES
  const allowedTypes = options.allowedTypes ?? ALLOWED_IMAGE_TYPES
  const label = options.label ?? 'File'

  if (!file) {
    return { valid: false, error: `${label}: no file selected.` }
  }

  const extension = getExtension(file.name)

  if (BLOCKED_EXTENSIONS.has(extension) || hasBlockedExtension(file.name)) {
    return {
      valid: false,
      error: `${label}: executable files (e.g. .exe) are not allowed.`,
    }
  }

  if (!extension || !ALLOWED_EXTENSIONS.has(extension)) {
    return {
      valid: false,
      error: `${label}: only JPG, PNG, WebP, and GIF images are allowed.`,
    }
  }

  if (DANGEROUS_MIME_TYPES.has(file.type)) {
    return {
      valid: false,
      error: `${label}: executable files (e.g. .exe) are not allowed.`,
    }
  }

  if (file.type && !allowedTypes.has(file.type)) {
    return {
      valid: false,
      error: `${label}: only JPG, PNG, WebP, and GIF images are allowed.`,
    }
  }

  if (file.size > maxBytes) {
    const limitMb = maxBytes / (1024 * 1024)
    return {
      valid: false,
      error: `${label}: file size exceeds the ${limitMb}MB limit. Please choose a smaller image.`,
    }
  }

  return { valid: true, file }
}

export function validateUploadFiles(files, options = {}) {
  const list = Array.from(files || [])
  if (!list.length) {
    return { valid: false, error: 'No file selected.' }
  }

  for (const file of list) {
    const result = validateUploadFile(file, options)
    if (!result.valid) return result
  }

  return { valid: true, files: list }
}

export const UPLOAD_LIMITS = {
  maxBytes: DEFAULT_MAX_BYTES,
  maxMb: DEFAULT_MAX_BYTES / (1024 * 1024),
}
