import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon
} from "react-share";
import { useState } from "react";
import { Copy, Check } from "lucide-react"

const ShareDrawer = ({ open, onClose, url, title }) => {
  if (!open) return null;

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-gray-800 p-4 rounded-lg w-80">
        <h2 className="text-lg font-semibold mb-4 text-white">Share</h2>
        <div className="flex gap-3">
          <FacebookShareButton url={url} quote={title}>
            <FacebookIcon size={40} round />
          </FacebookShareButton>
          <TwitterShareButton url={url} title={title}>
            <TwitterIcon size={40} round />
          </TwitterShareButton>
          <LinkedinShareButton url={url}>
            <LinkedinIcon size={40} round />
          </LinkedinShareButton>
          <WhatsappShareButton url={url} title={title}>
            <WhatsappIcon size={40} round />
          </WhatsappShareButton>
        </div>
        {/* Copy Link Button */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-2  bg-gray-100 hover:bg-gray-200 px-4 mt-2 py-2 rounded-lg transition"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-green-600 font-medium">Link Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-gray-700" />
              <span className="text-gray-700 font-medium">Copy Link</span>
            </>
          )}
        </button>
        <button
          onClick={onClose}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-500 text-white rounded py-2"
        >
          Close
        </button>

      </div>
    </div>
  );
};

export default ShareDrawer;