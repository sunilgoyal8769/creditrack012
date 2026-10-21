import React, { useState, useEffect } from 'react';
import { Mail, Check, AlertCircle, Send, RefreshCw, Database, Flame, ExternalLink } from 'lucide-react';
import { getAccessToken, googleSignIn, logout as firebaseLogout, auth } from '../../lib/firebase';
import { getGmailProfile, sendEmailViaGmail, generateLedgerReminderHtml, GmailProfile } from '../../services/gmail';
import { useAuth } from '../../context/AuthContext';

export function GmailSettingsCard() {
  const { user, business } = useAuth();
  const [profile, setProfile] = useState<GmailProfile | null>(null);
  const [hasToken, setHasToken] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testEmail, setTestEmail] = useState(user?.email || '');
  const [testSuccess, setTestSuccess] = useState('');
  const [testError, setTestError] = useState('');

  const checkStatus = async () => {
    const token = await getAccessToken();
    setHasToken(!!token);
    if (token) {
      const prof = await getGmailProfile();
      setProfile(prof);
    } else {
      setProfile(null);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const handleConnectGmail = async () => {
    setIsConnecting(true);
    setTestError('');
    setTestSuccess('');
    try {
      const res = await googleSignIn();
      if (res && res.accessToken) {
        setHasToken(true);
        const prof = await getGmailProfile();
        setProfile(prof);
        setTestSuccess('Successfully connected Gmail with authorized scopes!');
        setTimeout(() => setTestSuccess(''), 4000);
      }
    } catch (err: any) {
      console.error('Failed to connect Gmail:', err);
      setTestError(err.message || 'Failed to authenticate with Google.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    await firebaseLogout();
    setHasToken(false);
    setProfile(null);
    setTestSuccess('Gmail account disconnected.');
    setTimeout(() => setTestSuccess(''), 3000);
  };

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmail || !testEmail.includes('@')) {
      setTestError('Please enter a valid recipient email.');
      return;
    }

    setIsSendingTest(true);
    setTestError('');
    setTestSuccess('');

    try {
      const htmlBody = generateLedgerReminderHtml({
        storeName: business?.business_name || 'CreditTrack Demo Store',
        customerName: 'Test Customer',
        outstandingBalance: 1250,
        upiId: business?.upi_id || 'store@upi',
        upiName: business?.upi_name || business?.business_name,
        phone: business?.phone,
      });

      const res = await sendEmailViaGmail({
        to: testEmail.trim(),
        subject: `[Test] Ledger Statement & Due Reminder - ${business?.business_name || 'CreditTrack'}`,
        bodyText: `Dear Customer, this is a test Khata statement from ${business?.business_name || 'CreditTrack'}. Outstanding balance: ₹1,250. UPI ID: ${business?.upi_id || 'store@upi'}.`,
        bodyHtml: htmlBody,
      });

      if (!res.success) {
        setTestError(res.error || 'Failed to send test email.');
      } else {
        setTestSuccess(`Test email sent successfully! Message ID: ${res.messageId}`);
        setTimeout(() => setTestSuccess(''), 5000);
      }
    } catch (err: any) {
      setTestError(err.message || 'Error dispatching email.');
    } finally {
      setIsSendingTest(false);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center border border-red-200 dark:border-red-900">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Gmail & Google Workspace Integration
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                Official API
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Send professional digital Khata statements and payment reminders directly from your Gmail
            </p>
          </div>
        </div>

        {hasToken && (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Connected
            </span>
            <button
              onClick={handleDisconnect}
              className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 underline cursor-pointer"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>

      {testSuccess && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>{testSuccess}</span>
        </div>
      )}

      {testError && (
        <div className="p-3 bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 rounded-xl text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{testError}</span>
        </div>
      )}

      {!hasToken ? (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/20 border border-red-100 dark:border-red-900/40 space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Connect Your Store's Google Account</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Authorize CreditTrack to deliver itemized invoices, balance statements, and UPI payment links to customer email inboxes on your behalf.
            </p>
          </div>

          <div className="pt-1">
            <button
              type="button"
              onClick={handleConnectGmail}
              disabled={isConnecting}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{isConnecting ? 'Connecting to Google...' : 'Connect with Google & Gmail'}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Sender Account</span>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {profile?.emailAddress || auth.currentUser?.email || user?.email}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Emails sent from the ledger will show this address as the sender.
              </p>
            </div>
            <button
              onClick={checkStatus}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Verify Link</span>
            </button>
          </div>

          <form onSubmit={handleSendTestEmail} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Send Test Khata Statement Email</h4>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="Enter recipient email address..."
                className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
              <button
                type="submit"
                disabled={isSendingTest}
                className="px-4 py-2 text-xs sm:text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSendingTest ? 'Sending...' : 'Send Test Email'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Sends an authentic HTML invoice preview with your store's UPI details and formatted amount to verify delivery.
            </p>
          </form>
        </div>
      )}

      {/* Cloud SQL & Firebase Architecture Status */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
          <span>Integrated Cloud Services</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 flex items-start gap-2.5">
            <Database className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Cloud SQL PostgreSQL</span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Instance: <code>ai-studio-72d8017f</code> (Region: <code>asia-southeast1</code>)
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 flex items-start gap-2.5">
            <Flame className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Firebase Suite</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Project: <code>durable-zephyr-fmn89</code> (Auth & Firestore provisioned)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
