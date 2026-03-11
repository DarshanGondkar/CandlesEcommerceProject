import toast from 'react-hot-toast';

// Toast with OK button
export const showToastWithOK = (message) => {
  toast.custom((t) => (
    <div className="flex items-center gap-4 bg-white dark:bg-gray-800 px-6 py-4 rounded-lg shadow-lg border border-gray-200">
      <span className="flex-1 text-gray-900 dark:text-white">{message}</span>
      <button
        onClick={() => toast.dismiss(t.id)}
        className="px-4 py-1 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition"
      >
        OK
      </button>
    </div>
  ), {
    duration: 6000,
    position: '',
  });
};

// Success toast with OK button
export const showSuccessWithOK = (message) => {
  toast.custom((t) => (
    <div className="flex items-center gap-4 bg-green-50 dark:bg-green-900/20 px-6 py-4 rounded-lg shadow-lg border border-green-200">
      <span className="material-symbols-outlined text-green-600">check_circle</span>
      <span className="flex-1 text-gray-900 dark:text-white font-medium">{message}</span>
      <button
        onClick={() => toast.dismiss(t.id)}
        className="px-4 py-1 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition"
      >
        OK
      </button>
    </div>
  ), {
    duration: 6000,
    position: 'top-center',
  });
};

// Error toast with OK button
export const showErrorWithOK = (message) => {
  toast.custom((t) => (
    <div className="flex items-center gap-4 bg-red-50 dark:bg-red-900/20 px-6 py-4 rounded-lg shadow-lg border border-red-200">
      <span className="material-symbols-outlined text-red-600">error</span>
      <span className="flex-1 text-gray-900 dark:text-white font-medium">{message}</span>
      <button
        onClick={() => toast.dismiss(t.id)}
        className="px-4 py-1 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition"
      >
        OK
      </button>
    </div>
  ), {
    duration: 6000,
    position: 'top-center',
  });
};

// Confirmation dialog (Yes/Cancel)
export const showConfirm = (message, onConfirm) => {
  toast.custom((t) => (
    <div className="max-w-md bg-white dark:bg-gray-800 shadow-2xl rounded-xl p-6 border border-gray-200">
      <p className="text-gray-900 dark:text-white mb-6 text-center">{message}</p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition font-semibold"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            onConfirm();
            toast.dismiss(t.id);
          }}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-semibold"
        >
          Yes
        </button>
      </div>
    </div>
  ), {
    duration: Infinity,
    position: 'top-center',
  });
};