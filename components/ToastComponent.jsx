import { Flip, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Toast Component to render ToastContainer
const ToastComponent = () => {
  return <ToastContainer position="top-right" theme="colored"
transition={Flip} autoClose={3000} />;
};

// Export toast functions correctly
export const showToast = {
  success: (message) => toast.success(message),
  error: (message) => toast.error(message),
  info: (message) => toast.info(message),
  warning: (message) => toast.warning(message),
};

export default ToastComponent; // Default export for the container
