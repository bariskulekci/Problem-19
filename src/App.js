import { useEffect, useState, useRef } from "react";

// Bu bileşen modal (dialog) bileşeni oluşturur ve isOpen state değişkeni true olduğunda modal açılır.
// Görevler:
// 1. Modal bileşenini yalnızca isOpen true olduğunda görünür hale getirin.
//    - Modal kapatıldığında, isOpen state'i false olarak güncellenmeli ve modal gizlenmelidir.
// 2. Kullanıcı, modal dışında bir yere tıkladığında modal kapatılmalıdır (örneğin, onClick ile bu durumu yönetin).
// 3. "Modal açık" başlığını dinamik hale getirin ve açılan modalın içeriğinin props ile özelleştirilmesine izin verin.
// 4. Modal kapatıldığında veya açıldığında konsola bir mesaj yazdırın (örn. "Modal açıldı" veya "Modal kapatıldı").

// Bonus:
// - Modal açıldığında, Escape tuşuna basılarak modalın kapatılabilmesini sağlayın.
// - Modal açıldığında arka planı karartarak kullanıcı dikkatini modala odaklayın (örneğin, yarı saydam bir siyah katman ekleyin).
// - Modal, ekran boyutlarına göre responsive olacak şekilde tasarlanmalıdır (mobil cihazlar için daha küçük bir boyut, geniş ekranlar için daha büyük bir boyut).
// - Kullanıcı modal açıkken sayfayı kaydırmayı engelleyin.

// Tailwind ile ilgili istekler:
// 1. Modal çerçevesine ve içeriğine gölge ekleyin (`shadow-lg`) ve daha belirgin tasarım sağlayın.
// 2. Modal açıkken, "Kapalı" butonuna hover veya focus durumlarında görsel geri bildirim sağlayın (örneğin, arka plan rengini veya gölgeyi değiştirin).
// 3. Arka plan karartma efekti için Tailwind kullanarak yarı saydam bir siyah katman (bg-black/50) ekleyin.
// 4. Mobil cihazlarda modalın kenarlıklarının ekrana taşmamasını sağlayacak iç kenar boşlukları (p-4) ekleyin.
// 5. Modal içeriğini ve kapat butonunu, özellikle ekran okuyucular (screen readers) için erişilebilir hale getirin (örneğin, aria-labelledby ve aria-hidden gibi erişilebilirlik özniteliklerini kullanın).

export default function App() {
  const [isOpen, setOpen] = useState(false);

  function openModal() {
    setOpen(true)
  }

  function closeModal() {
    setOpen(false)
  }

  const handleToggle = () => {
    setOpen((pre) => !pre);
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <button
        onClick={openModal}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
      >
        Modalı Aç
      </button>
      <Modal isOpen={isOpen} onClose={closeModal}>
        <h1 className="text-lg font-bold pb-4" id="modal-title">
          Dinamik Modal Başlığı
        </h1>
        <p>Bu modal içerik bölgesidir. Props ile özelleştirebilirsiniz.</p>
        <button
          onClick={closeModal}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:ring-2 focus:ring-red-500"
        >
          Kapat
        </button>
      </Modal>
    </div>
  );
}

function Modal({ isOpen, onClose, children }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (isOpen) {
      dialog.showModal();
      console.log("Modal açıldı");
      document.body.style.overflow = "hidden";
    } else {
      dialog.close();
      console.log("Modal kapatıldı");
      document.body.style.overflow = "";
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (event) => {
    if (event.target === dialogRef.current) {
      onClose();
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          aria-hidden="true"
        ></div>
      )}
      <dialog
        ref={dialogRef}
        onClick={handleBackdropClick}
        className={`fixed inset-0 z-50 p-4 rounded-lg shadow-lg max-w-full max-h-full overflow-auto ${
          isOpen ? "block" : "hidden"
        }`}
        aria-labelledby="modal-title"
      >
        <div className="bg-white p-6 rounded-lg">{children}</div>
      </dialog>
    </>
  );
}