import React from 'react'

export default function Footer() {
  return (
    <footer className="mt-8 border-t border-white/10 py-4 text-sm text-white/70">
      <div className="container mx-auto flex items-center justify-center gap-4">
        <a href="#/legal/terms" className="hover:text-white">Terms</a>
        <span>·</span>
        <a href="#/legal/privacy" className="hover:text-white">Privacy</a>
        <span>·</span>
        <a href="https://github.com/phillyangel215/pillarmanagment/issues" className="hover:text-white">Help & Status</a>
      </div>
    </footer>
  )
}

