import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { Customer, Business } from '../../types';
import { formatINR, formatPhone, generateWhatsAppReminder, generateSmsReminder } from '../../lib/formatters';
import { MessageSquare, Send, Check, Smartphone, Clock, AlertTriangle, Mail } from 'lucide-react';
import { api } from '../../lib/api';
import { sendEmailViaGmail, generateLedgerReminderHtml } from '../../services/gmail';
import { getAccessToken, googleSignIn } from '../../lib/firebase';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  business: Business | null;
  initialChannel?: 'WHATSAPP' | 'SMS' | 'GMAIL';
}

export function WhatsAppModal({
  isOpen,
  onClose,
  customer,
  business,
  initialChannel = 'WHATSAPP',
}: WhatsAppModalProps) {
  const [channel, setChannel] = useState<'WHATSAPP' | 'SMS' | 'GMAIL'>(initialChannel);
  const [lang, setLang] = useState<'en' | 'hi'>('hi');
  const [copied, setCopied] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [emailTo, setEmailTo] = useState('');
  const [gmailStatus, setGmailStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [gmailMessage, setGmailMessage] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [hasGmailToken, setHasGmailToken] = useState(false);

  useEffect(() => {
    if (customer) {
      setEmailTo(customer.email || '');
    }
    setChannel(initialChannel);
    getAccessToken().then((t) => setHasGmailToken(!!t));
  }, [customer, initialChannel, isOpen]);

  if (!customer || !business) return null;

  const daysOverdue = customer.daysOverdue ?? (
    customer.lastTransactionDate
      ? Math.max(0, Math.floor((Date.now() - new Date(customer.lastTransactionDate).getTime()) / (1000 * 60 * 60 * 24)))
      : 0
  );

  const isOverdueThreshold = daysOverdue >= 15;

  const reminderUrl = channel === 'WHATSAPP'
    ? generateWhatsAppReminder({
        customerName: customer.name,
        customerPhone: customer.phone,
        businessName: business.business_name,
        outstandingAmount: customer.outstandingBalance,
        daysOverdue,
        upiId: business.upi_id,
        lang,
      })
    : generateSmsReminder({
        customerName: customer.name,
        customerPhone: customer.phone,
        businessName: business.business_name,
        outstandingAmount: customer.outstandingBalance,
        daysOverdue,
        upiId: business.upi_id,
        lang,
      }).url;

  const upiText = business.upi_id ? `\n\nUPI Payment ID: ${business.upi_id}` : '';
  const messageText = channel === 'WHATSAPP'
    ? (lang === 'hi'
        ? `नमस्ते ${customer.name} जी,\n\nयह ${business.business_name} की तरफ से एक विनम्र अनुस्मारक (reminder) है।\n\nआपके खाते में बकाया राशि (Outstanding Balance): ${formatINR(customer.outstandingBalance)} है${daysOverdue > 0 ? ` (पिछले ${daysOverdue} दिनों से बकाया)` : ''}।\n\nकृपया सुविधानुसार इसका भुगतान करें${upiText}।\n\nधन्यवाद! 🙏`
        : `Dear ${customer.name},\n\nThis is a friendly reminder from ${business.business_name} regarding your store account.\n\nYour current outstanding balance is ${formatINR(customer.outstandingBalance)}${daysOverdue > 0 ? ` (unpaid for ${daysOverdue} days)` : ''}.\n\nKindly arrange the payment at your earliest convenience${upiText}.\n\nThank you for your business! 🙏`)
    : (lang === 'hi'
        ? `नमस्ते ${customer.name} जी, ${business.business_name} की ओर से बकाया राशि ${formatINR(customer.outstandingBalance)}${daysOverdue > 0 ? ` (${daysOverdue} दिन से बकाया)` : ''} का अनुस्मारक। कृपया भुगतान करें${business.upi_id ? ` UPI: ${business.upi_id}` : ''}। धन्यवाद!`
        : `Dear ${customer.name}, Reminder from ${business.business_name}: Balance ${formatINR(customer.outstandingBalance)}${daysOverdue > 0 ? ` unpaid for ${daysOverdue} days` : ''}.${business.upi_id ? ` UPI: ${business.upi_id}` : ''} Please arrange payment. Thank you!`);

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConnectGmail = async () => {
    try {
      const res = await googleSignIn();
      if (res?.accessToken) {
        setHasGmailToken(true);
      }
    } catch (err: any) {
      setGmailStatus('error');
      setGmailMessage(err.message || 'Google authentication failed');
    }
  };

  const handleSendClick = () => {
    if (channel === 'GMAIL') {
      if (!emailTo || !emailTo.includes('@')) {
        setGmailStatus('error');
        setGmailMessage('Please provide a valid customer email address.');
        return;
      }
      // Workspace Integration requirement: User confirmation for sending emails
      setIsConfirmOpen(true);
    } else {
      executeSend();
    }
  };

  const executeSend = async () => {
    setIsSending(true);
    try {
      if (channel === 'GMAIL') {
        const html = generateLedgerReminderHtml({
          storeName: business.business_name,
          customerName: customer.name,
          outstandingBalance: customer.outstandingBalance,
          upiId: business.upi_id,
          upiName: business.upi_name || business.business_name,
          phone: business.phone,
        });

        const res = await sendEmailViaGmail({
          to: emailTo.trim(),
          subject: `Ledger Statement & Due Reminder - ${business.business_name}`,
          bodyText: messageText,
          bodyHtml: html,
        });

        if (!res.success) {
          setGmailStatus('error');
          setGmailMessage(res.error || 'Failed to send email via Gmail.');
          setIsSending(false);
          return;
        }

        setGmailStatus('success');
        setGmailMessage(`Email sent to ${emailTo} successfully!`);
        setTimeout(() => {
          onClose();
        }, 1500);
      }

      await api.reminders.sendReminder({
        customerId: customer.id,
        channel,
        lang,
        customMessage: messageText,
      });

      if (channel !== 'GMAIL') {
        window.open(reminderUrl, '_blank', 'noopener,noreferrer');
        onClose();
      }
    } catch (err: any) {
      console.warn('Logging reminder failed:', err);
      if (channel !== 'GMAIL') {
        window.open(reminderUrl, '_blank', 'noopener,noreferrer');
        onClose();
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Send Payment Reminder"
        subtitle={`${channel === 'WHATSAPP' ? 'WhatsApp' : channel === 'SMS' ? 'SMS' : 'Gmail'} notice for ${customer.name}`}
        maxWidth="md"
      >
        <div className="space-y-4">
          {/* Overdue threshold alert if >= 15 days */}
          {isOverdueThreshold && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-200 dark:border-red-800/60 flex items-center gap-2.5 text-xs text-red-800 dark:text-red-300">
              <Clock className="w-4 h-4 text-red-600 shrink-0" />
              <div>
                <span className="font-bold">Overdue Threshold Exceeded:</span> Unpaid for{' '}
                <strong>{daysOverdue} days</strong>. Payment reminder recommended.
              </div>
            </div>
          )}

          {/* Customer Balance Banner */}
          <div className="flex items-center justify-between p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/60">
            <div>
              <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">Outstanding Balance</p>
              <p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-200">{formatINR(customer.outstandingBalance)}</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 dark:text-slate-400">Customer Phone</span>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{formatPhone(customer.phone)}</p>
            </div>
          </div>

          {/* Channel and Language Selectors */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            {/* Channel selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Channel:</span>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setChannel('WHATSAPP')}
                  className={`flex items-center gap-1 px-3 py-1 rounded-md transition-colors cursor-pointer ${
                    channel === 'WHATSAPP'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={() => setChannel('SMS')}
                  className={`flex items-center gap-1 px-3 py-1 rounded-md transition-colors cursor-pointer ${
                    channel === 'SMS'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>SMS</span>
                </button>
                <button
                  type="button"
                  onClick={() => setChannel('GMAIL')}
                  className={`flex items-center gap-1 px-3 py-1 rounded-md transition-colors cursor-pointer ${
                    channel === 'GMAIL'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Gmail</span>
                </button>
              </div>
            </div>

            {/* Language selector */}
            {channel !== 'GMAIL' && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Language:</span>
                <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setLang('hi')}
                    className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                      lang === 'hi' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    हिन्दी
                  </button>
                  <button
                    type="button"
                    onClick={() => setLang('en')}
                    className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                      lang === 'en' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>
            )}
          </div>

          {channel === 'GMAIL' ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Recipient Customer Email *
                </label>
                <input
                  type="email"
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                  placeholder="e.g. customer@example.com"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              {!hasGmailToken ? (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800/60 text-xs space-y-2">
                  <p className="text-amber-800 dark:text-amber-200 font-semibold">
                    Google account authorization required to send emails via Gmail.
                  </p>
                  <button
                    type="button"
                    onClick={handleConnectGmail}
                    className="px-3 py-1.5 bg-white text-slate-800 font-bold rounded-lg border border-slate-300 shadow-xs hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Connect with Google
                  </button>
                </div>
              ) : (
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800/40 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 font-medium">
                  <Check className="w-3.5 h-3.5" />
                  <span>Authenticated with Gmail. Professional HTML statement will be sent.</span>
                </div>
              )}

              {gmailMessage && (
                <div className={`p-2.5 rounded-xl text-xs font-semibold ${
                  gmailStatus === 'error'
                    ? 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300'
                    : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300'
                }`}>
                  {gmailMessage}
                </div>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Preview {channel === 'WHATSAPP' ? 'WhatsApp' : 'SMS'} Message
              </label>
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/90 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line font-sans leading-relaxed">
                {messageText}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            {channel !== 'GMAIL' ? (
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <MessageSquare className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Text'}</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="send-reminder-btn"
                type="button"
                onClick={handleSendClick}
                disabled={isSending}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold text-white rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer ${
                  channel === 'WHATSAPP'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : channel === 'SMS'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>
                  {isSending
                    ? 'Sending...'
                    : channel === 'WHATSAPP'
                    ? 'Open in WhatsApp'
                    : channel === 'SMS'
                    ? 'Send via SMS'
                    : 'Send via Gmail'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Confirmation Dialog for Gmail Workspace compliance */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          setIsConfirmOpen(false);
          executeSend();
        }}
        title="Confirm Sending Gmail Statement"
        message={`Are you sure you want to send this digital Khata statement of ${formatINR(customer.outstandingBalance)} to ${emailTo} directly through your connected Gmail account?`}
        confirmLabel="Send Email"
        isDestructive={false}
        isLoading={isSending}
      />
    </>
  );
}
