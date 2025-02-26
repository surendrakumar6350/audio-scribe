import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { GoogleLogin } from "@react-oauth/google";
import { message } from 'react-message-popup'
import axios from "axios";
import { BACKEND_URL } from "../../constants/constants"

// Props interface for LoginDialog component
interface LoginDialogProps {
  isOpen: boolean;      // Controls dialog visibility
  onClose: () => void;  // Function to handle dialog close
}

// LoginDialog component provides Google OAuth authentication functionality
export function LoginDialog({ isOpen, onClose }: LoginDialogProps) {
  // Handles successful Google login
  // credentialResponse contains the OAuth token from Google
  const success = async (credentialResponse: any) => {
    // Show loading message while processing authentication
    message.loading('working...', 24000).then(async ({ destory }: any) => {
      // Send Google credentials to backend for verification/signup
      const response = await axios.post(`${BACKEND_URL}/v1/signup`, credentialResponse);

      if (response.data?.success) {
        // Store authentication token in localStorage
        localStorage.setItem("token", response.data.token);
        destory();  // Remove loading message
        // Show success message
        message.success('Login successful 🎉', 4000);
        onClose();  // Close the dialog
        // Redirect to home page
        window.location.href = "/";
      } else {
        destory();  // Remove loading message
        // Show error message if login fails
        message.error('Error 😪😯', 4000);
      }
    });
  };

  // Render the login dialog using shadcn/ui Dialog component
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Login to Your Account</DialogTitle>
          <DialogDescription>
            Choose your preferred login method
          </DialogDescription>
        </DialogHeader>
        {/* Google Login button container */}
        <div className="flex items-center justify-center py-4">
          <GoogleLogin
            width="100%"
            size="large"
            text="continue_with"
            onSuccess={success}  // Handle successful login
            onError={() => {
              console.log("Login Failed");
              message.error('Login Failed 😪', 4000);  // Show error message on login failure
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}