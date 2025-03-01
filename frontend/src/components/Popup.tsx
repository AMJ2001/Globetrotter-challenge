import React from 'react';
import Modal from 'react-modal'; // You can use react-bootstrap modal or create your own

interface PopUpProps {
  isOpen: boolean;
  onRequestClose: () => void;
  inviteLink: string;
  imageUrl: string;
}

const PopUp: React.FC<PopUpProps> = ({ isOpen, onRequestClose, inviteLink, imageUrl }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink);
    alert('Invite link copied to clipboard!');
  };

  const inviteViaWhatsApp = () => {
    const text = encodeURIComponent(`Join me in the Globetrotter Challenge! 🌍 ${inviteLink}`);
    const fullUrl = `https://wa.me/?text=${text}`;
    window.open(fullUrl, "_blank");
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Invite Friend"
      className="modal"
      overlayClassName="overlay"
    >
      <h2>Invite a Friend to Globetrotter Challenge</h2>
      <img src={imageUrl} alt="Dynamic Invite" className="invite-image" />
      <p>Share this link with your friend:</p>
      <input type="text" value={inviteLink} readOnly className="invite-link" />
      <div className="button-group">
        <button onClick={copyToClipboard} className="copy-button">Copy Link</button>
        <button onClick={inviteViaWhatsApp} className="whatsapp-button">
          <i className="fab fa-whatsapp"></i> Invite via WhatsApp
        </button>
        <button onClick={onRequestClose} className="close-button">Close</button>
      </div>
    </Modal>
  );
};

export default PopUp;
