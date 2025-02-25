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

interface LoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginDialog({ isOpen, onClose }: LoginDialogProps) {
  const success = async (credentialResponse: any) => {
    message.loading('working...', 24000).then(async ({ destory }: any) => {
      const response = await axios.post(`${BACKEND_URL}/v1/signup`, credentialResponse);

      if (response.data?.success) {
        localStorage.setItem("token", response.data.token);
        destory();
        message.success('Login successful 🎉', 4000);
        onClose();
        window.location.href = "/";
      } else {
        destory();
        message.error('Error 😪😯', 4000);
      }
    });
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Login to Your Account</DialogTitle>
          <DialogDescription>
            Choose your preferred login method
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center py-4">
          <GoogleLogin
            width="100%"
            size="large"
            text="continue_with"
            onSuccess={success}
            onError={() => {
              console.log("Login Failed");
              message.error('Login Failed 😪', 4000);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
