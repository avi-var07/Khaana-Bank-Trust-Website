'use client';
import { useEffect } from 'react';

/**
 * Client-side source protection — discourages casual users from
 * viewing page source via Ctrl+U, right-click, and DevTools shortcuts.
 * 
 * NOTE: This is a deterrent, not absolute security.
 * Server-side protections (no source maps, security headers) are the real guard.
 */
export default function SourceProtection() {
  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    // Block keyboard shortcuts for View Source / DevTools
    const handleKeyDown = (e) => {
      // Ctrl+U — View Source
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        return false;
      }
      // Ctrl+Shift+I — DevTools
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
      }
      // Ctrl+Shift+J — Console
      if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        return false;
      }
      // Ctrl+Shift+C — Inspect Element
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        return false;
      }
      // F12 — DevTools
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
      // Ctrl+S — Save page
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return null; // Renders nothing — purely behavioral
}
