import { TriangleAlert } from "lucide-react";

const ConfirmLogoutModal = ({ onClose, handleLogout }) => {
  return(
    <div 
      className="fixed inset-0 top-0 left-0 h-screen w-full grid items-center justify-center bg-black/50 backdrop-blur-sm z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white/90 p-6 rounded-lg flex flex-col gap-4 items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-yellow-400/50 rounded-full p-8 grid items-center justify-center">
          <TriangleAlert size={40} />
        </div>
        <p className="text-gray-600 font-bold">
          Are you sure you would like to sign out of your account?
        </p>
        <div className="flex flex-row gap-4 justify-end w-full">
          <button 
            className="bg-red-400 px-4 py-2 font-bold rounded text-white"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="bg-blue-400 px-4 py-2 font-bold rounded text-white"
            onClick={handleLogout}
          >
            Signout
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmLogoutModal;