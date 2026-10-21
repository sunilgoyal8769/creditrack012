import { getAccessToken } from '../lib/firebase';

export interface SendEmailParams {
  to: string;
  subject: string;
  bodyText: string;
  bodyHtml?: string;
}

export interface GmailProfile {
  emailAddress: string;
  messagesTotal: number;
  threadsTotal: number;
  historyId: string;
}

function base64UrlEncode(str: string): string {
  // UTF-8 friendly base64 encoding
  const utf8Bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < utf8Bytes.length; i++) {
    binary += String.fromCharCode(utf8Bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function getGmailProfile(): Promise<GmailProfile | null> {
  const token = await getAccessToken();
  if (!token) return null;

  try {
    const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.warn('Failed to fetch Gmail profile:', res.status, await res.text());
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error('Error getting Gmail profile:', err);
    return null;
  }
}

export async function sendEmailViaGmail({
  to,
  subject,
  bodyText,
  bodyHtml,
}: SendEmailParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const token = await getAccessToken();
  if (!token) {
    return {
      success: false,
      error: 'Google / Gmail access token not found. Please click "Connect with Google" first.',
    };
  }

  try {
    const boundary = `__boundary_${Date.now()}__`;
    let rawEmail = '';

    if (bodyHtml) {
      rawEmail = [
        `To: ${to}`,
        `Subject: =?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`,
        'MIME-Version: 1.0',
        `Content-Type: multipart/alternative; boundary="${boundary}"`,
        '',
        `--${boundary}`,
        'Content-Type: text/plain; charset="UTF-8"',
        'Content-Transfer-Encoding: 7bit',
        '',
        bodyText,
        '',
        `--${boundary}`,
        'Content-Type: text/html; charset="UTF-8"',
        'Content-Transfer-Encoding: 7bit',
        '',
        bodyHtml,
        '',
        `--${boundary}--`,
      ].join('\r\n');
    } else {
      rawEmail = [
        `To: ${to}`,
        `Subject: =?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`,
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset="UTF-8"',
        'Content-Transfer-Encoding: 7bit',
        '',
        bodyText,
      ].join('\r\n');
    }

    const encodedRaw = base64UrlEncode(rawEmail);

    const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw: encodedRaw }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      const errMsg = errData.error?.message || `Gmail API Error (${res.status})`;
      return { success: false, error: errMsg };
    }

    const data = await res.json();
    return { success: true, messageId: data.id };
  } catch (err: any) {
    console.error('Failed to send email via Gmail:', err);
    return { success: false, error: err.message || 'An unexpected error occurred while sending email.' };
  }
}

export function generateLedgerReminderHtml(params: {
  storeName: string;
  customerName: string;
  outstandingBalance: number;
  dueDate?: string;
  upiId?: string;
  upiName?: string;
  phone?: string;
}): string {
  const formattedBalance = `₹${params.outstandingBalance.toLocaleString('en-IN')}`;
  const upiSection = params.upiId
    ? `<div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-top: 18px; text-align: center;">
         <p style="margin: 0 0 6px 0; font-size: 13px; color: #64748b; font-weight: 600; text-transform: uppercase;">Instant UPI Payment</p>
         <p style="margin: 0; font-size: 16px; font-weight: bold; color: #0284c7;">${params.upiId}</p>
         ${params.upiName ? `<p style="margin: 4px 0 0 0; font-size: 13px; color: #475569;">Payee: ${params.upiName}</p>` : ''}
       </div>`
    : '';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Khata Statement Reminder</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px;">
  <div style="max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
    <div style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); padding: 24px; text-align: center; color: #ffffff;">
      <h1 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">${params.storeName}</h1>
      <p style="margin: 6px 0 0 0; font-size: 13px; opacity: 0.9;">Digital Khata & Udhaar Statement</p>
    </div>
    
    <div style="padding: 28px 24px;">
      <p style="margin: 0 0 16px 0; font-size: 16px; color: #1e293b;">
        Dear <strong>${params.customerName}</strong>,
      </p>
      
      <p style="margin: 0 0 20px 0; font-size: 14px; color: #475569; line-height: 1.5;">
        This is a friendly reminder regarding your pending balance with <strong>${params.storeName}</strong>. Kindly review the statement details below:
      </p>
      
      <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 18px; text-align: center; margin-bottom: 20px;">
        <span style="font-size: 13px; font-weight: 600; color: #166534; text-transform: uppercase; letter-spacing: 0.5px;">Outstanding Due Amount</span>
        <div style="font-size: 32px; font-weight: 800; color: #15803d; margin: 8px 0 0 0;">${formattedBalance}</div>
      </div>

      ${upiSection}

      <p style="margin: 24px 0 0 0; font-size: 13px; color: #64748b; line-height: 1.5;">
        If you have already paid this amount, please disregard this email. For any queries, please reach out to us${params.phone ? ` at <strong>${params.phone}</strong>` : ''}.
      </p>
      
      <div style="margin-top: 28px; padding-top: 18px; border-top: 1px solid #f1f5f9; text-align: center; font-size: 12px; color: #94a3b8;">
        Sent via CreditTrack Smart Retailer Suite
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}
