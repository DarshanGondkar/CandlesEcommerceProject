import toast from "react-hot-toast";

export const showSuccess = (message) =>
  toast.success(message);

export const showError = (message) =>
  toast.error(message);

export const showInfo = (message) =>
  toast(message);

/*export const showInfo = (message) =>
  toast.info(message, {
    icon: "ℹ️🕯",
  });
  
  // Simple info toast
export const showInfo = (message) => {
  toast(message, {
    duration: 3000,
    position: 'top-center',
    icon: 'ℹ️',
  });
};*/


// Custom toast with OK button


// Toast with OK button (using toast.custom with createElement)
