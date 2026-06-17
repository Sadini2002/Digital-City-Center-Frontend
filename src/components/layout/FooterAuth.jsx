import { APP_NAME } from '@/utils/constants'

export default function FooterAuth() {
  return (
    <footer className="border-t border-gray-100 bg-white py-6 text-center text-sm text-gray-500">
      © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
    </footer>
  )
}
