import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiDownload, 
  FiX, 
  FiShare, 
  FiPlusSquare, 
  FiCheckCircle, 
  FiExternalLink,
  FiSmartphone
} from 'react-icons/fi';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already running in standalone mode (installed & opened from home screen)
    const checkStandalone = () => {
      const isStandaloneMode = 
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true ||
        document.referrer.includes('android-app://');

      setIsStandalone(isStandaloneMode);
      return isStandaloneMode;
    };

    if (checkStandalone()) return;

    // Check user agent for iOS
    const ua = window.navigator.userAgent;
    const isIOSDevice = /iPhone|iPad|iPod/i.test(ua) && !window.MSStream;
    setIsIOS(isIOSDevice);

    // Check for Facebook / Messenger / Instagram / In-App WebView
    const isInApp = /FBAN|FBAV|Instagram|Messenger|Line|Twitter/i.test(ua);
    setIsInAppBrowser(isInApp);

    // Listen for custom trigger event from Navbar/Footer buttons
    const handleCustomTrigger = () => {
      if (checkStandalone()) return;
      setShowPrompt(true);
      if (isIOSDevice) {
        setShowIOSModal(true);
      }
    };
    window.addEventListener('trigger-pwa-install', handleCustomTrigger);

    // Handle standard beforeinstallprompt event (Android, Chrome, Edge, Samsung Internet)
    const handleBeforeInstallPrompt = (e) => {
      // Prevent default Chrome mini-infobar
      e.preventDefault();
      setDeferredPrompt(e);

      // Auto-show install prompt banner if not dismissed recently
      const hasDismissed = sessionStorage.getItem('pwa_prompt_dismissed');
      if (!hasDismissed) {
        // Small delay to allow page rendering on mobile link click
        setTimeout(() => {
          setShowPrompt(true);
        }, 1200);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      setShowIOSModal(false);
      console.log('[PWA] App successfully installed!');
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    // On iOS device, show prompt if not dismissed recently
    if (isIOSDevice && !checkStandalone()) {
      const hasDismissed = sessionStorage.getItem('pwa_prompt_dismissed');
      if (!hasDismissed) {
        setTimeout(() => {
          setShowPrompt(true);
        }, 1500);
      }
    }

    return () => {
      window.removeEventListener('trigger-pwa-install', handleCustomTrigger);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Handle click on Install Button
  const handleInstallClick = async () => {
    if (isInAppBrowser) {
      // In-App browser guidance
      alert('অ্যাপটি ইন্সটল করতে উপরে ডান কোনে 3-dots চাপ দিয়ে "Open in Chrome" বা "Open in Safari" নির্বাচন করুন।');
      return;
    }

    if (isIOS) {
      // Show iOS step-by-step installation instructions modal
      setShowIOSModal(true);
      return;
    }

    if (deferredPrompt) {
      try {
        // Show native install dialog
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          console.log('[PWA] User accepted the install prompt');
          setIsInstalled(true);
          setShowPrompt(false);
        } else {
          console.log('[PWA] User dismissed the install prompt');
        }
        setDeferredPrompt(null);
      } catch (err) {
        console.error('[PWA] Error triggering install prompt:', err);
      }
    } else {
      // Fallback for browsers where prompt isn't directly exposed
      alert('আপনার মোবাইলের ব্রাউজার মেনু (3-dots) থেকে "Add to Home screen" বা "অ্যাপ ইনস্টল করুন" সিলেক্ট করুন।');
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  // Do not render anything if already installed/standalone or hidden
  if (isStandalone || isInstalled) return null;

  return (
    <>
      {/* Floating Bottom Notification Banner for Mobile & Desktop */}
      <AnimatePresence>
        {showPrompt && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:w-96 z-50 bg-white dark:bg-gray-900 border-2 border-primary-500/30 rounded-2xl shadow-2xl p-4 backdrop-blur-lg dark:text-white"
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0 border border-primary-200 dark:border-primary-800">
                <img src="/icons/icon-192x192.png" alt="PBDG Logo" className="w-10 h-10 rounded-lg object-cover" />
              </div>

              <div className="flex-1 pr-4">
                <div className="flex items-center gap-1.5 font-bold text-gray-900 dark:text-white text-base">
                  <span>PBDG অ্যাপ ইন্সটল করুন</span>
                  <span className="bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 text-xs px-2 py-0.5 rounded-full">
                    ফ্রি
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                  সরাসরি মোবাইল হোমস্ক্রিনে অ্যাপ হিসেবে পেতে ইন্সটল করুন। ইন্টারনেট ছাড়াও ব্যবহার করা যাবে।
                </p>

                {/* In-app browser notice */}
                {isInAppBrowser && (
                  <div className="mt-2 text-[11px] bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 p-2 rounded-lg border border-amber-200 dark:border-amber-800/50 flex items-center gap-1.5">
                    <FiExternalLink className="flex-shrink-0" />
                    <span>ইন্সটল করতে Chrome বা Safari ব্রাউজারে অপেন করুন।</span>
                  </div>
                )}

                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={handleInstallClick}
                    className="flex-1 btn-primary py-2 px-3 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-md hover:shadow-primary-500/20 active:scale-95 transition-all"
                  >
                    <FiDownload className="text-sm" />
                    <span>{isIOS ? 'কীভাবে ইন্সটল করবেন' : 'এখনই ইন্সটল করুন'}</span>
                  </button>

                  <button
                    onClick={handleDismiss}
                    className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors font-medium"
                  >
                    পরে
                  </button>
                </div>
              </div>

              <button
                onClick={handleDismiss}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 transition-colors"
                aria-label="বন্ধ করুন"
              >
                <FiX size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* iOS Safari Installation Guide Modal */}
      <AnimatePresence>
        {showIOSModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ y: 200, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 200, opacity: 0 }}
              className="bg-white dark:bg-gray-900 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-gray-100 dark:border-gray-800"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center">
                    <FiSmartphone className="text-primary-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-base">iPhone-এ ইন্সটল করার নিয়ম</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Safari ব্রাউজার দিয়ে কয়েক সেকেন্ডেই ইন্সটল করুন</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowIOSModal(false)}
                  className="p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="py-5 space-y-4">
                <div className="flex items-start gap-3 bg-gray-50 dark:bg-gray-800/60 p-3.5 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                  <div className="w-7 h-7 rounded-full bg-primary-600 text-white font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                    ১
                  </div>
                  <div className="text-xs text-gray-700 dark:text-gray-200">
                    <p className="font-semibold text-gray-900 dark:text-white mb-0.5">Share অপশনে ট্যাপ করুন</p>
                    <p>আপনার Safari ব্রাউজারের নিচে থাকা <span className="inline-flex items-center gap-1 font-semibold text-primary-600 dark:text-primary-400"><FiShare /> Share</span> আইকনে চাপ দিন।</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-gray-50 dark:bg-gray-800/60 p-3.5 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                  <div className="w-7 h-7 rounded-full bg-primary-600 text-white font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                    ২
                  </div>
                  <div className="text-xs text-gray-700 dark:text-gray-200">
                    <p className="font-semibold text-gray-900 dark:text-white mb-0.5">Add to Home Screen বেছে নিন</p>
                    <p>তালিকাটি একটু নিচে স্ক্রোল করে <span className="inline-flex items-center gap-1 font-semibold text-primary-600 dark:text-primary-400"><FiPlusSquare /> Add to Home Screen</span> অপশনটিতে চাপ দিন।</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-gray-50 dark:bg-gray-800/60 p-3.5 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                    ৩
                  </div>
                  <div className="text-xs text-gray-700 dark:text-gray-200">
                    <p className="font-semibold text-gray-900 dark:text-white mb-0.5">Add বাটনে ক্লিক করুন</p>
                    <p>উপরে ডান কোনের <span className="font-bold text-emerald-600 dark:text-emerald-400">"Add"</span> বাটনে চাপ দিলেই অ্যাপটি আপনার মোবাইলে চলে আসবে!</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIOSModal(false)}
                className="w-full btn-primary py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg"
              >
                <FiCheckCircle size={18} />
                <span>বুঝেছি</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

// Utility function to manually launch install prompt from anywhere (Navbar/Footer/Buttons)
export function triggerPWAInstall() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('trigger-pwa-install'));
  }
}
