'use client';

import { useRouter } from 'next/navigation';
import { postManualContact } from './manualContactApi';

// Opens a chat in the owner's own WhatsApp/Telegram and logs it as messaged for this search.
export default function ChatButtons({ tutorId, phone, message, label }) {
  const router = useRouter();
  const logMessaged = () => {
    postManualContact({ tutorId, label }).then(() => router.refresh()).catch(() => {});
  };

  return (
    <div className="mt-3 grid grid-cols-2 gap-2">
      <a
        href={`https://wa.me/65${phone}${message ? `?text=${encodeURIComponent(message)}` : ''}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={logMessaged}
        className="rounded-md bg-[#25D366] px-3 py-2 text-center text-sm font-semibold text-white hover:opacity-90"
      >
        WhatsApp
      </a>
      <a
        href={`https://t.me/+65${phone}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={logMessaged}
        className="rounded-md bg-[#229ED9] px-3 py-2 text-center text-sm font-semibold text-white hover:opacity-90"
      >
        Telegram
      </a>
    </div>
  );
}
